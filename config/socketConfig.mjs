import { Server } from 'socket.io';
// const chatMsgModel = require("../models/ChatMsgModel");
import * as postService from '../services/postService.mjs';

export default function (server) {
    const io = new Server(server);

    io.on("connection", (socket) => {
        console.log("a user connected");
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
        socket.on("postData", (postData) => {
            io.emit("postData", postData);
            // console.log("I received!!!!!!!!")
            postService.createNewPost(postData.userId, postData.content, postData.status);
            //   chatMsgModel.saveOneMessage(msg.userId, msg.dateTime, msg.message);
        });
    });
};
