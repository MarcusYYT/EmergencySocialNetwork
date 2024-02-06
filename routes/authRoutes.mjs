import express from 'express';
import { login, register } from '../controllers/userController.js';
import { showLogin, showRegister } from '../controllers/userController.js';

const router = express.Router();


router.get('/login', showLogin);

router.get('/register', showRegister);

router.post('/register', register)

router.post('/login', login)

export default router;