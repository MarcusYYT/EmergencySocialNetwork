import express from 'express';
import {getThreadPostById, getThreadPostList, postThreadPost} from '../controllers/threadPostController.js'

const router = express.Router();

/**
 * @swagger
 * /threadPosts/{thread_id}:
 *  get:
 *    tags:
 *      - Thread Posts
 *    summary: fetch thread post list by the threadId
 *    parameters:
 *      - in: path
 *        name: threadId
 *        required: true
 *        schema:
 *          type: integer
 *        description: Numeric ID of the thread to get.
 *    responses:
 *      '200':
 *        description: Successfully returned the thread
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
 *                    thread_Id:
 *                      type: integer
 *                    sender_id:
 *                      type: integer
 *                    status:
 *                      type: string
 *                    content:
 *                      type: string
 *                message:
 *                  type: string
 *      '404':
 *        description: thread not found
 *  post:
 *    tags:
 *      - Thread Posts
 *    summary: Push a new post into the thread into the database
 *    parameters:
 *      - in: path
 *        name: threadId
 *        required: true
 *        schema:
 *          type: integer
 *        description: Numeric ID of the thread to post in.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              sender_id:
 *                type: integer
 *              thread_id:
 *                type: integer
 *              status:
 *                type: string
 *              content:
 *                type: string
 *    responses:
 *      '201':
 *        description: Database push successful
 * /threadPosts/{thread_id}/{post_id}:
 *  get:
 *    tags:
 *      - Thread Posts
 *    summary: fetch a post using the threadId and postId
 *    responses:
 *      '200':
 *        description: Successful return the threadlist.
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
 *                      thread_Id:
 *                        type: integer
 *                      sender_id:
 *                        type: integer
 *                      status:
 *                        type: string
 *                      content:
 *                        type: string
 *                message:
 *                  type: string
 *      '404':
 *        description: threadPost not found
 */

router.get('/:thread_id', getThreadPostList);
router.get('/:thread_id/:post_id', getThreadPostById);
router.post('/:thread_id', postThreadPost);

export default router;