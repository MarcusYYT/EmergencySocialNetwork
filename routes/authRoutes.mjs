import express from 'express';
import { login, register } from '../controllers/userController.mjs';
import { showLogin, showRegister } from '../controllers/userController.mjs';

const router = express.Router();


router.get('/login', showLogin);

router.get('/register', showRegister);

router.post('/register', register)

router.post('/login', login)

// get, user
// get, user/id
// get, post
// get, post/id
// get, userstatus
// get, userstatus/id

// post, post


export default router;