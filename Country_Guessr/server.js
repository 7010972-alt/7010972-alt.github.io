const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("."));

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);

  socket.on("hello", (data) => {
    console.log("got hello:", data);
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});