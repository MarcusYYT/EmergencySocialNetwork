import {DataTypes, Op}  from "sequelize";
import {sequelize} from "../config/database.mjs";
import {User} from "./User.model.mjs";

export const PrivChat = sequelize.define("priv_chat", {
    chat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sender: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    receiver: {
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

/**
 * Get a private chat by its ID
 * @param {number} chat_id - The ID of the chat
 * @returns The post with the given ID, or null if not found
 */
export async function getChatById(chatId) {
    return await PrivChat.findByPk(chatId);
}

/**
 * Get all chats between two users
 * @param {number, number} senderId, reveiverId - The ID of the two users
 * @returns An array of chats by the users
 */
export async function getChatByChatters(senderId, reveiverId) {
    return await PrivChat.findAll({
        where: {
            [Op.or]: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }
    })
}

/**
 * Mark the sender as read
 * @param {integet} chatId chat_id
 */
export async function senderRead(chatId) {
    return await PrivChat.update({sender_read: true}, {
        where: {
            chat_id: chatId
        }
    })
}

/**
 * Mark the reader as read
 * @param {integet} chatId chat_id
 */
export async function readerRead(chatId) {
    return await PrivChat.update({reader_read: true}, {
        where: {
            chat_id: chatId
        }
    })
}