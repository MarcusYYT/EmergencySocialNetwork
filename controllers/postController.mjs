import * as postService from '../services/postService.mjs'

export async function getPostById(req, res){
    try{
        const post_id = req.params.post_id;
        await postService.getPostById(post_id).then((resolve)=>{
            if(resolve.exist==true){
                res.status(200).json({success:true, data: resolve.data, message:"Fetch post successful"});
            } else {
                res.status(404).json({success:false, data:[], message:"The post is not exist"});
            }
        })
    }  catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getPostList(req, res){
    try {
        await postService.getPostList().then((resolve)=>{
            res.status(200).json({success:true, data: resolve.data, message:resolve.message});
        })
    } catch (error){
        res.status(500).send(error.message);
    }
}

export async function postPost(req, res){
    try{
        const userId = req.body.user_id;
        const content = req.body.content;
        const status = req.body.status;
        await postService.createNewPost(userId, content, status).then(() =>{
            res.status(201).json({ success: true, message: 'Post a new post successful' });
        })
    } catch(error) {
        res.status(500).send(error.message);
    }
}