import express from 'express';
import {getPostById, getPostList, postPost} from '../controllers/postController.js'

const router = express.Router();
/**
 * @swagger
 * /posts/{postId}:
 *  get:
 *    tags:
 *      - Post
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
 *                      user_id:
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
 * /posts:
 *  get:
 *    tags:
 *      - Post 
 *    summary: fetch a list of all post objects
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
 *                      user_id:
 *                        type: integer
 *                      time:
 *                        type: date-time
 *                      user_status:
 *                        type: string
 *                      content:
 *                        type: string
 *                message: 
 *                  type: string
 *  post:
 *    tags:
 *      - Post 
 *    summary: Posh a new post into database
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              user_id:         
 *                type: integer
 *              user_status:
 *                type: string
 *              content:          
 *                type: string
 *    responses:
 *      201:
 *        description: Database push successful
 */
router.get('', getPostList);
router.get('/:post_id', getPostById);
router.post('', postPost);

export default router;