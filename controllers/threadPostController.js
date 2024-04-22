import * as postService from '../services/threadPostService.js'
import { io } from "../config/socketConfig.js"

export async function getThreadPostById(req, res){
    try{
        const post_id = req.params.post_id;
        await postService.getThreadPostById(post_id).then((resolve)=>{
            if(resolve.exist==true){
                res.status(200).json({success:true, data: resolve.data, message:"Fetch post successful"});
            } else {
                res.status(404).json({success:false, data:[], message:"The post does not exist"});
            }
        })
    }  catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getThreadPostList(req, res){

    try {
        const thread_id = req.params.thread_id
        await postService.getThreadPostList(thread_id).then((resolve)=>{
            res.status(200).json({success:true, data: resolve.data, message:resolve.message});
        })
    } catch (error){
        res.status(500).send(error.message);
    }
}

export async function postThreadPost(req, res){
    try{
        const userId = req.body.user_id;
        const content = req.body.content;
        const status = req.body.status;
        const threadId = req.body.thread_id
        await postService.createNewThreadPost(userId, content, status, threadId).then(() =>{
            io.emit("threadPostData", req.body);
            res.status(201).json({ success: true, message: 'ThreadPost a new post successful' });
        })
    } catch(error) {
        res.status(500).json({ success: false, message: error.message });
    }
}