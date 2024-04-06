import * as emergencyContactService from '../services/emergencyContactService.js'
import { EmergencyContact } from "../models/EmergencyContact.model.js";
import { User } from "../models/User.model.js";


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

export async function updateEmergencyContact(req, res){
    try{
        const userId = req.body.user_id;
        const updateAtrribute = req.body.updateAt;
        const updateValue = req.body.updateValue;
        if (updateAtrribute === "primary_contact_id" || updateAtrribute === "alternative_contact_id") {
            await User.ifUserExist(updateValue).then(async (result)=>{
                if (result !== true) {
                    console.log("The contact you select does not exist")
                    res.status(404).json({ success: false, message: 'User not exist' });
                } else {
                    await User.getOneUser(updateValue).then(async (result)=>{
                        if (updateAtrribute === "primary_contact_id") {
                            await emergencyContactService.changePrimaryContact(userId, updateValue).then((resolve)=>{
                                io.emit('primary_update')
                                res.status(200).json({success: resolve.success, message: resolve.message});
                        })
                        } else {
                            await emergencyContactService.changeAlternativeContact(userId, updateValue).then((resolve)=>{
                                io.emit('alternative_update')
                                res.status(200).json({success: resolve.success, message: resolve.message});
                        })}
                    })
                }
            })
        } else {
            await emergencyContactService.changeEmergencyMessage(userId, updateValue).then((resolve)=>{
                io.emit('message_update')
                res.status(200).json({success: resolve.success, message: resolve.message});
            })
        }
    } catch(error){
        res.status(500).json({ message: 'Error updating user emergency contact', error: error.message });
    }
}

// export async function changePrimaryContact(req, res){
//     try{
//         const userId = req.body.user_id;
//         const newPrimaryContact = req.body.updateValue;
//         await emergencyContactService.changePrimaryContact(userId, newPrimaryContact).then((resolve)=>{
//             io.emit('primary_update')
//             res.status(200).json({success: resolve.success, message: resolve.message});
//         })
//     } catch(error){
//         res.status(500).json({ message: 'Error updating primary contact', error: error.message });
//     }
// }

// export async function changeAlternativeContact(req, res){
//     try{
//         const userId = req.body.user_id;
//         const newAlternativeContact = req.body.updateValue;
//         await emergencyContactService.changeAlternativeContact(userId, newAlternativeContact).then((resolve)=>{
//             io.emit('alternative_update')
//             res.status(200).json({success: resolve.success, message: resolve.message});
//         })
//     } catch(error){
//         res.status(500).json({ message: 'Error updating alternative contact', error: error.message });
//     }
// }

// export async function changeEmergencyMessage(req, res){
//     try{
//         const userId = req.body.user_id;
//         const newMessage = req.body.updateValue;
//         await emergencyContactService.changeEmergencyMessage(userId, newMessage).then((resolve)=>{
//             io.emit('message_update')
//             res.status(200).json({success: resolve.success, message: resolve.message});
//         })
//     } catch(error){
//         res.status(500).json({ message: 'Error updating emergency message', error: error.message });
//     }
// }