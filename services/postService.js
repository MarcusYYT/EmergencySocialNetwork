import {Post} from "../models/Post.model.js";
import { returnData } from "../config/returnJsonUtility.js";

/**
 * TODO
 * @param {*} userId 
 * @param {*} content 
 * @param {*} status 
 * @returns 
 */
export async function createNewPost(userId, content, status) {
    return await Post.createPost(userId, content, status)
  }


/**
 * TODO
 * @param {*} postId 
 * @returns 
 */
export async function getPostById(postId){
    let returnJson = null
    await Post.getPostById(postId).then((res)=>{
      returnJson = returnData(res)
    })
    return returnJson;
}


/**
 * TODO: write the function documentation
 * @returns 
 */
export async function getPostList(){
    let returnJson = {
      data:[],
      message:"initial message"
    }
  
    await Post.getAllPosts().then((res)=>{
      returnJson.message = "Fetch post list successful"
      returnJson.data = res;
    })
  
    return returnJson
  }

