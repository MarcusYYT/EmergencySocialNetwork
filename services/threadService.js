import { Thread } from '../models/Thread.model.js'

/**
 * TODO
 * @param {*} creatorId 
 * @param {*} urgency 
 * @returns 
 */
export async function createNewThread(creatorId, threadName, urgency) {
  // let returnJson = {
  //   data:[],
  //   name_exists: null,
  //   message:"initial message"
  // }
  // if (await Thread.ifThreadNameExists(threadName)) {
  //   returnJson.message = "thread name already exists.";
  //   returnJson.name_exists = true;
  //   return returnJson;
  // }
  return await Thread.createThread(creatorId, threadName, urgency)
  // await Thread.createThread(creatorId, threadName, urgency).then((res)=>{
  //   if(res != null){
  //     returnJson.name_exists = false;
  //     returnJson.data.push(res) 
  //   } else {
  //     returnJson.name_exists = true;
  //   }})
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

