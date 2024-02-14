import express from 'express';

const router = express.Router();
/**
 * @swagger
 * /post/{postId}:
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
 *                      content:
 *                        type: string
 *                message: 
 *                  type: string
 *      404:
 *        description: post not found
 * 
 * 
 * /post:
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
 *              content:          
 *                type: string
 *    responses:
 *      200:
 *        description: Database push successful
 */

export default router;