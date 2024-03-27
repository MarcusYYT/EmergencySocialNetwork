import {DataTypes} from 'sequelize'
import { User } from './User.model.js'

export class Status {
    static model = null;

    static initModel(sequelize) {
        this.model = sequelize.define('status', {
            status_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: User.model,
                    key: 'user_id'
                }
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false
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
     * Create a new status
     * @param {number} userId - The ID of the user who is creating the status history
     * @param {string} status - The status user updated
     * @returns The promise of this method
     */
    static async createStatus(userId, status) {
        return await this.model.create({
            user_id: userId,
            status: status
        });
    }

    /**
     * Get a status by its ID
     * @param {number} status_id - The ID of the status
     * @returns The promise , if resolve, return status with the given ID, or null if not found
     */
    static async getStatusById(status_id) {
        return await this.model.findByPk(status_id);
    }

    /**
     * Get all status history by a specific user
     * @param {number} userId - The ID of the user
     * @returns An array of statuses created by the user
     */
    static async getStatusByUser(userId) {
        return await this.model.findAll({
            where: {
                user_id: userId
            }
        });
    }
}