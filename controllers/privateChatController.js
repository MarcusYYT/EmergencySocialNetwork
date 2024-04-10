import * as privatePostService from '../services/privatePostService.js'
import { io, getSocketIdByUserId} from "../config/socketConfig.js"
import {emailStrategies} from '../stratrgies/email.strategies.js'
import {Preference} from '../models/Preference.model.js'

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
        const senderId = req.body.sender_id;
        const receiverId = req.body.receiver_id;
        const status = req.body.status;
        const content = req.body.content;
        const senderName = req.body.sender_name;

        await privatePostService.createPrivatePost(senderId, receiverId, content, status).then(async () =>{
            const roomName = [senderId, receiverId].sort().join('_');
            io.to(roomName).emit("postPrivatePost", req.body);
            await getSocketIdByUserId(receiverId).then((socketId)=>{
                console.log(socketId);
                if(socketId != null){
                    io.to(socketId).emit('newMessage', { sender: senderId, senderName:senderName, message:content });
                    io.to(socketId).emit('status_update');
                }
            })
            console.log(`sent messsage to  ${roomName}`);
            await Preference.checkPrivatePostUpdatesPreference(receiverId).then((data) => {
                if(data.shouldSend === true){
                    const strategy = emailStrategies['PrivatePost'];
                    strategy(data.email, senderName, content);
                }   
            });
            res.status(201).json({ success: true, message: 'Post a new post successful' });
        })
    } catch(error) {
        res.status(500).send(error.message);
    }
}

export async function updateReadStatus(req, res){
    try{
        const senderId = req.params.receiver_id;
        const receiverId = req.params.sender_id;
        await privatePostService.updateReadStatus(senderId, receiverId).then((resolve)=>{
            res.status(200).json({success: resolve.success, message: resolve.message});
        })
    } catch(error){
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
}

export async function getUnreadMessageCountsForReceiver(req, res){
    try{
        const receiverId = parseInt(req.params.receiver_id);
        if (isNaN(receiverId)) {
            return res.status(400).send({ error: 'Invalid receiver ID' });
        }
        await privatePostService.getUnreadMessageCountsForReceiver(receiverId).then((resolve)=>{
            res.status(200).json({success: true, data: resolve, message:`get all unread message for ${receiverId} successful`})
        })
    } catch (err){
        res.status(500).json({ message: 'Error fetching unread message', error: error.message });
    }
}