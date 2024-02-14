import express from 'express';
const router = express.Router();

/**
 * @swagger
 * /user/{userId}:
 *  get:
 *    summary: fetch a user object by the userId
 *    tags:
 *      - User 
 *    parameters:
 *      - in: path
 *        name: userId
 *        type: integer
 *        required: true
 *        description: Numeric ID of the user to get.
 *    responses:
 *      200:
 *        description: Successful return the user.
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
 *                      user_Id:
 *                        type: integer
 *                      username:
 *                        type: string
 *                      status:
 *                        type: string
 *                message: 
 *                  type: string
 *      404:
 *        description: user not found
 * 
 * 
 * /user:
 *  get:
 *    summary: fetch the whole user list
 *    tags:
 *      - User
 *    responses:
 *      200:
 *        description: Successful return the user list.
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
 *                      user_Id:
 *                        type: integer
 *                      username:
 *                        type: string
 *                      status:
 *                        type: string
 *                message: 
 *                  type: string
 */

export default router;