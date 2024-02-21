import { Server } from 'socket.io';
// const chatMsgModel = require("../models/ChatMsgModel");
import * as postService from '../services/postService.mjs';
import * as userService from '../services/userService.mjs';

export default function (server) {
    const io = new Server(server);
    let socketToUser = new Map();

    io.on("connection", (socket) => {
        console.log(`User ${socket.id} connected`);
        socket.on("registered", (userId) => {
            if (! socketToUser.has(socket.id)) {
                socketToUser.set(socket.id, userId);
            }
            io.emit("status_update");
        })
        
        socket.on("disconnect", async () => {
            console.log(`user ${socketToUser.get(socket.id)} disconnected`);
            await userService.changeOnlineStatus(socketToUser.get(socket.id), "Offline").then((res)=>{
                console.log(res);
            })
        });
        socket.on("postData", (postData) => {
            io.emit("postData", postData);
            // console.log("I received!!!!!!!!")
            postService.createNewPost(postData.userId, postData.content, postData.status);
            //   chatMsgModel.saveOneMessage(msg.userId, msg.dateTime, msg.message);
        });
    });
};
