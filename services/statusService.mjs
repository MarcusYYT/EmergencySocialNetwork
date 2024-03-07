import * as statusModel from "../models/Status.model.mjs";

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
    await statusModel.getStatusByUser(userId).then((res)=>{
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
    return await statusModel.createStatus(userId, status)
  }