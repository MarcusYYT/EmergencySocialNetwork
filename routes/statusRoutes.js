import express from 'express';
import {getStatusByUser, createStatus} from '../controllers/statusController.js'

const router = express.Router();

router.get('/:user_id', getStatusByUser);
router.post('', createStatus);

export default router;