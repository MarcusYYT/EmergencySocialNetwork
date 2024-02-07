import {User} from '../models/User.model.mjs'
import {bcrypt} from 'bcrypt'
let saltRounds = 10

/**
 * This function will inster a row to the user table with username and password 
 * @param {string} username The username passed from the frontend
 * @param {string} password The password passed from the frontend
 */
export async function createNewUser(username, password){
    let hash = await bcrypt.hash(password, saltRounds)
    await User.create({ username: username, password: hash })
}

/**
 * The function to check if a user is exist in database by username
 * @param {string} username The username passed from the frontend
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
 * @param {string} username The username passed from the frontend
 * @param {string} enteredPassword The password entered by user from the frontend
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
    const hashedPassword = userQueryResult.toJSON().password
    const match = await comparePassword(enteredPassword, hashedPassword)
    if (match){
        return true
    } else {
        return false
    }
}