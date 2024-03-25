import * as userModel from "../models/User.model.js";
import * as postModel from "../models/Post.model.js";
import * as statusModel from "../models/Status.model.js";
import * as privatePostModel from "../models/PrivatePost.model.js";
import * as announcementModel from "../models/Announcement.model.js";


export async function searchUser(query) {
    let returnJson = {
        success: false,
        data: []
    }
    await userModel.queryUser(query).then((res) => {
        returnJson.success = true;
        returnJson.data = res;
        console.log(`Data in service: `);
        res.forEach(user => {
            console.log(user.toJSON()); // 打印每个用户的数据
        })
    });
    return returnJson;
}

