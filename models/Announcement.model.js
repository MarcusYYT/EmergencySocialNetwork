import {DataTypes, Op} from 'sequelize'
import { User } from './User.model.js'
import DatabaseAdapter from '../config/DatabaseAdapter.js';

const sequelize = DatabaseAdapter.createDatabase().sequelize;

export const Announcement = sequelize.define('announcement', {
    announcement_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull:false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    content: {
        type: DataTypes.STRING,
        allowNull:false
    }
}, 
{
    freezeTableName: true
});

Announcement.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});
User.hasMany(Announcement, {
    foreignKey: 'user_id'
});

/**
 * Create a new announcement
 * @param {number} userId - The ID of the user who is creating the announcement
 * @param {string} content - The content of the announcement
 * @returns The created announcement
 */
export async function createAnnouncement(userId, content) {
    return await Announcement.create({
        user_id: userId,
        content: content
    });
}

/**
 * Get a announcement by its ID
 * @param {number} announcement_id - The ID of the announcement
 * @returns The announcement with the given ID, or null if not found
 */
export async function getAnnouncementById(announcement_id) {
    return await Announcement.findByPk(announcement_id);
}

/**
 * Get all announcements by a specific user
 * @param {number} userId - The ID of the user
 * @returns An array of announcements created by the user
 */
export async function getAnnouncementsByUser(userId) {
    return await Announcement.findAll({
        where: {
            user_id: userId
        }
    });
}

/**
 * Get all announcements by a specific username
 * @param {string} username - The username of the user
 * @returns An array of announcements created by the user with the given username
 */
export async function getAnnouncementsByUsername(username) {
    return await Announcement.findAll({
        include: [{
            model: User,
            where: { username: username }
        }]
    });
}

/**
 * Get all announcements
 * @returns An array of all announcements
 */
export async function getAllAnnouncements() {
    
    return await Announcement.findAll({
        include: [{
          model: User,
          attributes: ['username']
        }]
      });
}

/**
 * Delete a announcement
 * @param {number} announcementId - The ID of the announcement to delete
 * @returns The number of deleted announcements (1 if successful, 0 if not found)
 */
export async function deleteAnnouncement(announcementId) {
    return await Announcement.destroy({
        where: {
            announcement_id: announcementId
        }
    });
}


/**
 * Query the announcements by keyword
 * @param {string} query The keyword
 */
export async function queryAnnouncement(query) {
    return await Announcement.findAll({
        where: {
            content: {[Op.like]: `%${query}%`}
        },
        include: [{
            model: User,
            attributes: ['username']
        }],
        order: [['createdAt', 'DESC']]
    });
}