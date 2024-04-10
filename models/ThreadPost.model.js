import {DataTypes, Op} from 'sequelize'
import { User } from './User.model.js'
import { Thread } from './Thread.model.js';
export class ThreadPost {
    static model = null;

    static initModel(sequelize) {
        this.model = sequelize.define('thread_post', {
            post_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            thread_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: Thread.model,
                    key: 'thread_id'
                }
            },
            user_id: {
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
        this.model.belongsTo(Thread.model, {
            foreignKey: 'thread_id',
            onDelete: 'CASCADE'
        });
        Thread.model.hasMany(this.model, {
            foreignKey: 'thread_id'
        });
    }

    /**
     * Create a new post
     * @param {number} userId - The ID of the user who is creating the post
     * @param {string} content - The content of the post
     * @param {string} status - The status when the user push the post
     * @returns The created post
     */
    static async createThreadPost(userId, content, status, thread_id) {
        return await this.model.create({
            user_id: userId,
            content: content,
            status: status,
            thread_id: thread_id
        });
    }

    /**
     * Get a post by its ID
     * @param {number} post_id - The ID of the post
     * @returns The post with the given ID, or null if not found
     */
    static async getThreadPostById(post_id) {
        return await this.model.findByPk(post_id);
    }

    /**
     * Get all posts
     * @returns An array of all posts
     */
    static async getAllThreadPosts(thread_id) {
        return await this.model.findAll({
            where :{
                thread_id: thread_id
            }, 

            include: [{
              model: User.model,
              attributes: ['username']
            }]
          });
    }


    /**
     * Query the posts by keyword
     * @param {string} query The keyword
     */
    static async queryThreadPosts(thread_id, query) {
        return await this.model.findAll({
            where: {
                content: {[Op.like]: `%${query}%`},
                thread_id: thread_id
            },
            include: [{
                model: User.model,
                attributes: ['username']
            }],
            order: [['createdAt', 'DESC']]
        });
    }

    /**
     * Delete a post
     * @param {number} postId - The ID of the post to delete
     * @returns The number of deleted posts (1 if successful, 0 if not found)
     */
    static async deleteThreadPost(postId) {
        return await this.model.destroy({
            where: {
                post_id: postId
            }
        });
    }
}
