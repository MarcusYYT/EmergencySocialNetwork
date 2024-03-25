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
    });
    return returnJson;
}


export async function searchUserStatus(query) {
    let returnJson = {
        success: false,
        data: []
    }
    await userModel.queryUserStatus(query).then((res) => {
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
    await announcementModel.queryAnnouncement(query).then((res) => {
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
    await postModel.queryPosts(query).then((res) => {
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
    await privatePostModel.queryPrivatePosts(senderId, receiverId, query).then((res) => {
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
    await statusModel.queryUserStatus(userId).then((res) => {
        returnJson.success = true;
        returnJson.data = res;
    });
    return returnJson;
}