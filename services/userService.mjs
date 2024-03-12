import * as userModel from "../models/User.model.mjs";
import { getUsernameBanList } from "../config/usernameBanList.mjs";
import bcrypt from "bcryptjs";

let saltRounds = 10;

/**
 * This function will inster a row to the user table with username and password
 * @async
 * @param {string} username The username passed from the frontend
 * @param {string} password The password passed from the frontend
 */
export async function createNewUser(username, password) {
  let returnJson = {success: null, user_id: -1, message: "initial message"};
  await bcrypt.hash(password, saltRounds).then(async (res) => {
    await userModel.createUser(username, res).then((user)=>{
      returnJson.success = true;
      returnJson.user_id = user.user_id
      returnJson.message = "Create user successfulS"
    });

  });
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
 * This function will check if the user name is in the ban list
 * @async
 * @param {string} username 
 * @returns True if the username is valid ,false ifnthe username is not valid
 */
export async function isUsernameValid(username) {
  const banList = await getUsernameBanList();
  if (banList.includes(username)) {
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
// /**
//  * Check the username and password with the information stored in database
//  * @async
//  * @param {string} username The username passed from the frontend
//  * @param {string} enteredPassword The password entered by user from the frontend
//  * @returns True if the username and password match, false if the username and password are not match or username not exist
//  */
// export async function authenticate(username, enteredPassword) {
//   let ifMatch = {id: -1, code: 0, message:'initial message'};
//   await userModel.getUser(username).then (async (res)=>{
//     if (res.length > 0) {
//       const user = res[0];
//       const hashedPassword = user.password;
//       ifMatch.id = user.user_id;
//       await bcrypt.compare(enteredPassword, hashedPassword).then((isMatch)=>{
//           if (isMatch == false){
//             ifMatch.message = "Username and Password doesn't match";
//             ifMatch.code = 400;
//           } else {
//             ifMatch.message = "Login Successful"
//             ifMatch.code = 200;
//           }
//         });
//     } else {
//       console.log("User not found");
//       ifMatch.message = "User not exist"
//       ifMatch.code = 404;
//     }
//   })
//   return ifMatch;
// }

/**
 * Check the username and password with the information stored in database to provide user_id
 * @async
 * @param {string} username The username passed from the frontend
 * @param {string} enteredPassword The password entered by user from the frontend
 * @returns user_id if user validates, -1 if username password mismatch, -2 if user does not exist
 */
export async function authenticate(username, enteredPassword) {
  let ret = 0;
  await userModel.getOneUser(username).then(async(res)=> {
    if (res.length > 0) {
      const user = res[0];
      const hashedPassword = user.password;
      await bcrypt.compare(enteredPassword, hashedPassword).then((isMatch) => {
        if (isMatch == false) ret = -1; // -1 means password mismatch
        else ret = user.user_id; // other than -1/-2, ret is user id
      });
    } else ret = -2; // -2 means user not found
  })
  return ret;
}
