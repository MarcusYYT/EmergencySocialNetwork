import { Server } from 'socket.io';
// const chatMsgModel = require("../models/ChatMsgModel");
// import postModel from '../models/Post.model.mjs';

module.exports = function (server) {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
    socket.on("post msg", (msg) => {
      io.emit("post msg", msg);
    //   chatMsgModel.saveOneMessage(msg.userId, msg.dateTime, msg.message);
    });
  });
};
