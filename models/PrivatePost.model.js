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

    /**
     * Create a private post using the sender id, receiver id, content and status of the sender
     * @param {number} senderId The user_id of the sender
     * @param {number} receiverId  - The user_id of the receiver
     * @param {string} content - The content of the private post
     * @param {string} status - The status of the sender
     * @returns {Promise} a promise containing the created post
     */
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

    /**
     * Get a private post by its post id
     * @param {number} postId The id of the post to look for
     * @returns {Promise} a promise containing the private post
     */
    static async getChatById(postId) {
        return await this.model.findByPk(postId);
    }

    /**
     * Get all private posts between two people
     * @param {number} senderId The id of the sender
     * @param {number} receiverId The id of the receiver
     * @returns {Promise} a promise containing messages between chatters
     * 
     */
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

    /**
     * Update post in the database to reflect that a user has read it
     * @param {number} postId The id of the sender
     * @returns {Promise} a promise containing the edited message in the database
     */
    static async senderRead(postId) {
        return await this.model.update({ sender_read: true }, {
            where: {
                post_id: postId
            }
        })
    }

     /**
     * Mark a message as read in the database
     * @param {number} senderId The id of the sender
     * @param {number} receiverId The id of the receiver
     * @returns {Promise} a promise containing the edited message in the database
     */
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


    /**
     * Gets the unread messages count for the receiver of a message using the receiver id
     * @param {number} receiverId The id of the receiver
     * @returns {Promise} the unread messages for the receiver of a message
     */
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
     * @param {number} senderId  - The user_id of the sender
     * @param {number} receiverId - The user_id of the reciever
     * @returns {Promise} the posts returned by the query
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