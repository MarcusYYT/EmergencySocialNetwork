import express from 'express';
const router = express.Router();
import {getUserById, getUserByUsername, getUserList, updateUser} from '../controllers/userController.js'

/**
 * @swagger
 * /users/{userId}:
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
 *                success:         
 *                  type: boolean
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
 *  put:
 *    summary: update a user object by the userId
 *    tags:
 *      - User 
 *    parameters:
 *      - in: path
 *        name: userId
 *        type: integer
 *        required: true
 *        description: Numeric ID of the user to get.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              user_id:         
 *                type: integer
 *              updateAt:
 *                type: string
 *              updateValue:          
 *                type: string
 *    responses:
 *      200:
 *        description: Successful update the user
 *      404:
 *        description: user not found
 * /users:
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
 *                success:         
 *                  type: boolean
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

router.get('', getUserList);
router.get('/:user_id', getUserById);
router.get('/username/:username', getUserByUsername);
router.put('/:user_id', updateUser);

export default router;