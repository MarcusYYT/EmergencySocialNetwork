import express from "express";
import { io,registerNewSocket } from "../config/socketConfig.js"
import { getResourceById } from "../services/resourceService.js";

const router = express.Router();

router.post('/', async (req, res) => {
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