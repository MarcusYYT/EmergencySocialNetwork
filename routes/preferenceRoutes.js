import express from 'express';
import { upsertPreference, getPreference} from '../controllers/preferenceController.js';
const router = express.Router();

/**
 * @swagger
 * /preferences/{userId}:
 *  get:
 *    tags:
 *      - Preferences
 *    summary: Fetch user's preferences
 *    parameters:
 *      - in: path
 *        name: userId
 *        required: true
 *        description: The type of SMS alert preference to check.
 *    responses:
 *      200:
 *        description: Successful return the preference for a specific user id
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: integer
 *                data:
 *                  type: array
 *                  items:
 *                    type: integer
 *                message:
 *                  type: string
 * /preferences: 
 *  post:
 *    tags:
 *      - Preferences
 *    summary: Set the user's SMS alert preferences
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              email_notification_preference:
 *                type: string
 *              announcement_updates:
 *                type: boolean
 *              private_post_updates:
 *                type: boolean
 *              public_post_updates:
 *                type: boolean
 *              status_changes:
 *                type: boolean
 *    responses:
 *      201:
 *        description: Preferences set successfully.
 */

router.get('/:user_id', getPreference);
router.post('', upsertPreference);
export default router;