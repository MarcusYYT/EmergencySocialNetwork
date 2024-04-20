import { Preference } from "../models/Preference.model.js";
import { Subscriber } from "../models/Subscriber.model.js";
import { User } from "../models/User.model.js";

export async function getSubscriberByUser(userId){
    return await Subscriber.getSubscribers(userId);
}

export async function postSubscriber(username, subscriberId){
    let returnJson = {success: false, message: "default"};
    try {
        if (await User.ifUserExist(username) === false) {
            returnJson.message = "Username not exists.";
            return returnJson;
        } else {
            const user = await User.getOneUser(username);
            const userId = user[0].user_id;
            await Subscriber.addSubscriber(userId, subscriberId).then((data)=>{
                if(data === false){
                    returnJson.success = false;
                    returnJson.message = 'User already subscribed';

                } else {
                    returnJson.success = true;
                    returnJson.message = 'Add subscriber success'
                }
            })
        }
        return returnJson;
        
    } catch(error){
        console.log(error);
    }

}

export async function removeSubscriber(userId, subscriberId){
    return await Subscriber.removeSubscriber(userId, subscriberId);
}

export async function getAllSubscriberOfOneUser(userId){
    return await Subscriber.getSubscribersWithDetails(userId);
}