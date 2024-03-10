import * as privatePostModel from "../models/PrivatePost.model.mjs";

/**
 * TODO
 * @param {*} senderId 
 * @param {*} receiverId 
 * @param {*} content 
 * @param {*} status 
 * @returns 
 */
export async function createPrivatePost(senderId, receiverId, content, status) {
    return await privatePostModel.createPost(senderId, receiverId, content, status)
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

  export async function updateReadStatus(senderId, receiverId) {
    let returnJson = {success: null, message:"initial message"}
    await privatePostModel.readerRead(senderId, receiverId).then(()=>{
      returnJson.success = true;
      returnJson.message = "Change status successfull"
    });
    return returnJson;
  }
