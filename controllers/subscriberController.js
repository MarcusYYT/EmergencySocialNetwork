import * as subscriberService from '../services/subscriberService.js'

export async function getSubscribersByUser(req, res){
    const userId = req.params.user_id;
    await subscriberService.getSubscriberByUser(userId).then((data)=>{
        res.status(200).json({success: true, data:data, message:`fetch subscriber for ${userId} successfully`});
    });
}

export async function addSubscriber(req, res){
    const username = req.body.username;
    const subscriberId = req.body.subscriber_id;
    await subscriberService.postSubscriber(username, subscriberId).then(data => {
        res.status(201).json(data);
    })
}

export async function removeSubscriber(req, res){
    const { subscriberId, userId } = req.params;
    try {
        await subscriberService.removeSubscriber(userId, subscriberId);
        res.status(200).json({ success: true, message: 'Subscription removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to remove subscription' });
    }
}