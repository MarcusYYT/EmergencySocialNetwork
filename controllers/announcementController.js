import * as announcementService from '../services/announcementService.js'
import { io } from "../config/socketConfig.js"

export async function getAnnouncementById(req, res){
    try{
        const announcement_id = req.params.announcement_id;
        await announcementService.getAnnouncementById(announcement_id).then((resolve)=>{
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

export async function getAnnouncementList(req, res){
    try {
        await announcementService.getAnnouncementList().then((resolve)=>{
            res.status(200).json({success:true, data: resolve.data, message:resolve.message});
        })
    } catch (error){
        res.status(500).send(error.message);
    }
}

export async function postAnnouncement(req, res){
    try{
        const userId = req.body.user_id;
        const content = req.body.content;
        const status = req.body.status;
        await announcementService.createNewAnnouncement(userId, content, status).then(() =>{
            io.emit("announcementData", req.body);
            res.status(201).json({ success: true, message: 'Post a new announcement successful' });
        })
    } catch(error) {
        res.status(500).send(error.message);
    }
}