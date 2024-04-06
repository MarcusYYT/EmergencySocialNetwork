import {DataTypes, Op} from 'sequelize'
import { User } from './User.model.js'

export class Thread {
    static model = null;

    static initModel(sequelize) {
        this.model = sequelize.define('thread', {
            thread_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            creator_id:{
                type: DataTypes.INTEGER,
                allowNull:false,
                references: {
                    model: User.model,
                    key: 'user_id'
                }
            },

            thread_name:{
                type: DataTypes.STRING,
                allowNull:false,
            },

            urgency: {
                type: DataTypes.STRING,
                allowNull:false
            }
        }, 
        {
            freezeTableName: true
        });

        this.model.belongsTo(User.model, {
            as: 'Creator',
            foreignKey: 'creator_id'
        });

        User.model.hasMany(this.model, { foreignKey: 'creator_id', onDelete: 'CASCADE' });

        
    }


    /**
     * Create a new thread
     * @param {number} creatorId - The ID of the user who is creating the thread
     * @param {string} threadName
     * @param {string} urgency - The urgency of the thread
     * @returns The created thread
     */
    static async createThread(creatorId, threadName, urgency) {
        return await this.model.create({
            creator_id: creatorId,
            thread_name: threadName,
            urgency: urgency
        });
    }

    /**
     * Get a thread by its ID
     * @param {number} thread_id - The ID of the thread
     * @returns The thread with the given ID, or null if not found
     */
    static async getThreadById(thread_id) {
        return await this.model.findByPk(thread_id);
    }

    // /**
    //  * Get all threads by a specific user
    //  * @param {number} userId - The ID of the user
    //  * @returns An array of threads created by the user
    //  */
    // static async getThreadsByUser(userId) {
    //     return await this.model.findAll({
    //         where: {
    //             user_id: userId
    //         }
    //     });
    // }

    // /**
    //  * Get all threads by a specific username
    //  * @param {string} username - The username of the user
    //  * @returns An array of threads created by the user with the given username
    //  */
    // static async getThreadsByUsername(username) {
    //     return await this.model.findAll({
    //         include: [{
    //             model: User.model,
    //             where: { username: username }
    //         }]
    //     });
    // }

    /**
     * Get all threads
     * @returns An array of all threads
     */
    static async getAllThreads() {
        
        return await this.model.findAll({
            include: [{
            model: User.model,
            attributes: ['username']
            }]
        });
    }

    /**
     * Delete a thread
     * @param {number} threadId - The ID of the thread to delete
     * @returns The number of deleted threads (1 if successful, 0 if not found)
     */
    static async deleteThread(threadId) {
        return await this.model.destroy({
            where: {
                thread_id: threadId
            }
        });
    }


    // /**
    //  * Query the threads by keyword
    //  * @param {string} query The keyword
    //  */
    // static async queryThread(query) {
    //     return await this.model.findAll({
    //         where: {
    //             urgency: {[Op.like]: `%${query}%`}
    //         },
    //         include: [{
    //             model: User.model,
    //             attributes: ['username']
    //         }],
    //         order: [['createdAt', 'DESC']]
    //     });
    // }
}