import express from 'express';
import { login, register } from '../controllers/userController.mjs';
import { showLogin, showRegister } from '../controllers/userController.mjs';

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *  get:
 *    summary: Render a template of the login page
 *    responses:
 *      200:
 *        description: Successful rendering the page
 * 
 *  post:
 *    summary: Authentica the passed username and password
 *    consumes:
 *      - application/x-www-form-urlencode
 *    parameters:
 *      - in: body
 *        name: user
 *        schema:
 *          type: object
 *          properties:
 *            username:
 *              type: string
 *            password:
 *              type: string
 *    responses:
 *      200:
 *        description: Login successful
 */
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