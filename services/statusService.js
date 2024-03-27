import {Status} from "../models/Status.model.js";

/**
 * TODO
 * @param {*} postId 
 * @returns 
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
 * TODO
 * @param {*} userId 
 * @param {*} status 
 * @returns 
 */
export async function createNewStatus(userId, status) {
    return await Status.createStatus(userId, status)
  }