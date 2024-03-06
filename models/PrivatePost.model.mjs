import {DataTypes, Op}  from "sequelize";
import {User} from "./User.model.mjs";
import DatabaseAdapter from '../config/DatabaseAdapter.mjs';

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
    }
});

User.hasMany(PrivatePost, { foreignKey: 'sender_id', onDelete:'CASCADE'});
User.hasMany(PrivatePost, { foreignKey: 'receiver_id', onDelete:'CASCADE' });
PrivatePost.belongsTo(User, { as: 'Sender', foreignKey: 'sender_id' });
PrivatePost.belongsTo(User, { as: 'Receiver', foreignKey: 'receiver_id' });

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
 * @param {integer} reveiverId - The user_id of the reciever
 * @returns An array of chats by the users
 */
export async function getChatByChatters(senderId, receiverId) {
    return await PrivatePost.findAll({
        where: {
            [Op.or]: [
                { sender_id: senderId, receiver_id: receiverId },
                { sender_id: receiverId, receiver_id: senderId }
            ]
        }
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
 * Mark the reader as read
 * @param {integer} postId post_id
 */
export async function readerRead(postId) {
    return await PrivatePost.update({reader_read: true}, {
        where: {
            post_id: postId
        }
    })
}