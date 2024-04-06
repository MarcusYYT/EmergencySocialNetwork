import { Thread } from '../models/Thread.model.js'

/**
 * TODO
 * @param {*} creatorId 
 * @param {*} urgency 
 * @returns 
 */
export async function createNewThread(creatorId, threadName, urgency) {
    return await Thread.createThread(creatorId, threadName, urgency)
  }


/**
 * TODO
 * @param {*} threadId 
 * @returns 
 */
export async function getThreadById(threadId){
    let returnJson = {
        exist: null, 
        data: []
    }
    await Thread.getThreadById(threadId).then((res)=>{
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

