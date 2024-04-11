import {Resource} from "../models/Resource.model.js";
import {ResourceType} from "../models/ResourceType.model.js";
import {ResourceUnit} from "../models/ResourceUnit.model.js";

export async function createNewResource(userId, resourceTypeId, resourceName, resourceAmount, resourceUnitId, note, latitude, longitude, tel) {
    return await Resource.createResourcePost(userId, resourceTypeId, resourceName, resourceAmount, resourceUnitId, note, latitude, longitude, tel)
}



export async function getResourceById(resourceId){
    let returnJson = {
        exist: null,
        data: []
    }
    await Resource.getResourceById(resourceId).then((res)=>{
        if(res != null){
            returnJson.exist = true;
            returnJson.data.push(res)
        } else {
            returnJson.exist = false;
        }
    })
    return returnJson;
}



export async function getResourcePosts(){
    let returnJson = {
      data:[],
      message:"initial message"
    }

    await Resource.getResourcePosts().then((res)=>{
      returnJson.message = "Fetch resource list successful"
      returnJson.data = res;
    })
    return returnJson
}

export async function getResourceGrouped(){
    let returnJson = {
        data:[],
        message:"initial message"
    }

    await Resource.getResourceGrouped().then((res)=>{
        returnJson.message = "Fetch resource list successful"
        returnJson.data = res;
    })

    return returnJson
}

export async function updateResource(resourceId, userId, resourceTypeId, resourceName, resourceAmount, resourceUnitId, note, latitude, longitude, tel){
    let returnJson = {
        data:[],
        message:"initial message"
    }
    let updateData = {
        user_id: userId,
        resource_type_id: resourceTypeId,
        resource_name: resourceName,
        resource_amount: resourceAmount,
        resource_unit: resourceUnitId,
        resource_note: note,
        resource_latitude: latitude,
        resource_longitude: longitude,
        tel: tel
    }
    await Resource.updateResourceById(resourceId, updateData).then((res)=>{
        returnJson.message = "Update resource successful"
        returnJson.data = res;
    })
    return returnJson
}

export async function deleteResource(resourceId){
    let returnJson = {
        data:[],
        message:"initial message"
    }
    await Resource.deleteResource(resourceId).then((res)=>{
        returnJson.message = "Delete resource successful"
        returnJson.data = res;
    })
    return returnJson
}

export async function getResourceTypes(){
    let returnJson = {
        data:[],
        message:"initial message"
    }

    await ResourceType.getTypes().then((res)=>{
        returnJson.message = "Fetch resource type list successful"
        returnJson.data = res;
    })

    return returnJson
}

export async function getResourceUnits(){
    let returnJson = {
        data:[],
        message:"initial message"
    }

    await ResourceUnit.getUnits().then((res)=>{
        returnJson.message = "Fetch resource unit list successful"
        returnJson.data = res;
    })

    return returnJson
}

export async function addResourceType(typeName){
    let returnJson = {
        data:[],
        message:"initial message"
    }
    if (await ResourceType.ifExist(typeName)){
        returnJson.message = "Resource type already exists"
        return returnJson
    }

    await ResourceType.addType(typeName).then((res)=>{
        returnJson.message = "Add resource type successful"
        returnJson.data = res;
    })

    return returnJson
}

export async function addResourceUnit(unitName){
    let returnJson = {
        data:[],
        message:"initial message"
    }
    if (await ResourceUnit.ifExist(unitName)){
        returnJson.message = "Resource unit already exists"
        return returnJson
    }

    await ResourceUnit.addUnit(unitName).then((res)=>{
        returnJson.message = "Add resource unit successful"
        returnJson.data = res;
    })

    return returnJson
}

export async function getResourceByUserId(userId){
    let returnJson = {
        data:[],
        message:"initial message"
    }

    await Resource.getResourceByUser(userId).then((res)=>{
        returnJson.message = "Fetch resource list successful"
        returnJson.data = res;
    })

    return returnJson
}

export async function getResourceByType(typeId){
    let returnJson = {
        data:[],
        message:"initial message"
    }

    await Resource.getResourceByType(typeId).then((res)=>{
        returnJson.message = "Fetch resource list successful"
        returnJson.data = res;
    })

    return returnJson
}
