import {DataTypes, Op}  from "sequelize";
import {User} from "./User.model.js";
import DatabaseAdapter from '../config/DatabaseAdapter.js';

const sequelize = DatabaseAdapter.createDatabase().sequelize;

export const PrivatePost = sequelize.define("private_post", {
    post_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sender_read: {
        type: DataTypes.BOOLEAN,
        default: false,
        allowNull: false
    },
    receiver_read: {
        type: DataTypes.BOOLEAN,
        default: false,
        allowNull: false
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false
    }
}, 
{
    freezeTableName: true
});

User.hasMany(PrivatePost, { foreignKey: 'sender_id', onDelete:'CASCADE'});
User.hasMany(PrivatePost, { foreignKey: 'receiver_id', onDelete:'CASCADE' });
PrivatePost.belongsTo(User, { as: 'Sender', foreignKey: 'sender_id' });
PrivatePost.belongsTo(User, { as: 'Receiver', foreignKey: 'receiver_id' });


export async function createPost(senderId, receiverId, content, status) {
    return await PrivatePost.create({
        sender_id: senderId,
        receiver_id: receiverId,
        sender_read: true,
        receiver_read: false,
        content: content,
        status: status
    });
}

/**
 * Get a private chat by its ID
 * @param {integer} post_id - The ID of the chat
 * @returns The post with the given ID, or null if not found
 */
export async function getChatById(postId) {
    return await PrivatePost.findByPk(postId);
}

/**
 * Get all chats between two users
 * @param {integer} senderId  - The user_id of the sender
 * @param {integer} receiverId - The user_id of the reciever
 * @returns An array of chats by the users
 */
export async function getChatByChatters(senderId, receiverId) {
    return await PrivatePost.findAll({
        where: {
            [Op.or]: [
                { sender_id: senderId, receiver_id: receiverId },
                { sender_id: receiverId, receiver_id: senderId }
            ]
        }, 
        include: [
            { model: User, as: 'Sender', attributes: ['username'] },
            { model: User, as: 'Receiver', attributes: ['username'] }
        ]    
    })
}

/**
 * Mark the sender as read
 * @param {integer} postId post_id
 */
export async function senderRead(postId) {
    return await PrivatePost.update({sender_read: true}, {
        where: {
            post_id: postId
        }
    })
}


/**
 * Mark all messages as read in a private chat room between a specific sender and receiver.
 * @param {number} senderId - The ID of the sender.
 * @param {number} receiverId - The ID of the receiver.
 * @returns {Promise<number>} A promise that resolves with the number of affected rows.
 */
export async function markMessagesAsRead(senderId, receiverId) {
    try {
        const [affectedRows] = await PrivatePost.update(
            { receiver_read: true },
            {
                where: {
                    sender_id: senderId,
                    receiver_id: receiverId,
                    receiver_read: false
                }
            }
        );
        return affectedRows;
    } catch (error) {
        console.error('Error marking messages as read:', error);
        throw error;
    }
}

/**
 * Get all unread messages for a specific receiver, grouped by the sender.
 * @param {number} receiverId - The ID of the receiver.
 * @returns {Promise<Object>} A promise that resolves with an object where keys are sender IDs and values are arrays of unread messages from that sender.
 */
export async function getUnreadMessageCountsForReceiver(receiverId) {
    try {
        const unreadMessages = await PrivatePost.findAll({
            where: {
                receiver_id: receiverId,
                receiver_read: false
            },
            include: [
                { model: User, as: 'Sender', attributes: ['user_id', 'username'] }
            ],
            attributes: ['sender_id', [sequelize.fn('COUNT', sequelize.col('post_id')), 'unreadCount']],
            group: ['sender_id', 'Sender.user_id', 'Sender.username'],
        });

        // Map the results to a more readable format
        const unreadMessageCounts = unreadMessages.map(message => ({
            sender: {
                id: message.Sender.user_id,
                username: message.Sender.username
            },
            unreadCount: message.dataValues.unreadCount
        }));
        console.log(unreadMessageCounts);
        return unreadMessageCounts;
    } catch (error) {
        console.error('Error fetching unread message counts:', error);
        throw error;
    }
}