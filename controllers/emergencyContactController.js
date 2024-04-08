import * as emergencyContactService from '../services/emergencyContactService.js'
import { EmergencyContact } from "../models/EmergencyContact.model.js";
import { User } from "../models/User.model.js";
import { io, getSocketIdByUserId} from "../config/socketConfig.js"


export async function createEmergencyContact(req, res) {
    try{
        const userID = req.body.user_id;
        const primaryContact = req.body.primary_id;
        const alternativeContact = req.body.alternative_id;
        const emergencyMessage = req.body.emergency_message;
            await EmergencyContact.ifEmergencyContactExist(userID).then(async (result)=>{
                if(result === true){
                    console.log("The User emergency contact is exist")
                    res.status(409).json({ success: false, message: 'User Emergency Contact Exist' });
                } else{
                    console.log("The User emergency contact is not exist")
                        await emergencyContactService.createEmergencyContact(userID, primaryContact, alternativeContact, emergencyMessage).then((contact)=>{
                            res.status(201).json({ success: true, message: 'create a new User Emergency Contact successfully'});
                        })    
                    }
                });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function postAlert(req, res){
    try{
        const username = req.body.username;
        const message = req.body.message;
        const primary = req.body.primary;
        const alternative = req.body.alternative;
        io.to(primary).emit('alert', req.body); 
        io.to(alternative).emit('alert', req.body); 
        res.status(201).json({ success: true, message: 'Post a new alert successful' });
    } catch(error) {
        res.status(500).send(error.message);
    }
}

export async function getEmergencyContactByUserId(req, res){
    try{
        const user_id = req.params.user_id;
        await emergencyContactService.getEmergencyContactByUserId(user_id).then((resolve)=>{
            if(resolve.exist==true){
                res.status(200).json({success:true, data: resolve.data, message:"Fetch emergency contact successful"});
            } else {
                res.status(404).json({success:false, data:[], message: resolve.message});
            }
        })
    }  catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getEmergencyContactSocketId(req, res){
    try{
        const primary_id = req.params.primary_id;
        const alternative_id = req.params.alternative_id;
        
        // Use Promise.all to execute both database queries concurrently
        const [primarySocketId, alternativeSocketId] = await Promise.all([
            getSocketIdByUserId(primary_id),
            getSocketIdByUserId(alternative_id)
        ]);

        console.log("Primary socketid is: " + primarySocketId);
        console.log("Alternative socketid is: " + alternativeSocketId);
        
        // Send back both socket IDs in the response
        res.status(200).json({ success: true, data: { primarySocketId, alternativeSocketId }, message: "Socket IDs retrieved successfully" });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function updateEmergencyContact(req, res){
    try{
        const userId = req.body.user_id;
        const updateAtrribute = req.body.updateAt;
        const updateValue = req.body.updateValue;
        const updateId = req.body.updateId;
        if (updateAtrribute === "primary_contact_id" || updateAtrribute === "alternative_contact_id") {
            await User.ifUserExist(updateValue).then(async (result)=>{
                if (result !== true) {
                    console.log("The contact you select does not exist")
                    res.status(404).json({ success: false, message: 'User not exist' });
                } else {
                    console.log("User exist")
                    await User.getOneUser(updateValue).then(async (result)=>{
                        if (updateAtrribute === "primary_contact_id") {
                            console.log(updateValue)
                            await emergencyContactService.changePrimaryContact(userId, updateId).then((resolve)=>{
                                res.status(200).json({success: resolve.success, message: resolve.message});
                        })
                        } else {
                            await emergencyContactService.changeAlternativeContact(userId, updateId).then((resolve)=>{
                                res.status(200).json({success: resolve.success, message: resolve.message});
                        })}
                    })
                }
            })
        } else if (updateAtrribute === "emergency_message") {
            await emergencyContactService.changeEmergencyMessage(userId, updateValue).then((resolve)=>{
                res.status(200).json({success: resolve.success, message: resolve.message});
            })
        } else if (updateAtrribute === "location_allow"){
            await emergencyContactService.changeLocationPermission(userId, updateValue).then((resolve)=>{
                res.status(200).json({success: resolve.success, message: resolve.message});
            })
        } else {
            await emergencyContactService.changeLocationLink(userId, updateValue).then((resolve)=>{
                res.status(200).json({success: resolve.success, message: resolve.message});
            })
        }
    } catch(error){
        console.log("there is a problem")
        res.status(500).json({ message: 'Error updating user emergency contact', error: error.message });
    }
}
