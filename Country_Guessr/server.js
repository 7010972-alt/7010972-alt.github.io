const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("."));

//server variables
let allRooms = [];

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);
  io.emit("allrooms", allRooms)

  //hosted rooms
  socket.on("rooms", (roomInfo) => {
    allRooms.push(roomInfo)
    io.emit("rooms", roomInfo);
  });

  //delete rooms
  socket.on("disconnect", () => {
    allRooms = allRooms.filter(room => room.roomHost !== socket.id);
    io.emit("allrooms", allRooms);
  });
});



server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});