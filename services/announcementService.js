import { Announcement } from '../models/Announcement.model.js'

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
    let returnJson = {
        exist: null, 
        data: []
    }
    await Announcement.getAnnouncementById(announcementId).then((res)=>{
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
  
    await Announcement.getAllAnnouncements().then((res)=>{
      returnJson.message = "Fetch post list successful"
      returnJson.data = res;
    })
  
    return returnJson
  }

