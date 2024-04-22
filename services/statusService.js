import {Status} from "../models/Status.model.js";

/**
 * Gets the status of a specific user 
 * @param {number} userId The id of the user whose status to get
 * @returns {JSON} the status y the sepcific user
 */
export async function getStatusByUser(userId){
    let returnJson = {
        exist: null, 
        data: [],
        message:'initial'
    }
    await Status.getStatusByUser(userId).then((res)=>{
        if(res != null){
            returnJson.exist = true;
            returnJson.data = res;
            returnJson.message =`fetch status for ${userId} is successful` 
          } else {
            returnJson.exist = false;
            returnJson.message =`no status found` 
          }
    })
    return returnJson;
}

/**
 * Creates a new status for a user
 * @param {number} userId the id of the user
 * @param {string} status the status of the iser to create
 * @returns {Promise} A promise containing the outcome of the status creation
 */
export async function createNewStatus(userId, status) {
    return await Status.createStatus(userId, status)
  }