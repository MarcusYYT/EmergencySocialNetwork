import * as privatePostService from '../services/privatePostService.mjs'

export async function getPrivatePostById(req, res){
    try{
        const post_id = req.params.post_id;
        await privatePostService.getChatById(post_id).then((resolve)=>{
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

export async function getPrivatePostList(req, res){
    try {
        const sender_id = req.params.sender_id
        const receiver_id = req.params.receiver_id
        await privatePostService.getPrivatePostList(sender_id, receiver_id).then((resolve)=>{
            res.status(200).json({success:true, data: resolve.data, message:resolve.message});
        })
    } catch (error){
        res.status(500).send(error.message);
    }
}

export async function postPrivatePost(req, res){
    try{
        const userId = req.body.user_id;
        const content = req.body.content;
        //const status = req.body.status;
        //await privatePostService.createNewPrivatePost(userId, content, status).then(() =>{
        await privatePostService.createNewPrivatePost(userId, content).then(() =>{
            res.status(201).json({ success: true, message: 'Post a new post successful' });
        })
    } catch(error) {
        res.status(500).send(error.message);
    }
}