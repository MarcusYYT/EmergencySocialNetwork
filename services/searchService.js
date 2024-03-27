// import * as userModel from "../models/User.model.js";
// import * as postModel from "../models/Post.model.js";
// import * as statusModel from "../models/Status.model.js";
// import * as privatePostModel from "../models/PrivatePost.model.js";
// import * as announcementModel from "../models/Announcement.model.js";
import { User } from "../models/User.model.js";
import { Post } from "../models/Post.model.js";
import { Status } from "../models/Status.model.js";
import { PrivatePost } from "../models/PrivatePost.model.js";
import { Announcement } from "../models/Announcement.model.js";



export async function searchUser(query) {
    let returnJson = {
        success: false,
        data: []
    }
    await User.queryUser(query).then((res) => {
        returnJson.success = true;
        returnJson.data = res;
    });
    return returnJson;
}


export async function searchUserStatus(query) {
    let returnJson = {
        success: false,
        data: []
    }
    await User.queryUserStatus(query).then((res) => {
        returnJson.success = true;
        returnJson.data = res;
    });
    return returnJson;
}

export async function searchAnnouncements(query) {
    let returnJson = {
        success: false,
        data: []
    }
    await Announcement.queryAnnouncement(query).then((res) => {
        returnJson.success = true;
        returnJson.data = res;
    });
    return returnJson;
}


export async function searchPosts(query) {
    let returnJson = {
        success: false,
        data: []
    }
    await Post.queryPosts(query).then((res) => {
        returnJson.success = true;
        returnJson.data = res;
    });
    return returnJson;
}

export async function searchPrivatePosts(senderId, receiverId, query) {
    let returnJson = {
        success: false,
        data: []
    }
    await PrivatePost.queryPrivatePosts(senderId, receiverId, query).then((res) => {
        returnJson.success = true;
        returnJson.data = res;
    });
    return returnJson;
}

export async function searchStatusHistory(userId) {
    let returnJson = {
        success: false,
        data: []
    }
    await Status.queryUserStatus(userId).then((res) => {
        returnJson.success = true;
        returnJson.data = res;
    });
    return returnJson;
}