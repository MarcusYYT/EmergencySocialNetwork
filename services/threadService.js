import { Thread } from '../models/Thread.model.js'
import { returnData } from '../config/returnJsonUtility.js'

/**
 * TODO
 * @param {*} creatorId 
 * @param {*} urgency 
 * @returns 
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
 * TODO
 * @param {*} threadName 
 * @returns 
 */
export async function ifThreadNameExists(threadName) {
  return await Thread.ifThreadNameExists(threadName)
}
  

/**
 * TODO
 * @param {*} threadId 
 * @returns 
 */
export async function getThreadById(threadId){
    let returnJson = null
    await Thread.getThreadById(threadId).then((res)=>{
      returnJson = returnData(res)
    })
    return returnJson;
}

/**
 * TODO
 * @param {*} threadName 
 * @returns 
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
 * TODO: write the function documentation
 * @returns 
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
   * TODO: write the function documentation
   * @param {*} thread_id 
   * @param {*} thread_name 
   * @param {*} urgency 
   * @param {*} tags 
   * @returns 
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
   * TODO: write the function documentation
   * @param {*} thread_id 
   * @returns 
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

