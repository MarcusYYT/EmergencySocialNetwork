import * as privatePostModel from "../models/PrivatePost.model.mjs";

/**
 * TODO
 * @param {*} senderId 
 * @param {*} receiverId 
 * @param {*} content 
 * @param {*} status 
 * @returns 
 */
export async function createNewPrivatePost(senderId, receiverId, content) {
    return await privatePostModel.createPost(senderId, receiverId, content)
  }


/**
 * TODO
 * @param {*} postId 
 * @returns 
 */
export async function getChatById(postId){
    let returnJson = {
        exist: null, 
        data: []
    }
    await privatePostModel.getChatById(postId).then((res)=>{
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
export async function getPrivatePostList(senderId, receiverId){
    let returnJson = {
      data:[],
      message:"initial message"
    }
  
    await privatePostModel.getChatByChatters(senderId, receiverId).then((res)=>{
      returnJson.message = "Fetch post list successful"
      returnJson.data = res;
    })
  
    return returnJson
  }

