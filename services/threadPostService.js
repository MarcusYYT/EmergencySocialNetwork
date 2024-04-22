import { ThreadPost } from "../models/ThreadPost.model.js";
import { returnData } from "../config/returnJsonUtility.js";

/**
 * Creates a new thread post
 * @param {number} userId The ID of the user creating the thread post
 * @param {string} content The content of the thread post
 * @param {string} status The status of the user posting a thread post
 * @param {number} threadId he ID of the thread to which the post belongs
 * @returns {JSON} A Promise that resolves to an object indicating the success of the operation, the data returned, and a message.
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
 * Retrieves a thread post by its id
 * @param {number} postId 
 * @returns {JSON} A Promise that resolves to the thread post data if successful, or null if no thread post is found.
 */
export async function getThreadPostById(postId){
    let returnJson = null
    await ThreadPost.getThreadPostById(postId).then((res)=>{
      returnJson = returnData(res)
    })
    return returnJson;
}


/**
 * Retrieves a list of thread posts associated with a specific thread.
 * @param {number} thread_id - The ID of the thread for which to retrieve posts.
 * @returns {JSON} A Promise that resolves to an object containing an array of thread posts and a message indicating the status of the operation.
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

