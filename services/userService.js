import {User} from "../models/User.model.js";
import { getUsernameBanList } from "../config/usernameBanList.js";
import { returnData } from "../config/returnJsonUtility.js";
import bcrypt from "bcryptjs";
import { io, getSocketIdByUserId} from "../config/socketConfig.js"

let saltRounds = 10;

/**
 * This function will insert a row to the user table with username and password
 * @async
 * @param {string} username The username passed from the frontend
 * @param {string} password The password passed from the frontend
 */
export async function createNewUser(username, password) {
  let returnJson = {success: false, user_id: -1, message: "Create user failed"};
  try {
    if (await User.ifUserExist(username)) {
      returnJson.message = "Username already exists.";
      return returnJson;
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.createUser(username, hashedPassword);
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
  return returnJson;
}

/**
 * TODO: Write the comment for jsdoc
 * @param {*} user_id 
 * @returns 
 */
export async function getUserById(user_id){
  let returnJson = null
  await User.getUserById(user_id).then((res) => {
    returnJson = returnData(res)
  })
  return returnJson;
}

/**
 * get user by the username
 * @param {*} username
 * @returns 
 */
export async function getUserByUsername(username){
  let returnJson = null
  await User.getOneUser(username).then((res) => {
    returnJson = returnData(res)
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

  await User.getUser().then((res)=>{
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
 * @returns {boolean} True if the password is longer than 4, false if not
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
  await User.changeOnlineStatus(id, status).then((res)=>{
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
  await User.changeStatus(id, status).then(()=>{
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
 * @returns {JSON} user_id if user validates, -1 if username password mismatch, -2 if user does not exist
 */

export async function validUser(username, enteredPassword) {
  let ret = {code: 0, user_id: null};
  await User.getOneUser(username).then(async(res)=> {
    if (res.length > 0) {
      const user = res[0];
      const hashedPassword = user.password;
      await bcrypt.compare(enteredPassword, hashedPassword).then((isMatch) => {
        if (isMatch == false) {ret = {code: 401, user_id: null};} 
        else {
          const isActive = user.isActive;
          if(!isActive){
            ret = {code: 403, user_id:null}
          } else {
            ret = {code: 200, user_id: user.user_id};
          }
        } 
      });
    } else ret = {code: 404, user_id: null}; 
  })
  return ret;
}


/**
 * Creates an administrator user with specified default credentials.
 * @async
 * @returns {Object} A JSON object indicating success or failure.
 */
export async function createAdminUser() {
  const username = "esnadmin";
  const password = "admin";
  const privilege = "Administrator";
  const status = "OK";
  let returnJson = {success: false, user_id: -1, message: "Create admin user failed"};

  try {
    if (await User.ifUserExist(username)) {
      returnJson.message = "Username already exists.";
      return returnJson;
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.createUser(username, hashedPassword, privilege, status);
    returnJson.success = true;
    returnJson.user_id = user.user_id;
    returnJson.message = "Admin user created successfully.";
  } catch (error) {
    console.log("Error creating admin user:", error);
    returnJson.message = "An unexpected error occurred.";
  }
  return returnJson;
}

/**
 * Changes the active status of a user if possible.
 * @async
 * @param {number} user_id The ID of the user to change active status for.
 * @param {boolean} newIsActive New active status to set.
 * @returns {Object} A JSON object indicating success or failure.
 */
export async function changeUserActiveStatus(user_id, newIsActive) {
  let returnJson = {success: false, message: "Cannot change active status"};
  try {
    const user = await User.getUserById(user_id);
    if (!user) {
      returnJson.message = "User ID does not exist.";
      return returnJson;
    }

    const activeAdmins = await User.model.count({ where: { privilege: 'Administrator', isActive: true }});
    if (user.privilege === 'Administrator' && activeAdmins <= 1 && newIsActive !== true) {
      returnJson.message = "Cannot deactivate the only active Administrator.";
      return returnJson;
    }

    await User.changeActiveStatus(user_id, newIsActive);
    returnJson.success = true;
    returnJson.message = "User active status changed successfully.";
    if(!newIsActive){
      await getSocketIdByUserId(user_id).then((socketId)=>{
        if(socketId != null){
            io.to(socketId).emit('inactive');
        }
      }) 
    }
  } catch (error) {
    console.log("Error changing user active status:", error);
    returnJson.message = "An unexpected error occurred.";
  }

  return returnJson;
}


/**
 * Changes the privilege of a user if possible.
 * @async
 * @param {number} user_id The ID of the user to change privilege for.
 * @param {string} newPrivilege New privilege to set.
 * @returns {Object} A JSON object indicating success or failure.
 */
export async function changeUserPrivilege(user_id, newPrivilege) {
  let returnJson = {success: false, message: "Cannot change privilege"};
  try {
    const user = await User.getUserById(user_id);
    if (!user) {
      returnJson.message = "User ID does not exist.";
      return returnJson;
    }

    const admins = await User.model.count({ where: { privilege: 'Administrator' }});
    if (user.privilege === 'Administrator' && admins <= 1 && newPrivilege !== 'Administrator') {
      returnJson.message = "Cannot remove the only Administrator.";
      return returnJson;
    }

    await User.changePrivilege(user_id, newPrivilege);
    returnJson.success = true;
    returnJson.message = "User privilege changed successfully.";
  } catch (error) {
    console.log("Error changing user privilege:", error);
    returnJson.message = "An unexpected error occurred.";
  }

  return returnJson;
}


/**
 * Changes the password of a specific user, hashing it before storage.
 * @async
 * @param {number} user_id The ID of the user whose password is to be changed.
 * @param {string} newPassword The new password to set.
 * @returns {Object} A JSON object indicating success or failure.
 */
export async function changeUserPassword(user_id, newPassword) {
  let returnJson = {success: false, message: "Password change failed"};
  try {
    if(isPasswordValid(newPassword)){
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      await User.changePassword(user_id, hashedPassword);
      returnJson.success = true;
      returnJson.message = "Password changed successfully.";
    } else {
      returnJson.message = "Password must be at least 4 characters long";
    }
  } catch (error) {
    console.log("Error changing user password:", error);
    returnJson.message = "An unexpected error occurred.";
  }
  return returnJson;
}


/**
 * Changes the username of a specific user after validating the new username.
 * @async
 * @param {number} user_id The ID of the user whose username is to be changed.
 * @param {string} newUsername The new username to be set.
 * @returns {Object} A JSON object indicating success or failure.
 */
export async function changeUsername(user_id, newUsername) {
  let returnJson = {success: false, message: "Username change failed"};

  try {
    // Check if the new username is valid
    if (!(await isUsernameValid(newUsername))) {
      returnJson.message = "New username is short than 3 characters or banned.";
      return returnJson;
    }

    // Check if the new username already exists
    if (await User.ifUserExist(newUsername)) {
      returnJson.message = "New username already exists.";
      return returnJson;
    }

    // Proceed to change the username
    await User.changeUsername(user_id, newUsername);
    returnJson.success = true;
    returnJson.message = "Username changed successfully.";
  } catch (error) {
    console.log("Error changing username:", error);
    returnJson.message = "An unexpected error occurred.";
  }

  return returnJson;
}

async function changeUsernameIfNeeded(userData, results) {
  if (userData.username !== -1) {
      const usernameResult = await changeUsername(userData.user_id, userData.username);
      if (!usernameResult.success) {
          results.success = false;
          results.messages.push(usernameResult.message);
      }
  } else {
      console.log("Won't Change Username");
  }
}

async function changePasswordIfNeeded(userData, results) {
  if (userData.password !== '') {
      const passwordResult = await changeUserPassword(userData.user_id, userData.password);
      if (!passwordResult.success) {
          results.success = false;
          results.messages.push(passwordResult.message);
      }
  } else {
      console.log("Won't Change Password");
  }
}

async function changePrivilegeIfNeeded(userData, results) {
  const privilegeResult = await changeUserPrivilege(userData.user_id, userData.privilege);
  if (!privilegeResult.success) {
      results.success = false;
      results.messages.push(privilegeResult.message);
  }
}

async function changeActiveStatusIfNeeded(userData, results) {
  let isActiveBool = userData.isActive === 'Active';
  const activeStatusResult = await changeUserActiveStatus(userData.user_id, isActiveBool);
  if (!activeStatusResult.success) {
      results.success = false;
      results.messages.push(activeStatusResult.message);
  }
}


/**
 * Updates user details based on provided parameters.
 * @async
 * @param {Object} userData The data to update the user with.
 * @returns {Object} A JSON object indicating overall success or failure and messages for each operation.
 */
export async function updateUserDetails(userData) {
  let results = {
      success: true,
      messages: []
  };

  await changeUsernameIfNeeded(userData, results);
  await changePasswordIfNeeded(userData, results);
  await changePrivilegeIfNeeded(userData, results);
  await changeActiveStatusIfNeeded(userData, results);

  return results;
}

export async function ifCanPostAnnouncement(userId){
  const user = await getUserById(userId);
  if (user.data[0].privilege === 'Citizen'){
    return false;
  } else {
    return true;
  }
}


export async function ifCanPerformSpeedTest(userId){
  const user = await getUserById(userId);
  if (user.data[0].privilege === 'Administrator'){
    return true;
  } else {
    return false;
  }
}


