import * as userModel from "../models/User.model.js";
import { getUsernameBanList } from "../config/usernameBanList.js";
import bcrypt from "bcryptjs";

let saltRounds = 10;

/**
 * This function will inster a row to the user table with username and password
 * @async
 * @param {string} username The username passed from the frontend
 * @param {string} password The password passed from the frontend
 */
export async function createNewUser(username, password) {
  let returnJson = {success: false, user_id: -1, message: "Create user failed"};
  try {
    if (await userModel.ifUserExist(username)) {
      returnJson.message = "Username already exists.";
      return returnJson;
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await userModel.createUser(username, hashedPassword);
    returnJson.success = true;
    returnJson.user_id = user.user_id;
    returnJson.message = "Create user successfully.";
  } catch (error) {
    console.log("Error creating user:", error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      returnJson.message = "Username already exists.";
    } else {
      returnJson.message = "An unexpected error occurred.";
    }
  }
  // await bcrypt.hash(password, saltRounds).then(async (res) => {
  //   await userModel.createUser(username, res).then((user)=>{
  //     returnJson.success = true;
  //     returnJson.user_id = user.user_id
  //     returnJson.message = "Create user successfully."
  //   });
  //
  // });
  return returnJson;
}

/**
 * TODO: Write the comment for jsdoc
 * @param {*} user_id 
 * @returns 
 */
export async function getUserById(user_id){
  let returnJson = {
    exist: null,
    data:[]
  }
  await userModel.getUserById(user_id).then((res) => {
    if(res != null){
      returnJson.exist = true;
      returnJson.data.push(res) 
    } else {
      returnJson.exist = false;
    }
  })

  return returnJson;
}

/**
 * TODO: write the function documentation
 * @returns 
 */
export async function getUserList(){
  let returnJson = {
    data:[],
    message:"initial message"
  }

  await userModel.getUser().then((res)=>{
    returnJson.message = "Fetch user list successful"
    returnJson.data = res;
  })

  return returnJson
}

/**
 * This function will check if the user name is in the ban list and less than 3 characters
 * @async
 * @param {string} username 
 * @returns True if the username is valid ,false ifnthe username is not valid
 */
export async function isUsernameValid(username) {
  username = username.toLowerCase();
  const banList = await getUsernameBanList();
  if (username.length < 3 || banList.includes(username)) {
    return false;
  } else {
    return true;
  }
}

/**
 * This function will check if the password is greater than 4 characters
 * @async
 * @param {string} password
 * @returns True if the password is longer than 4, false if not
 */
export async function isPasswordValid(password) {
  if (password.length <= 3) {
    return false;
  } else {
    return true;
  }
}

export async function changeOnlineStatus(id, status){
  let returnJson = {success: null, message:"initial message"}
  try{
  await userModel.changeOnlineStatus(id, status).then((res)=>{
    returnJson.success = true;
    returnJson.message = `Change online for user ${id} status successfull`
  });
  } catch (err){
    console.log(err)
  }
  return returnJson;
}

export async function changeStatus(id, status){
  let returnJson = {success: null, message:"initial message"}
  await userModel.changeStatus(id, status).then(()=>{
    returnJson.success = true;
    returnJson.message = "Change status successfull"
  });
  return returnJson;
}

/**
 * Check the username and password with the information stored in database to provide user_id
 * @async
 * @param {string} username The username passed from the frontend
 * @param {string} enteredPassword The password entered by user from the frontend
 * @returns user_id if user validates, -1 if username password mismatch, -2 if user does not exist
 */

export async function validUser(username, enteredPassword) {
  let ret = {code: 0, user_id: null};
  await userModel.getOneUser(username).then(async(res)=> {
    if (res.length > 0) {
      const user = res[0];
      const hashedPassword = user.password;
      await bcrypt.compare(enteredPassword, hashedPassword).then((isMatch) => {
        if (isMatch == false) ret = {code: 401, user_id: null}; 
        else ret = {code: 200, user_id: user.user_id}; 
      });
    } else ret = {code: 404, user_id: null}; 
  })
  return ret;
}
