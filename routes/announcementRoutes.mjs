/**
 * @swagger
 * /announcements/{announcementId}:
 *  get:
 *    tags:
 *      - Announcement
 *    summary: Fetch an announcement object by the announcementId
 *    parameters:
 *      - in: path
 *        name: announcementId
 *        type: integer
 *        required: true
 *        description: Numeric ID of the announcement to get.
 *    responses:
 *      200:
 *        description: Successfully returns the announcement.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: integer
 *                data:
 *                  type: object
 *                  properties: 
 *                    announcement_id:
 *                      type: integer
 *                    user_id:
 *                      type: integer
 *                    time:
 *                      type: date-time
 *                    content:
 *                      type: string
 *                message: 
 *                  type: string
 *      404:
 *        description: Announcement not found
 * 
 * 
 * /announcements:
 *  get:
 *    tags:
 *      - Announcement
 *    summary: Fetch a list of all announcement objects
 *    responses:
 *      200:
 *        description: Successfully returns the announcement list.
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
 *                      announcement_id:
 *                        type: integer
 *                      user_id:
 *                        type: integer
 *                      time:
 *                        type: date-time
 *                      content:
 *                        type: string
 *                message: 
 *                  type: string
 *  post:
 *    tags:
 *      - Announcement
 *    summary: Post a new announcement into the database
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              user_id:
 *                type: integer
 *              content:
 *                type: string
 *    responses:
 *      201:
 *        description: Database push successful
 */