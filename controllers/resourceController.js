import * as resourceService from '../services/resourceService.js';
import { io } from "../config/socketConfig.js"
import {response} from "express";

export async function getResourceById(req, res){
    try{
        const resource_id = req.params.resourceId;
        await resourceService.getResourceById(resource_id).then((resolve)=>{
            if(resolve.exist==true){
                res.status(200).json({success:true, data: resolve.data, message:"Fetch resource successful"});
            } else {
                res.status(404).json({success:false, data:[], message:"The resource is not exist"});
            }
        })
    }  catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getResourceList(req, res){
    try {
        await resourceService.getResourcePosts().then((resolve)=>{
            res.status(200).json({success:true, data: resolve.data, message:resolve.message});
        })
    } catch (error){
        res.status(500).send(error.message);
    }
}

export async function getResourceGrouped(req, res){
    try {
        await resourceService.getResourceGrouped().then((resolve)=>{
            res.status(200).json({success:true, data: resolve.data, message:resolve.message});
        })
    } catch (error){
        res.status(500).send(error.message);
    }
}

export async function postResource(req, res){
    try{
        await resourceService.createNewResource(req.body.user_id, req.body).then(() =>{
            res.status(201).json({ success: true, message: 'Post a new resource successful' });
        })
    } catch(error) {
        res.status(500).send(error.message);
    }
}

export async function updateResource(req, res){

    try {
        const resourceId = req.body.resource_id;
        await resourceService.updateResource(resourceId, req.body).then(() =>{
            res.status(200).json({ success: true, message: 'Update resource successful' });
        })
    } catch(error) {
        res.status(500).send(error.message);
    }
}

export async function deleteResource(req, res){
    try {
        const resourceId = req.params.resourceId;
        await resourceService.deleteResource(resourceId).then(() =>{
            res.status(200).json({ success: true, message: 'Delete resource successful' });
        })
    } catch(error) {
        res.status(500).send(error.message);
    }
}

export async function getResourceTypes(req, res){
    try {
        await resourceService.getResourceTypes().then((resolve)=>{
            res.status(200).json({success:true, data: resolve.data, message:resolve.message});
        })
    } catch (error){
        res.status(500).send(error.message);
    }
}

export async function getResourceUnits(req, res){
    try {
        await resourceService.getResourceUnits().then((resolve)=>{
            res.status(200).json({success:true, data: resolve.data, message:resolve.message});
        })
    } catch (error){
        res.status(500).send(error.message);
    }
}

export async function addResourceType(req, res){
    try {
        const typeName = req.body.type_name;
        const result = await resourceService.addResourceType(typeName); // Use await directly without then()
        if (result.message == "Resource type already exists") {
            return res.status(409).json({ success: false, message: 'Resource type already exists' });
        }
        res.status(201).json({ success: true, added_type_id: result.data.id, message: 'Add resource type successful' });
    } catch(error) {
        res.status(500).send(error.message);
    }
}

export async function addResourceUnit(req, res){
    try {
        const unitName = req.body.unit_name;
        const result = await resourceService.addResourceUnit(unitName); // Use await directly without then()
        if (result.message == "Resource unit already exists") {
            return res.status(409).json({ success: false, message: 'Resource unit already exists' });
        }
        res.status(201).json({ success: true, added_unit_id: result.data.id, message: 'Add resource unit successful' });
    } catch(error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
}

export async function getResourceByUserId(req, res){
    try {
        const userId = req.params.userId;
        await resourceService.getResourceByUserId(userId).then((resolve)=>{
            res.status(200).json({success:true, data: resolve.data, message:resolve.message});
        })
    } catch (error){
        res.status(500).send(error.message);
    }
}

export async function getResourceByType(req, res){
    try {
        const typeId = req.params.typeId;
        await resourceService.getResourceByType(typeId).then((resolve)=>{
            if (resolve.data.length == 0){
                return res.status(404).json({success:false, message:resolve.message});
            }
                return res.status(200).json({success:true, data: resolve.data, message:resolve.message});
        })
    } catch (error){
        return res.status(500).send(error.message);
    }
}