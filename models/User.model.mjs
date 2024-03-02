import {DataTypes} from 'sequelize'
import DatabaseFactory from '../config/DatabaseAdapter.mjs';

const sequelize = DatabaseFactory.createDatabase().sequelize;

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
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false
    },
    online_status: {
        type: DataTypes.STRING,
        allowNull: false
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
    return await User.create({ username: username, password: password, status:"place_holder", online_status:"online"});
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

/**
 * Find the user with input username in User table
 * @param {string} username The username as the string 
 * @returns a list with user object which match the username, empty array will be return if username not exist in database
 */
async function getOneUser(username){
    return await User.findAll({
        where: { username: username },
    });
}

/**
 * Get the full list of user
 * @returns a list with all user in User table
 */
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

export async function getUserById(user_id){
    return await User.findByPk(user_id)

}

/**
 * Change the online status of the sepcific user id
 * @param {integer} id The user id
 * @param {string} status The status wants to be changed to
 */
export async function changeOnlineStatus(id, status){
    User.update({online_status:status},{
        where: {
            user_id: id
        }
    })
}

/**
 * Change the status of the sepcific user id
 * @param {integer} id The user id
 * @param {string} status The status wants to be changed to
 */
export async function changeStatus(id, status){
    User.update({status:status},{
        where: {
            user_id: id
        }
    })
}