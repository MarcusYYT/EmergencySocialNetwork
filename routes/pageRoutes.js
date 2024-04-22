import express from 'express';
import passport from '../config/passportConfig.js';
import { getResourceById } from "../services/resourceService.js";
import {getUserById} from "../services/userService.js"

const router = express.Router();
function authenticateRoute(req, res, next) {
    const user_id = req.user.data[0].user_id;
    if (user_id != req.params.user_id) return res.status(401).json({message: "Unauthorized access."});
    next();
}
function authenticateJWT(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) return res.status(401).json({ message: "Unauthorized" })
        req.user = user;
        next();
    })(req, res, next);
}

function renderPage(req, res, pageName, additionalData = {}) {
    const user_id = req.user.data[0].user_id; // Assuming user data is always present after authentication
    res.render(pageName, { user_id, ...additionalData });
}
router.get('/', (req, res) => {res.render('Home')});
router.get('/directory/:user_id', authenticateJWT, authenticateRoute, (req, res) => {renderPage(req, res, 'Directory')});
router.get('/messageWall/:user_id', authenticateJWT, authenticateRoute, (req, res) => {renderPage(req, res, 'MessageWall')});
router.get('/privatePostsWall/:senderId/:receiverId', authenticateJWT, (req, res) => {
    const senderId = req.params.senderId;
    const receiverId = req.params.receiverId;
    if (senderId != req.user.data[0].user_id) {
        res.status(401).json({message: "Unauthorized access."});
    }
    else {
        res.render('PrivateChat', {senderId: senderId, receiverId: receiverId});
    }
});

router.get('/announcements/:user_id', authenticateJWT, authenticateRoute, (req, res) => {renderPage(req, res, 'Announcement')});
router.get('/setting/:user_id', authenticateJWT, authenticateRoute, (req, res) => {renderPage(req, res, 'Setting')});
router.get('/subscriber/:user_id', authenticateJWT, authenticateRoute, (req, res) => {renderPage(req, res, 'Subscriber')});
router.get('/threadWall/:user_id', authenticateJWT, authenticateRoute, (req, res) => {renderPage(req, res, 'Thread')});
router.get('/threadWall/:thread_id/:user_id', authenticateJWT, (req, res) => {
    const user_id = req.user.data[0].user_id;
    const thread_id = req.params.thread_id;
    if (user_id != req.params.user_id) {
        res.status(401).json({message: "Unauthorized access."});
    }
    else {
        res.render('ThreadChat', {user_id: user_id, thread_id: thread_id});
    }
});
router.get('/emergencyContact/:user_id', authenticateJWT, authenticateRoute, (req, res) => {renderPage(req, res, 'EmergencyContact')});
// router.get('/administration/:user_id', authenticateJWT, (req, res) => {
//     const user_id = req.user.data[0].user_id;
//     if (user_id != req.params.user_id) {
//         res.status(401).json({message: "Unauthorized access."});
//     }
//     else {
//         res.render('Administrate', {user_id: user_id});
//     }
// });
router.get('/resources/:user_id', authenticateJWT, authenticateRoute, (req, res) => {renderPage(req, res, 'Resources')});
router.get('/resources/shared/:user_id', authenticateJWT, (req, res) => {
    const user_id = req.user.data[0].user_id;
    if (user_id != req.params.user_id) {
        res.status(401).json({message: "Unauthorized access."});
    }
    else {
        res.render('SharedResources', {user_id: user_id});
    }
});
router.get('/resources/shared/create/:user_id', authenticateJWT, authenticateRoute, (req, res) => {renderPage(req, res, 'CreateResources', { mode: 'create', resource_id: 0 })});

router.get('/resources/shared/edit/:resource_id', authenticateJWT, (req, res) => {
    getResourceById(req.params.resource_id).then((result) => {
        if (result.data[0].user_id != req.user.data[0].user_id) {
            res.status(401).json({message: "Unauthorized access."});
        } else {
            res.render('CreateResources', {user_id: req.user.data[0].user_id, mode: 'edit', resource_id: req.params.resource_id});
        }
    });
});
router.get('/resources/seek/:user_id', authenticateJWT, authenticateRoute, (req, res) => {renderPage(req, res, 'SeekResources')});

router.get('/resources/typeview/:type_id/:type_name', authenticateJWT, (req, res) => {
    const user_id = req.user.data[0].user_id;
    res.render('TypeOfResources', {user_id: req.user.data[0].user_id, type_id: req.params.type_id, type_name: req.params.type_name});
});
router.get('/test/:user_id', async (req, res) => {
    try {
        const user_id = parseInt(req.params.user_id);
        const result = await getUserById(user_id);
        const user= result.data[0];

        if (user && user.privilege === 'Administrator') {
            res.render('Test', {user_id: user_id});
        } else {
            res.status(403).send('Access Denied');
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Internal Server Error'); 
    }
})





export default router;
