import { Thread } from '../models/Thread.model.js'
import { returnData } from '../config/returnJsonUtility.js'

/**
 * Creates a thread
 * @param {number} creatorId 
 * @param {string} threadName 
 * @param {string} urgency 
 * @param {string} tags 
 * @returns {JSON} An object containing the creation outcome
 */
export async function createNewThread(creatorId, threadName, urgency, tags) {

  let returnJson = {
    success: false,
    data:[],
    message:"initial message"
  }

  await Thread.createThread(creatorId, threadName, urgency, tags).then((res)=>{
    returnJson.success = true
    returnJson.message = "Create thread successful"
    returnJson.data = res;
  })

  return returnJson
}

/**
 * Checks if a thread name exists in the database
 * @param {string} threadName The thread name to search for
 * @returns {Promise} A promise indicating whther a thread with that threadname exists
 */
export async function ifThreadNameExists(threadName) {
  return await Thread.ifThreadNameExists(threadName)
}
  

/**
 * Gets a thread in the database by the ID
 * @param {string} threadId The specific thread ID to get
 * @returns {JSON} An object containing the specific thread retrieved
 */
export async function getThreadById(threadId){
    let returnJson = null
    await Thread.getThreadById(threadId).then((res)=>{
      returnJson = returnData(res)
    })
    return returnJson;
}

/**
 * Gets a thread using their name
 * @param {string} threadName The name of the thread to get
 * @returns {JSON}  An object containing the specific thread retrieved
 */
export async function getThreadByName(threadName){
  let returnJson = {
      exist: null, 
      data: []
  }
  await Thread.getThreadByName(threadName).then((res)=>{
      if(res != null){
          returnJson.exist = true;
          returnJson.data = res
        } else {
          returnJson.exist = false;
        }
  })
  return returnJson;
}

/**
 * Gets a list of all of the threads 
 * @returns {JSON} An object containing all the threads in the database
 */
export async function getThreadList(){
    let returnJson = {
      data:[],
      message:"initial message"
    }
  
    await Thread.getAllThreads().then((res)=>{
      returnJson.message = "Fetch thread list successful"
      returnJson.data = res;
    })
  
    return returnJson
  }

    /**
   * Edit a thread using its id and the new parameters
   * @param {number} thread_id The thread ID of the thread to edit
   * @param {string} thread_name The new name of the thread
   * @param {string} urgency The new urgency value
   * @param {string} tags The new set of tags to update
   * @returns {JSON} An object containing the edited thread outcome 
   */
  export async function editThread(thread_id, thread_name, urgency, tags){
    let returnJson = {
      data:[],
      message:"initial message",
      success: false
    }
    await Thread.editThread(thread_id, thread_name, urgency, tags).then((res)=>{
      returnJson.message = "Edit thread list successful"
      returnJson.data = res;
      returnJson.success = true
    })

    return returnJson
  }

    /**
   * Delete a thread using a thread ID
   * @param {*} thread_id The thread ID of the thread to delete
   * @returns {JSON} An object containing the deleted thread outcome 
  */
  export async function deleteThread(thread_id){
    let returnJson = {
      data:[],
      message:"initial message"
    }
    await Thread.deleteThread(thread_id).then((res)=>{
      returnJson.message = "Delete thread list successful"
      returnJson.data = res;
    })

    return returnJson
  }

