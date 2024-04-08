import {EmergencyContact} from "../models/EmergencyContact.model.js";

/**
 * This function will insert a row to the emergency contact table with contact info
 * @async
 * @param {*} userId 
 * @param {*} primary 
 * @param {*} alternative 
 * @param {*} message 
 */
export async function createEmergencyContact(userId, primary, alternative, message) {
    let returnJson = {success: false, emergency_id: -1, message: "Create user emergency contact failed"};
    try {
      // if (await EmergencyContact.ifEmergencyContactExist(userId)) {
      //   returnJson.message = "User emergency contact already exists.";
      //   return returnJson;
      // }
      const emergncyContact = await EmergencyContact.createEmergencyContact(userId, primary, alternative, message);
      returnJson.success = true;
      returnJson.emergency_id = emergncyContact.emergency_id;
      returnJson.message = "Create emergency contact successfully.";
    } catch (error) {
      console.log("Error creating user emergency contact:", error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        returnJson.message = "User emergency contact already exists.";
      } else {
        returnJson.message = "An unexpected error occurred.";
      }
    }
    return returnJson;
  }

/**
 * This function will get the emergency contact info from given user id
 * @param {*} userId 
 * @returns 
 */
export async function getEmergencyContactByUserId(userId){
    let returnJson = {
      exist: null,
      data:[]
    }
    await EmergencyContact.getEmergencyContactByUserId(userId).then((res) => {
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
 * This function will change the primary contact for given user id
 * @param {*} userId 
 * @param {*} primary 
 * @returns 
 */
export async function changePrimaryContact(id, primary){
    let returnJson = {success: null, message:"initial message"}
    await EmergencyContact.changePrimaryContact(id, primary).then(()=>{
      returnJson.success = true;
      returnJson.message = "Change primary contact successfull"
    });
    return returnJson;
  }

/**
 * This function will change the alternative contact for given user id
 * @param {*} userId 
 * @param {*} alternative 
 * @returns 
 */
export async function changeAlternativeContact(id, alternative){
    let returnJson = {success: null, message:"initial message"}
    await EmergencyContact.changeAlternativeContact(id, alternative).then(()=>{
      returnJson.success = true;
      returnJson.message = "Change alternative contact successfull"
    });
    return returnJson;
  }

/**
 * This function will change the emergency message for given user id
 * @param {*} userId 
 * @param {*} message 
 * @returns 
 */
export async function changeEmergencyMessage(id, message){
    let returnJson = {success: null, message:"initial message"}
    await EmergencyContact.changeEmergencyMessage(id, message).then(()=>{
      returnJson.success = true;
      returnJson.message = "Change Emergency Message successfull"
    });
    return returnJson;
  }

/**
 * This function will change the location permission for given user id
 * @param {*} userId 
 * @param {*} permission 
 * @returns 
 */
export async function changeLocationPermission(id, permission){
    let returnJson = {success: null, message:"initial message"}
    await EmergencyContact.changeLocationPermission(id, permission).then(()=>{
      returnJson.success = true;
      returnJson.message = "Change Location Permission successfull"
    });
    return returnJson;
}

/**
 * This function will change the location link for given user id
 * @param {*} userId 
 * @param {*} link 
 * @returns 
 */
export async function changeLocationLink(id, link){
  let returnJson = {success: null, message:"initial message"}
  await EmergencyContact.changeLocationLink(id, link).then(()=>{
    returnJson.success = true;
    returnJson.message = "Change Location Link successfull"
  });
  return returnJson;
}