import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /preferences:
 *  get:
 *    tags:
 *      - Preferences
 *    summary: Fetch all users with at least one SMS alert preference enabled
 *    responses:
 *      200:
 *        description: Successful return of users with enabled SMS alert preferences.
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
 *                    type: object
 *                    properties:
 *                      user_id:
 *                        type: integer
 *                      phone_number:
 *                        type: string
 *                      announcement_updates:
 *                        type: boolean
 *                      private_post_updates:
 *                        type: boolean
 *                      public_post_updates:
 *                        type: boolean
 *                      status_changes:
 *                        type: boolean
 *                message:
 *                  type: string
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
export default router;