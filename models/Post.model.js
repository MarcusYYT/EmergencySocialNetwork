import {DataTypes, Op} from 'sequelize'
import { User } from './User.model.js'
import DatabaseAdapter from '../config/DatabaseAdapter.js';

const sequelize = DatabaseAdapter.createDatabase().sequelize;

export const Post = sequelize.define('post', {
    post_id: {
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
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false
    }
}, 
{
    freezeTableName: true
});

Post.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});
User.hasMany(Post, {
    foreignKey: 'user_id'
});

/**
 * Create a new post
 * @param {number} userId - The ID of the user who is creating the post
 * @param {string} content - The content of the post
 * @param {string} status - The status when the user push the post
 * @returns The created post
 */
export async function createPost(userId, content, status) {
    return await Post.create({
        user_id: userId,
        content: content,
        status: status
    });
}

/**
 * Get a post by its ID
 * @param {number} post_id - The ID of the post
 * @returns The post with the given ID, or null if not found
 */
export async function getPostById(post_id) {
    return await Post.findByPk(post_id);
}

/**
 * Get all posts by a specific user
 * @param {number} userId - The ID of the user
 * @returns An array of posts created by the user
 */
export async function getPostsByUser(userId) {
    return await Post.findAll({
        where: {
            user_id: userId
        }
    });
}

/**
 * Get all posts by a specific username
 * @param {string} username - The username of the user
 * @returns An array of posts created by the user with the given username
 */
export async function getPostsByUsername(username) {
    return await Post.findAll({
        include: [{
            model: User,
            where: { username: username }
        }]
    });
}

/**
 * Get all posts
 * @returns An array of all posts
 */
export async function getAllPosts() {
    
    return await Post.findAll({
        include: [{
          model: User,
          attributes: ['username']
        }]
      });
}

/**
 * Delete a post
 * @param {number} postId - The ID of the post to delete
 * @returns The number of deleted posts (1 if successful, 0 if not found)
 */
export async function deletePost(postId) {
    return await Post.destroy({
        where: {
            post_id: postId
        }
    });
}

/**
 * Query the posts by keyword
 * @param {string} query The keyword
 */
export async function queryPosts(query) {
    return await Post.findAll({
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