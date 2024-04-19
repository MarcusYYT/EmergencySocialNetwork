import express from 'express';
import {getThreadById, getThreadList, postThread, editThread, deleteThread} from '../controllers/threadController.js'

const router = express.Router();

/**
 * @swagger
 * /threads/{thread_id}:
 *  get:
 *    tags:
 *      - Thread
 *    summary: fetch a thread object by the threadId
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
 *                    thread_name:
 *                      type: string
 *                    creator_id:
 *                      type: integer
 *                    urgency:
 *                      type: string
 *                message:
 *                  type: string
 *      '404':
 *        description: thread not found
 *  put:
 *    tags:
 *      - Thread
 *    summary: Edit a thread in the database
 *    parameters:
 *      - in: path
 *        name: threadId
 *        required: true
 *        schema:
 *          type: integer
 *        description: Numeric ID of the thread to edit.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              thread_id:
 *                type: integer
 *              thread_name:
 *                type: string
 *              creator_id:
 *                type: integer
 *              urgency:
 *                type: string
 *    responses:
 *      '201':
 *        description: Database push successful
 *  delete:
 *    tags:
 *      - Thread
 *    summary: Delete a thread from the database
 *    parameters:
 *      - in: path
 *        name: threadId
 *        required: true
 *        schema:
 *          type: integer
 *        description: Numeric ID of the thread to delete.
 *    responses:
 *      '201':
 *        description: Database push successful
 * /threads:
 *  get:
 *    tags:
 *      - Thread
 *    summary: fetch a list of all thread objects
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
 *                      thread_name:
 *                        type: string
 *                      creator_id:
 *                        type: integer
 *                      urgency:
 *                        type: string
 *                message:
 *                  type: string
 *  post:
 *    tags:
 *      - Thread
 *    summary: Push a new thread into database
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              thread_Id:
 *                type: integer
 *              thread_name:
 *                type: string
 *              creator_id:
 *                type: integer
 *              urgency:
 *                type: string
 *              message:
 *                type: string
 *    responses:
 *      '201':
 *        description: Database push successful
 */

router.get('', getThreadList);
router.get('/:thread_id', getThreadById);
router.post('', postThread);
router.put('/:thread_id', editThread);
router.delete('/:thread_id', deleteThread);

export default router;