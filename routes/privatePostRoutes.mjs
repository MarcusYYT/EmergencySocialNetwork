import express from 'express';
import {getPrivatePostById, getPrivatePostList, postPrivatePost, updateReadStatus, getUnreadMessageCountsForReceiver} from '../controllers/privateChatController.mjs'

const router = express.Router();
/**
 * @swagger
 * /privatePosts/{postId}:
 *  get:
 *    tags:
 *      - Private Post
 *    summary: fetch a post object by the postId
 *    parameters:
 *      - in: path
 *        name: postId
 *        type: integer
 *        required: true
 *        description: Numeric ID of the post to get.
 *    responses:
 *      200:
 *        description: Successful return the post.
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
 *                      post_Id:
 *                        type: integer
 *                      sender_id:
 *                        type: integer
 *                      reciever_id:
 *                        type: integer
 *                      time:
 *                        type: date-time
 *                      user_status:
 *                        type: string
 *                      content:
 *                        type: string
 *                message: 
 *                  type: string
 *      404:
 *        description: post not found
 * 
 * 
 * /privatePosts/{senderId}/{receiverId}:
 *  get:
 *    tags:
 *      - Private Post 
 *    summary: fetch a list of all post objects
 *    parameters:
 *      - in: path
 *        name: senderId
 *        schema:
 *          type: integer
 *        description: Numeric ID of the sender of the posts to get.
 *      - in: path
 *        name: receiverId
 *        schema:
 *          type: integer
 *        description: Numeric ID of the reciever of posts to get.
 *    responses:
 *      200:
 *        description: Successful return the post list.
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
 *                      post_Id:
 *                        type: integer
 *                      sender_id:
 *                        type: integer
 *                      reciever_id:
 *                        type: integer
 *                      time:
 *                        type: date-time
 *                      user_status:
 *                        type: string
 *                      content:
 *                        type: string
 *                message: 
 *                  type: string
 *
 * 
 * /privatePosts:
 *  post:
 *    tags:
 *      - Private Post 
 *    summary: Posh a new post into database
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              sender_id:         
 *                type: integer
 *              reciever_id:         
 *                type: integer
 *              sender_status:
 *                type: string
 *              content:          
 *                type: string
 *    responses:
 *      201:
 *        description: Database push successful
 */
router.get('/unread/:receiver_id', getUnreadMessageCountsForReceiver);
router.get('/:sender_id/:receiver_id', getPrivatePostList);
router.get('/:post_id', getPrivatePostById);
router.post('', postPrivatePost);

// need a documentation comment
router.put('/:sender_id/:receiver_id', updateReadStatus);

export default router;