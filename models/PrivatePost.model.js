import {DataTypes, Op}  from "sequelize";
import {User} from "./User.model.js";
import DatabaseAdapter from "../config/DatabaseAdapter.js";

export class PrivatePost {
    static model = null;

    static initModel(sequelize) {
        this.model = sequelize.define('private_post', {
            post_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            sender_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: User.model,
                    key: 'user_id'
                }
            },
            receiver_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: User.model,
                    key: 'user_id'
                }
            },
            content: {
                type: DataTypes.STRING,
                allowNull: false
            },
            sender_read: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            receiver_read: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, 
        {
            freezeTableName: true
        });

        User.model.hasMany(this.model, { foreignKey: 'sender_id', onDelete: 'CASCADE' });
        User.model.hasMany(this.model, { foreignKey: 'receiver_id', onDelete: 'CASCADE' });
        this.model.belongsTo(User.model, { as: 'Sender', foreignKey: 'sender_id' });
        this.model.belongsTo(User.model, { as: 'Receiver', foreignKey: 'receiver_id' });
    }

    static async createPost(senderId, receiverId, content, status) {
        return await this.model.create({
            sender_id: senderId,
            receiver_id: receiverId,
            sender_read: true,
            receiver_read: false,
            content: content,
            status: status
        });
    }

    static async getChatById(postId) {
        return await this.model.findByPk(postId);
    }

    static async getChatByChatters(senderId, receiverId) {
        return await this.model.findAll({
            where: {
                [Op.or]: [
                    { sender_id: senderId, receiver_id: receiverId },
                    { sender_id: receiverId, receiver_id: senderId }
                ]
            }, 
            include: [
                { model: User.model, as: 'Sender', attributes: ['username'] },
                { model: User.model, as: 'Receiver', attributes: ['username'] }
            ]    
        })
    }

    static async senderRead(postId) {
        return await this.model.update({ sender_read: true }, {
            where: {
                post_id: postId
            }
        })
    }

    static async markMessagesAsRead(senderId, receiverId) {
        return await this.model.update(
            { receiver_read: true },
            {
                where: {
                    sender_id: senderId,
                    receiver_id: receiverId,
                    receiver_read: false
                }
            }
        );
    }

    static async getUnreadMessageCountsForReceiver(receiverId) {
        const sequelize = DatabaseAdapter.getDatabase();
        const unreadMessages = await this.model.findAll({
            where: {
                receiver_id: receiverId,
                receiver_read: false
            },
            include: [
                { model: User.model, as: 'Sender', attributes: ['user_id', 'username'] }
            ],
            attributes: ['sender_id', [sequelize.fn('COUNT', sequelize.col('post_id')), 'unreadCount']],
            group: ['sender_id', 'Sender.user_id', 'Sender.username'],
        });

        return unreadMessages.map(message => ({
            sender: {
                id: message.Sender.user_id,
                username: message.Sender.username
            },
            unreadCount: message.dataValues.unreadCount
        }));
    }




    /**
     * Query the posts by keyword
     * @param {string} query The keyword
     * @param {integer} senderId  - The user_id of the sender
     * @param {integer} receiverId - The user_id of the reciever
     */
    static async queryPrivatePosts(senderId, receiverId, query) {

        return await this.model.findAll({
            where: {
                [Op.or]: [
                    { sender_id: senderId, receiver_id: receiverId },
                    { sender_id: receiverId, receiver_id: senderId }
                ],
                content: { [Op.like]: `%${query}%` }
            },
            include: [
                { model: User.model, as: 'Sender', attributes: ['username'] },
                { model: User.model, as: 'Receiver', attributes: ['username'] }
            ],
            order: [['createdAt', 'DESC']]
        });
    }
}