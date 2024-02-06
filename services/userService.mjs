import {User} from '../models/User.model.mjs'

/**
 * This function will inster a row to the user table with username and password 
 * @param {string} username 
 * @param {string} password 
 */
export async function createNewUser(username, password){
    const newUser = await User.create({ username: username, password: password });
}

/**
 * The function to check if a user is exist in database by username
 * @param {string} username 
 * @returns The function will return true if the username is exist in database. Otherwise return false
 */
export async function ifUserExist(username) {
    const result = await User.findAll({
        where: { username: username }
      });
    if (result.length === 0){
        // user does not exist
        return false
    } else {
        // user exist
        return true
    }
}

/**
 * Check the username and password with the information stored in database
 * @param {string} username 
 * @param {string} enteredPassword 
 * @returns True if the username and password match, False if the username and password are not match or username not exist
 */
export async function Authenticate(username, enteredPassword){
    const userCheck = await ifUserExist(username)
    if (userCheck === false){
        return false
    }
    const userQueryResult = await User.findOne({
        where: {username: username}
    });
    const password = userQueryResult.toJSON().password

    if (password === enteredPassword){
        return true
    } else {
        return false
    }
}