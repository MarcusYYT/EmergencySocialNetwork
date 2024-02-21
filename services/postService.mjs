import * as postModel from "../models/Post.model.mjs";

/**
 * TODO
 * @param {*} userId 
 * @param {*} content 
 * @param {*} status 
 * @returns 
 */
export async function createNewPost(userId, content, status) {
    return await postModel.createPost(userId, content, status)
  }


/**
 * TODO
 * @param {*} postId 
 * @returns 
 */
export async function getPostById(postId){
    let returnJson = {
        exist: null, 
        data: []
    }
    await postModel.getPostById(postId).then((res)=>{
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
export async function getPostList(){
    let returnJson = {
      data:[],
      message:"initial message"
    }
  
    await postModel.getAllPosts().then((res)=>{
      returnJson.message = "Fetch post list successful"
      returnJson.data = res;
    })
  
    return returnJson
  }

