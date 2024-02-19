import {DataTypes} from 'sequelize'
import {sequelize} from '../config/database.mjs'
import { User } from './User.model.mjs'

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