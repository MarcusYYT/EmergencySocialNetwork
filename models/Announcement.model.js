import {DataTypes, Op} from 'sequelize'
import { User } from './User.model.js'

export class Announcement {
    static model = null;

    static initModel(sequelize) {
        this.model = sequelize.define('announcement', {
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

        this.model.belongsTo(User.model, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE'
        });
        User.model.hasMany(this.model, {
            foreignKey: 'user_id'
        });
    }


    /**
     * Create a new announcement
     * @param {number} userId - The ID of the user who is creating the announcement
     * @param {string} content - The content of the announcement
     * @returns The created announcement
     */
    static async createAnnouncement(userId, content) {
        return await this.model.create({
            user_id: userId,
            content: content
        });
    }

    /**
     * Get a announcement by its ID
     * @param {number} announcement_id - The ID of the announcement
     * @returns The announcement with the given ID, or null if not found
     */
    static async getAnnouncementById(announcement_id) {
        return await this.model.findByPk(announcement_id);
    }

    /**
     * Get all announcements by a specific user
     * @param {number} userId - The ID of the user
     * @returns An array of announcements created by the user
     */
    static async getAnnouncementsByUser(userId) {
        return await this.model.findAll({
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
    static async getAnnouncementsByUsername(username) {
        return await this.model.findAll({
            include: [{
                model: User.model,
                where: { username: username }
            }]
        });
    }

    /**
     * Get all announcements
     * @returns An array of all announcements
     */
    static async getAllAnnouncements() {
        
        return await this.model.findAll({
            include: [{
            model: User.model,
            attributes: ['username']
            }]
        });
    }

    /**
     * Delete a announcement
     * @param {number} announcementId - The ID of the announcement to delete
     * @returns The number of deleted announcements (1 if successful, 0 if not found)
     */
    static async deleteAnnouncement(announcementId) {
        return await this.model.destroy({
            where: {
                announcement_id: announcementId
            }
        });
    }


    /**
     * Query the announcements by keyword
     * @param {string} query The keyword
     */
    static async queryAnnouncement(query) {
        return await this.model.findAll({
            where: {
                content: {[Op.like]: `%${query}%`}
            },
            include: [{
                model: User.model,
                attributes: ['username']
            }],
            order: [['createdAt', 'DESC']]
        });
    }
}