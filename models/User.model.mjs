import {DataTypes} from 'sequelize'
import {sequelize} from '../config/database.mjs'

const User = sequelize.define('user', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull:false
    },
    password: {
        type: DataTypes.STRING,
        allowNull:false
    }
}, 
{
    freezeTableName: true
});

export {User}