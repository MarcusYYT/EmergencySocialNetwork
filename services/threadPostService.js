import { ThreadPost } from "../models/ThreadPost.model.js";
import { returnData } from "../config/returnJsonUtility.js";

/**
 * TODO
 * @param {*} userId 
 * @param {*} content 
 * @param {*} status 
 * @returns 
 */
export async function createNewThreadPost(userId, content, status, threadId) {
  let returnJson = {
    success: false,
    data:[],
    message:"initial message"
  }

  await ThreadPost.createThreadPost(userId, content, status, threadId).then((res)=>{
    returnJson.success = true
    returnJson.message = "Create thread post successful"
    returnJson.data = res;
  })

  return returnJson

  }


/**
 * TODO
 * @param {*} postId 
 * @returns 
 */
export async function getThreadPostById(postId){
    let returnJson = null
    await ThreadPost.getThreadPostById(postId).then((res)=>{
      returnJson = returnData(res)
    })
    return returnJson;
}


/**
 * TODO: write the function documentation
 * @returns 
 */
export async function getThreadPostList(thread_id){
    let returnJson = {
      data:[],
      message:"initial message"
    }
  
    await ThreadPost.getAllThreadPosts(thread_id).then((res)=>{
      returnJson.message = "Fetch post list successful"
      returnJson.data = res;
    })
  
    return returnJson
  }

