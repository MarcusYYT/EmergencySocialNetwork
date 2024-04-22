import {DataTypes, Op} from 'sequelize'
import { User } from './User.model.js'
export class Post {
    static model = null;

    static initModel(sequelize) {
        this.model = sequelize.define('post', {
            post_id: {
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
    }

    /**
     * Create a new post
     * @param {number} userId - The ID of the user who is creating the post
     * @param {string} content - The content of the post
     * @param {string} status - The status when the user push the post
     * @returns {Promise} The created post
     */
    static async createPost(userId, content, status) {
        return await this.model.create({
            user_id: userId,
            content: content,
            status: status
        });
    }

    /**
     * Get a post by its ID
     * @param {number} post_id - The ID of the post
     * @returns {Promise} The post with the given ID, or null if not found
     */
    static async getPostById(post_id) {
        return await this.model.findByPk(post_id);
    }

    /**
     * Get all posts by a specific user
     * @param {number} userId - The ID of the user
     * @returns {Promise} An array of posts created by the user
     */
    static async getPostsByUser(userId) {
        return await this.model.findAll({
            where: {
                user_id: userId
            }
        });
    }

    /**
     * Get all posts by a specific username
     * @param {string} username - The username of the user
     * @returns {Promise} An array of posts created by the user with the given username
     */
    static async getPostsByUsername(username) {
        return await this.model.findAll({
            include: [{
                model: User.model,
                where: { username: username }
            }]
        });
    }

    /**
     * Get all posts
     * @returns {Promise} An array of all posts
     */
    static async getAllPosts() {
        return await this.model.findAll({
            include: [{
              model: User.model,
              attributes: ['username']
            }]
          });
    }


    /**
     * Query the posts by keyword
     * @param {string} query The keyword
     * @returns {Promise} The posts found by the query
     */
    static async queryPosts(query) {
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

    /**
     * Delete a post
     * @param {number} postId - The ID of the post to delete
     * @returns {Promise} The number of deleted posts (1 if successful, 0 if not found)
     */
    static async deletePost(postId) {
        return await this.model.destroy({
            where: {
                post_id: postId
            }
        });
    }
}