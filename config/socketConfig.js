import { Server } from 'socket.io';
// const chatMsgModel = require("../models/ChatMsgModel");
import * as postService from '../services/postService.js';
import * as userService from '../services/userService.js';
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

    });
};

export async function registerNewSocket(user_id, socket_id){
    socketToUser.set(socket_id, user_id);
    console.log(socketToUser)
    io.emit("status_update");
}

export async function getSocketIdByUserId(userId) {
    const entry = Array.from(socketToUser.entries()).find(([socketId, storedUserId]) => storedUserId === userId);
    return entry ? entry[0] : null; // Return the socket ID if found, otherwise return null
}
