import { Announcement } from '../models/Announcement.model.js'
import { returnData } from '../config/returnJsonUtility.js'

/**
 * Creates a new Announcement using a user's ID and their specfiied content
 * @param {integer} userId A user's ID
 * @param {string} content The content of the announcement post
 * @returns {Promise} A Promise that resolves to the created announcement object
 */
export async function createNewAnnouncement(userId, content) {
    return await Announcement.createAnnouncement(userId, content)
  }


/**
 * Gets an accouncement using the Announcement ID
 * @param {integer} announcementId 
 * @returns {JSON} A Promise that resolves to the announcement data if successful, or null if no announcement is found
 */
export async function getAnnouncementById(announcementId){
    let returnJson = null;
    await Announcement.getAnnouncementById(announcementId).then((res)=>{
      returnJson = returnData(res)
    })
    return returnJson;
}


/**
 *  Retrieves a list of announcements.
 * @returns {JSON} A Promise that resolves to an object containing an array of announcement data and a message indicating the status of the operation
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

