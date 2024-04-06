import { ThreadPost } from "../models/ThreadPost.model.js";

/**
 * TODO
 * @param {*} userId 
 * @param {*} content 
 * @param {*} status 
 * @returns 
 */
export async function createNewThreadPost(userId, content, status) {
    return await ThreadPost.createThreadPost(userId, content, status)
  }


/**
 * TODO
 * @param {*} postId 
 * @returns 
 */
export async function getThreadPostById(postId){
    let returnJson = {
        exist: null, 
        data: []
    }
    await ThreadPost.getThreadPostById(postId).then((res)=>{
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
export async function getThreadPostList(){
    let returnJson = {
      data:[],
      message:"initial message"
    }
  
    await ThreadPost.getAllThreadPosts().then((res)=>{
      returnJson.message = "Fetch post list successful"
      returnJson.data = res;
    })
  
    return returnJson
  }

