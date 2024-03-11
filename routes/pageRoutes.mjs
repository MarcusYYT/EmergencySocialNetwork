import express from 'express';
import passport from '../config/passportConfig.mjs';
import { io,registerNewSocket } from "../config/socketConfig.mjs"

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
            res.status(200).json({success: true, message:`register user ${userId} successful`});
        })
    }
})

export default router;
