import express from 'express';
import passport from '../config/passportConfig.js';
import { io,registerNewSocket } from "../config/socketConfig.js"
import { getResourceById } from "../services/resourceService.js";

const router = express.Router();

function authenticateRoute(req, res, next) {
    const user_id = req.user.data[0].user_id;
    if (user_id != req.params.user_id) {
        return res.status(401).json({message: "Unauthorized access."});
    }
    next();
}

function renderPage(req, res, pageName, additionalData = {}) {
    const user_id = req.user.data[0].user_id; // Assuming user data is always present after authentication
    res.render(pageName, { user_id, ...additionalData });
}
router.get('/', (req, res) => {
    res.render('Home');
});
router.get('/directory/:user_id', passport.authenticate('jwt', { session: false }), authenticateRoute, (req, res) => {
    renderPage(req, res, 'Directory');
});

router.get('/messageWall/:user_id', passport.authenticate('jwt', { session: false }), authenticateRoute, (req, res) => {
    renderPage(req, res, 'MessageWall');
});

router.get('/privatePostsWall/:senderId/:receiverId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const senderId = req.params.senderId;
    const receiverId = req.params.receiverId;
    if (senderId != req.user.data[0].user_id) {
        res.status(401).json({message: "Unauthorized access."});
    }
    else {
        res.render('PrivateChat', {senderId: senderId, receiverId: receiverId});
    }
});

router.get('/announcements/:user_id', passport.authenticate('jwt', { session: false }), authenticateRoute, (req, res) => {
    renderPage(req, res, 'Announcement');
});

router.get('/setting/:user_id', passport.authenticate('jwt', { session: false }), authenticateRoute, (req, res) => {
    renderPage(req, res, 'Setting');
});

router.get('/subscriber/:user_id', passport.authenticate('jwt', { session: false }), authenticateRoute, (req, res) => {
    renderPage(req, res, 'Subscriber');
});


router.get('/threadWall/:user_id', passport.authenticate('jwt', { session: false }), authenticateRoute, (req, res) => {
    renderPage(req, res, 'Thread');
});

router.get('/threadWall/:thread_id/:user_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user_id = req.user.data[0].user_id;
    const thread_id = req.params.thread_id;
    if (user_id != req.params.user_id) {
        res.status(401).json({message: "Unauthorized access."});
    }
    else {
        res.render('ThreadChat', {user_id: user_id, thread_id: thread_id});
    }
});


router.get('/emergencyContact/:user_id', passport.authenticate('jwt', { session: false }), authenticateRoute, (req, res) => {
    renderPage(req, res, 'EmergencyContact');
});

router.get('/resources/:user_id', passport.authenticate('jwt', { session: false }), authenticateRoute, (req, res) => {
    renderPage(req, res, 'Resources');
});


router.get('/resources/shared/:user_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user_id = req.user.data[0].user_id;
    if (user_id != req.params.user_id) {
        res.status(401).json({message: "Unauthorized access."});
    }
    else {
        res.render('SharedResources', {user_id: user_id});
    }
});

router.get('/resources/shared/create/:user_id', passport.authenticate('jwt', { session: false }), authenticateRoute, (req, res) => {
    renderPage(req, res, 'CreateResources', { mode: 'create', resource_id: 0 });
});

router.get('/resources/shared/edit/:resource_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    getResourceById(req.params.resource_id).then((result) => {
        if (result.data[0].user_id != req.user.data[0].user_id) {
            res.status(401).json({message: "Unauthorized access."});
        } else {
            res.render('CreateResources', {user_id: req.user.data[0].user_id, mode: 'edit', resource_id: req.params.resource_id});
        }
    });
});

router.get('/resources/seek/:user_id', passport.authenticate('jwt', { session: false }), authenticateRoute, (req, res) => {
    renderPage(req, res, 'SeekResources');
});

router.get('/resources/typeview/:type_id/:type_name', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user_id = req.user.data[0].user_id;
    res.render('TypeOfResources', {user_id: req.user.data[0].user_id, type_id: req.params.type_id, type_name: req.params.type_name});
});


router.get('/test', (req, res) => {
    res.render('Test');
})





export default router;
