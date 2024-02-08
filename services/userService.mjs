import { User } from "../models/User.model.mjs";
import { getUsernameBanList } from "../config/usernameBanList.mjs";
import bcrypt from "bcryptjs";

let saltRounds = 10;

/**
 * This function will inster a row to the user table with username and password
 * @param {string} username The username passed from the frontend
 * @param {string} password The password passed from the frontend
 */
export async function createNewUser(username, password) {
  await bcrypt.hash(password, saltRounds).then(async (res) => {
    console.log(res);
    await User.create({ username: username, password: res });
  });
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
 * @param {string} username The username passed from the frontend
 * @param {string} enteredPassword The password entered by user from the frontend
 * @returns User if the username and password match, null if the username and password are not match or username not exist
 */
export async function Authenticate(username, enteredPassword) {
  let ifMatch = false;
  await User.findAll({
    where: { username: username },
  }).then (async (res)=>{
    if (res.length > 0) {
      const user = res[0];
      const hashedPassword = user.password;
    await bcrypt.compare(enteredPassword, hashedPassword).then((isMatch)=>{
        ifMatch = isMatch
      });
      return ifMatch
    } else {
      console.log("User not found");
      return ifMatch;
    }
  })
}
