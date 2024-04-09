import express from 'express';
import { upsertPreference } from '../controllers/preferenceController.js';
const router = express.Router();

/**
 * @swagger
 * /preferences/{preferenceType}:
 *  get:
 *    tags:
 *      - Preferences
 *    summary: Fetch user IDs with a specific SMS alert preference enabled
 *    parameters:
 *      - in: path
 *        name: preferenceType
 *        required: true
 *        schema:
 *          type: string
 *          enum: [announcement_updates, private_post_updates, public_post_updates, status_changes]
 *        description: The type of SMS alert preference to check.
 *    responses:
 *      200:
 *        description: Successful return of user IDs with the specified preference enabled.
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
 *              phone_number:
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

router.get('', ()=>{});
router.post('', upsertPreference);
export default router;