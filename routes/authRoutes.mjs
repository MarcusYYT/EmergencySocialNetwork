import express from 'express';
import { login, register } from '../controllers/authController.mjs';
import { showLogin, showRegister } from '../controllers/authController.mjs';

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *  get:
 *    tags:
 *      - Authentication
 *    summary: Render a template of the login page
 *    responses:
 *      200:
 *        description: Successful rendering the page
 * 
 *  post:
 *    tags:
 *      - Authentication 
 *    summary: Authentica the passed username and password
 *    consumes:
 *      - application/x-www-form-urlencode
 *    requestBody:
 *         content:
 *            application/x-www-form-urlencoded:
 *               schema:
 *                  type: object
 *                  properties:
 *                     username:         
 *                        type: string
 *                     password:          
 *                        type: string
 *    responses:
 *      200:
 *        description: Login successful
 * 
  * /auth/register:
 *  post:
 *    tags:
 *      - Authentication 
 *    summary: hash the password then register a user into database
 *    consumes:
 *      - application/x-www-form-urlencode
 *    requestBody:
 *         content:
 *            application/x-www-form-urlencoded:
 *               schema:
 *                  type: object
 *                  properties:
 *                     username:         
 *                        type: string
 *                     password:          
 *                        type: string
 *    responses:
 *      201:
 *        description: register successful
 */
router.get('/login', showLogin);

router.get('/register', showRegister);

router.post('/register', register)

router.post('/login', login)

export default router;