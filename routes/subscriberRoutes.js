import express from 'express';
import { getSubscribersByUser, addSubscriber, removeSubscriber } from '../controllers/subscriberController.js';

const router = express.Router();

router.get('/:user_id', getSubscribersByUser);
router.post('', addSubscriber);
router.delete('/:subscriberId/:userId', removeSubscriber);
export default router;