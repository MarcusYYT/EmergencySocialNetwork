import * as preferenceService from '../services/preferenceService.js'

export async function upsertPreference(req, res){
    try{
        const userId = req.body.user_id;
        const email = req.body.email;
        const trigger = req.body.email_preference;
        const announcementUpdate = req.body.announcement_updates;
        const privatePostUpdate = req.body.private_post_updates;
        const publicPostUpdate = req.body.public_post_updates;
        const statusChanges = req.body.status_changes;

        await preferenceService.upsertPreference(userId, email, trigger, announcementUpdate, privatePostUpdate, publicPostUpdate, statusChanges);
        res.status(201).json({ success: true, message: 'Post a new post successful' });
    } catch(error) {
        console.log(error)
        res.status(500).send(error.message);
    }
}