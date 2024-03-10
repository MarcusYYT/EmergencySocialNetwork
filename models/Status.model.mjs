import {DataTypes} from 'sequelize'
import { User } from './User.model.mjs'
import DatabaseAdapter from '../config/DatabaseAdapter.mjs';

const sequelize = DatabaseAdapter.createDatabase().sequelize;

export const Status = sequelize.define('status', {
    status_id: {
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
    status: {
        type: DataTypes.STRING,
        allowNull:false
    }
}, 
{
    freezeTableName: true
});

Status.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});
User.hasMany(Status, {
    foreignKey: 'user_id'
});

/**
 * Create a new status
 * @param {number} userId - The ID of the user who is creating the status history
 * @param {string} status - The status user updated
 * @returns The promise of this method
 */
export async function createStatus(userId, status) {
    return await Status.create({
        user_id: userId,
        status: status
    });
}

/**
 * Get a status by its ID
 * @param {number} status_id - The ID of the status
 * @returns The promise , if resolve, return status with the given ID, or null if not found
 */
export async function getStatusById(status_id) {
    return await Status.findByPk(status_id);
}

/**
 * Get all status history by a specific user
 * @param {number} userId - The ID of the user
 * @returns An array of statuses created by the user
 */
export async function getStatusByUser(userId) {
    return await Status.findAll({
        where: {
            user_id: userId
        }
    });
}