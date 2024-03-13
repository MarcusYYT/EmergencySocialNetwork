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

  /**
   * 
   * @param {*} senderId 
   * @param {*} receiverId 
   * @returns 
   */
  export async function updateReadStatus(senderId, receiverId) {
    let returnJson = {success: null, message:"initial message"}
    await privatePostModel.markMessagesAsRead(senderId, receiverId).then((resolve)=>{
      returnJson.success = true;
      returnJson.message = `Change ${resolve} lines to read successful`
    });
    return returnJson;
  }

/**
 * Get all unread messages for a specific receiver, grouped by the sender.
 * @param {number} receiverId - The ID of the receiver.
 * @returns {Promise<Object>} A promise that resolves with an object where keys are sender IDs and values are arrays of unread messages from that sender.
 */
  export async function getUnreadMessageCountsForReceiver(receiverId){
    try {
      return await privatePostModel.getUnreadMessageCountsForReceiver(receiverId);
  } catch (error) {
      console.error('Error fetching grouped unread messages:', error);
  }
  }
