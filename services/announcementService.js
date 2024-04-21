import { Announcement } from '../models/Announcement.model.js'
import { returnData } from '../config/returnJsonUtility.js'

/**
 * TODO
 * @param {*} userId 
 * @param {*} content 
 * @returns 
 */
export async function createNewAnnouncement(userId, content) {
    return await Announcement.createAnnouncement(userId, content)
  }


/**
 * TODO
 * @param {*} announcementId 
 * @returns 
 */
export async function getAnnouncementById(announcementId){
    let returnJson = null;
    await Announcement.getAnnouncementById(announcementId).then((res)=>{
      returnJson = returnData(res)
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
  
    await Announcement.getAllAnnouncements().then((res)=>{
      returnJson.message = "Fetch announcement list successful"
      returnJson.data = res;
    })
  
    return returnJson
  }

