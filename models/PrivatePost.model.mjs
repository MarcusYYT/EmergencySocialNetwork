import {DataTypes, Op}  from "sequelize";
import {sequelize} from "../config/database.mjs";
import {User} from "./User.model.mjs";

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

PrivatePost.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});
User.hasMany(PrivatePost, {
    foreignKey: 'user_id'
});

/**
 * Get a private chat by its ID
 * @param {integer} chat_id - The ID of the chat
 * @returns The post with the given ID, or null if not found
 */
export async function getChatById(chatId) {
    return await PrivatePost.findByPk(chatId);
}

/**
 * Get all chats between two users
 * @param {integer} sender_Id  - The user_id of the sender
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
 * @param {integer} chatId chat_id
 */
export async function senderRead(chatId) {
    return await PrivatePost.update({sender_read: true}, {
        where: {
            chat_id: chatId
        }
    })
}

/**
 * Mark the reader as read
 * @param {integer} chatId chat_id
 */
export async function readerRead(chatId) {
    return await PrivatePost.update({reader_read: true}, {
        where: {
            chat_id: chatId
        }
    })
}