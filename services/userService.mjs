import {createUser, getUser} from "../models/User.model.mjs";
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
  await bcrypt.hash(password, saltRounds).then(async (res) => {
    console.log(res);
    await createUser(username, res);
  });
}

/**
 * This function will check if the user name is in the ban list
 * @async
 * @param {string} username 
 * @returns True if the username is valid ,false ifnthe username is not valid
 */
export async function isUsernameValid(username) {
  const banList = await getUsernameBanList();
  console.log(typeof banList);
  if (banList.includes(username)) {
    return false;
  } else {
    return true;
  }
}

/**
 * Check the username and password with the information stored in database
 * @async
 * @param {string} username The username passed from the frontend
 * @param {string} enteredPassword The password entered by user from the frontend
 * @returns True if the username and password match, false if the username and password are not match or username not exist
 */
export async function authenticate(username, enteredPassword) {
  let ifMatch = {id: -1, match: false};
  await getUser(username).then (async (res)=>{
    if (res.length > 0) {
      const user = res[0];
      const hashedPassword = user.password;
      ifMatch.id = user.user_id;
      await bcrypt.compare(enteredPassword, hashedPassword).then((isMatch)=>{
          ifMatch.match = isMatch
        });
      console.log(ifMatch)
    } else {
      console.log("User not found");
      ifMatch.match = false;
    }
  })
  return ifMatch;
}
