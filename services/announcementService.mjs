import * as announcementModel from "../models/Announcement.model.mjs";

/**
 * TODO
 * @param {*} userId 
 * @param {*} content 
 * @returns 
 */
export async function createNewAnnouncement(userId, content) {
    return await announcementModel.createAnnouncement(userId, content)
  }


/**
 * TODO
 * @param {*} announcementId 
 * @returns 
 */
export async function getAnnouncementById(announcementId){
    let returnJson = {
        exist: null, 
        data: []
    }
    await announcementModel.getAnnouncementById(announcementId).then((res)=>{
        if(res != null){
            returnJson.exist = true;
            returnJson.data.push(res) 
          } else {
            returnJson.exist = false;
          }
    })
    return returnJson;
}


/**
 * TODO: write the function documentation
 * @returns 
 */
export async function getAnnouncementList(){
    let returnJson = {
      data:[],
      message:"initial message"
    }
  
    await announcementModel.getAllAnnouncements().then((res)=>{
      returnJson.message = "Fetch post list successful"
      returnJson.data = res;
    })
  
    return returnJson
  }

