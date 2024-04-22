import * as userService from '../services/userService.js'
import { io } from "../config/socketConfig.js"
import { getAllSubscriberOfOneUser } from '../services/subscriberService.js';
import {emailStrategies} from '../stratrgies/email.strategies.js'
import {shouldSendEmailNotification} from '../models/Preference.model.js'

export async function getUserById(req, res){
    try{
        const user_id = req.params.user_id;
        await userService.getUserById(user_id).then((resolve)=>{
            if(resolve.exist==true){
                res.status(200).json({success:true, data: resolve.data, message:"Fetch user successful"});
            } else {
                console.log("I am by id")
                res.status(404).json({success:false, data:[], message:"The user does not exist"});
            }
        })
    }  catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getUserByUsername(req, res){
    try{
        const username = req.params.username;
        await userService.getUserByUsername(username).then((resolve)=>{
            if (resolve.exist==true) {
                res.status(200).json({success:true, data: resolve.data, message:"Fetch user with username successful"});
            } else {
                res.status(404).json({success:false, data:[], message:"The user with this username does not exist"});
            }
        })
    }  catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getUserList(req, res){
    try {
        await userService.getUserList().then((resolve)=>{
            res.status(200).json({success:true, data: resolve.data, message:resolve.message});
        })
    } catch (error){
        res.status(500).send(error.message);
    }
}


async function updateOnlineStatus(req, res) {
    const userId = req.body.user_id;
    const updateStatus = req.body.updateValue;
    const resolve = await userService.changeOnlineStatus(userId, updateStatus);
    res.status(200).json({success: resolve.success, message: resolve.message});
}

async function updateStatus(req, res) {
    const userId = req.body.user_id;
    const updateStatus = req.body.updateValue;
    const username = req.body.username;
    const resolve = await userService.changeStatus(userId, updateStatus);
    io.emit('status_update');
    const data = await getAllSubscriberOfOneUser(userId);
    const strategy = emailStrategies['StatusChanges'];
    data.forEach(element => {
        if (element.status_changes && shouldSendEmailNotification(element.status, element.email_notification_preference)){
            strategy(element.email, username, updateStatus);
        }
    });
    res.status(200).json({success: resolve.success, message: resolve.message});
}

async function updateAdminDetails(req, res) {
    const userData = req.body.updateValue;
    const result = await userService.updateUserDetails(userData);
    if (result.success) {
        io.emit('status_update');
        res.status(201).json(result);
    } else {
        res.status(400).json(result);
    }
}

export async function updateUser(req, res){
    try{
        const updateAttribute = req.body.updateAt;
        switch (updateAttribute) {
            case "online_status":
                return updateOnlineStatus(req, res);
            case "status":
                return updateStatus(req, res);
            case "admin":
                return updateAdminDetails(req, res);
            default:
                throw new Error('Invalid update attribute');
        }
    } catch(error){
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
}