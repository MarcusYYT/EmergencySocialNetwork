import { Server } from 'socket.io';
// const chatMsgModel = require("../models/ChatMsgModel");
import * as postService from '../services/postService.mjs';
import * as userService from '../services/userService.mjs';
import * as timers from "timers";

export let io;
var socketToUser = new Map();
export default function (server) {
    io = new Server(server);

    io.on("connection", (socket) => {
        console.log(`User connected. Socket_id: ${socket.id}`);
        
        socket.on("disconnect", async () => {
            var user_id = socketToUser.get(socket.id);
            socketToUser.delete(socket.id);
            setTimeout(async ()=>{
                console.log(socketToUser)
                const user_ids = Array.from(socketToUser.values());
                if (!user_ids.includes(user_id)) {
                    await userService.changeOnlineStatus(user_id, "offline").then((res)=>{
                        console.log(res);
                        io.emit("status_update");
                    })
                    console.log(`user ${user_id} disconnected. Socket_id: ${socket.id}`);
                } else {
                    console.log(`user ${user_id} stays connected`);
                }
            },1000)
        });
        socket.on("postData", (postData) => {
            io.emit("postData", postData);
            // console.log("I received!!!!!!!!")
            postService.createNewPost(postData.userId, postData.content, postData.status);
            //   chatMsgModel.saveOneMessage(msg.userId, msg.dateTime, msg.message);
        });

    });
};

export async function registerNewSocket(user_id, socket_id){
    socketToUser.set(socket_id, user_id);
    io.emit("status_update");
}
