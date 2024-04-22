import * as postService from '../services/postService.js'
import { io } from "../config/socketConfig.js"
import {emailStrategies} from '../stratrgies/email.strategies.js'
import {Preference} from '../models/Preference.model.js'
import { strategies } from 'passport';

export async function getPostById(req, res){
    try{
        const post_id = req.params.post_id;
        await postService.getPostById(post_id).then((resolve)=>{
            if(resolve.exist==true){
                res.status(200).json({success:true, data: resolve.data, message:"Fetch post successful"});
            } else {
                res.status(404).json({success:false, data:[], message: "The post does not exist"});
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
        const username = req.body.username;
        await postService.createNewPost(userId, content, status).then(async () =>{
            if (req.headers['x-performance-test'] !== 'true') {
                io.emit("postData", req.body);
                await Preference.getUsersWithPreferenceEnabled('public_post_updates').then((data) => {
                    const strategy = emailStrategies['PublicPost'];
                    data.forEach(element => {
                        strategy(element.email, username, content);
                        console.log(`sent an email to ${element.username}`);
                    });
                });
            }

            res.status(201).json({ success: true, message: 'Post a new post successful' });
        })
    } catch(error) {
        console.log(error)
        res.status(500).send(error.message);
    }
}