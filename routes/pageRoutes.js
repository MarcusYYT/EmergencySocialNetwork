import express from 'express';
import passport from '../config/passportConfig.js';
import { io,registerNewSocket } from "../config/socketConfig.js"
import { getResourceById } from "../services/resourceService.js";

const router = express.Router();
router.get('/', (req, res) => {
    res.render('Home');
});
router.get('/directory/:user_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user_id = req.user.data[0].user_id;
    if (user_id != req.params.user_id) {
        res.status(401).json({message: "Unauthorized access."});
    }
    else {
        res.render('Directory', {user_id: user_id});
    }
});

router.get('/messageWall/:user_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user_id = req.user.data[0].user_id;
    if (user_id != req.params.user_id) {
        res.status(401).json({message: "Unauthorized access."});
    }
    else {
        res.render('MessageWall', {user_id: user_id});
    }
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

router.get('/announcements/:user_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user_id = req.user.data[0].user_id;
    if (user_id != req.params.user_id) {
        res.status(401).json({message: "Unauthorized access."});
    }
    else {
        res.render('Announcement', {user_id: user_id});
    }
});


router.get('/threadWall/:user_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user_id = req.user.data[0].user_id;
   
    if (user_id != req.params.user_id) {
        res.status(401).json({message: "Unauthorized access."});
    }
    else{
        res.render('Thread', {user_id: user_id});
    }

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


router.get('/emergencyContact/:user_id', passport.authenticate('jwt', { session: false }), (req, res) => {
        const user_id = req.user.data[0].user_id;
        if (user_id != req.params.user_id) {
            res.status(401).json({message: "Unauthorized access."});
        }
        else {
        res.render('EmergencyContact', {user_id: user_id});
    }
});

router.get('/resources/:user_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user_id = req.user.data[0].user_id;
    if (user_id != req.params.user_id) {
        res.status(401).json({message: "Unauthorized access."});
    }
    else {
        res.render('Resources', {user_id: user_id});
    }
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

router.get('/resources/shared/create/:user_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user_id = req.user.data[0].user_id;
    if (user_id != req.params.user_id) {
        res.status(401).json({message: "Unauthorized access."});
    }
    else {
        res.render('CreateResources', {user_id: user_id, mode: 'create', resource_id: 0});
    }
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

router.get('/resources/seek/:user_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user_id = req.user.data[0].user_id;
    if (user_id != req.params.user_id) {
        res.status(401).json({message: "Unauthorized access."});
    }
    else {
        res.render('SeekResources', {user_id: req.user.data[0].user_id});
    }
});

router.get('/resources/typeview/:type_id/:type_name', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user_id = req.user.data[0].user_id;

    res.render('TypeOfResources', {user_id: req.user.data[0].user_id, type_id: req.params.type_id, type_name: req.params.type_name});
});

router.get('/test', (req, res) => {
    res.render('Test');
})
router.get('/socket', (req, res) => {
    res.render('socketTest');
})

router.post('/sockets', async (req, res) => {
    const socketId = req.body.socket_id;
    const operation = req.body.operation;
    const socket = io.sockets.sockets.get(socketId);
    if (operation === 'joinRoom'){
        const senderId = req.body.sender_id;
        const receiverId = req.body.receiver_id;
        const roomName = [senderId, receiverId].sort().join('_');
        if (socket) {
            socket.join(roomName);
            res.status(200).json({success: true, message: `join room ${roomName} successfully`})
        } else {
            res.status(500).json({success: false, message: `join room ${roomName} with error`})
        }
    } else if (operation === 'register'){
        const userId = req.body.user_id;
        registerNewSocket(userId, socketId).then(()=>{
            console.log(`register user ${userId} and socket ${socketId} to the map`)
            res.status(200).json({success: true, message:`register user ${userId} successful`});
        })
    }
})


export default router;
