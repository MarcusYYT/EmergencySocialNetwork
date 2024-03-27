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

export async function checkIfStopWord(text){
    const stopWords = [
        "a","able","about","across","after","all","almost","also","am","among","an","and","any","are","as","at","be",
        "because","been","but","by","can","cannot","could","dear","did","do","does","either","else","ever","every",
        "for","from","get","got","had","has","have","he","her","hers","him","his","how","however","i","if","in",
        "into","is","it","its","just","least","let","like","likely","may","me","might","most","must","my","neither",
        "no","nor","not","of","off","often","on","only","or","other","our","own","rather","said","say","says","she",
        "should","since","so","some","than","that","the","their","them","then","there","these","they","this","tis",
        "to","too","twas","us","wants","was","we","were","what","when","where","which","while","who","whom","why",
        "will","with","would","yet","you","your"
      ];
    if (stopWords.includes(text)){
        return {success: false}
    } else {
        return {success: true}
    }
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