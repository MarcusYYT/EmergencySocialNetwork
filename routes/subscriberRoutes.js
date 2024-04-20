import express from 'express';
import { getSubscribersByUser, addSubscriber, removeSubscriber } from '../controllers/subscriberController.js';

/**
 * @swagger
 * /subscribers/{user_id}:
 *   get:
 *     tags:
 *       - Subscribers
 *     summary: Get a list of subscribers for a specific user
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID to get subscribers for
 *     responses:
 *       200:
 *         description: Successfully retrieved list of subscribers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 * 
 * /subscribers:
 *   post:
 *     tags:
 *       - Subscribers
 *     summary: Add a new subscriber
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               subscriberUsername:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subscriber added successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 * 
 * /subscribers/{subscriberId}/{userId}:
 *   delete:
 *     tags:
 *       - Subscribers
 *     summary: Remove a subscriber
 *     parameters:
 *       - in: path
 *         name: subscriberId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The subscriber ID to remove
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID that the subscriber is subscribed to
 *     responses:
 *       200:
 *         description: Subscriber removed successfully
 *       404:
 *         description: Subscriber or user not found
 *       500:
 *         description: Internal server error
 */
const router = express.Router();

router.get('/:user_id', getSubscribersByUser);
router.post('', addSubscriber);
router.delete('/:subscriberId/:userId', removeSubscriber);
export default router;