import {DataTypes} from 'sequelize'
import {sequelize} from '../config/database.mjs'

export const User = sequelize.define('user', {
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

/**
 * This function will insert one row into user table, with increment user_id, username and password
 * @param {string} username 
 * @param {string} password 
 */
export async function createUser(username, password){
    User.create({ username: username, password: password });
}

/**
 * The function to check if a user is exist in database by username
 * @param {string} username The username passed from the frontend
 * @returns The function will return true if the username is exist in database. Otherwise return false
 */
export async function ifUserExist(username) {
    const result = await User.findAll({
      where: { username: username },
    });
    if (result.length === 0) {
      // user does not exist
      return false;
    } else {
      // user exist
      return true;
    }
}

async function getOneUser(username){
    return await User.findAll({
        where: { username: username },
    });
}

async function getUserList(){
    return await User.findAll();
}

/**
 * This fnction will query the database to find a user, or output all user if no user specificed
 * @param {string} [username] - username is optional
 * @returns If no parameter passed, it will return all the user, if username parameter passed, it will return the specific user
 */
export async function getUser(username=null){
    if(username != null){
        return await getOneUser(username);
    } else {
        return await getUserList();
    }

} 