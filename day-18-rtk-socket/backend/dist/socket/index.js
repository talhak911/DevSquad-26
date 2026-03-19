"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = setupSocket;
const uuid_1 = require("uuid");
const store_1 = require("../store");
function setupSocket(io) {
    io.on("connection", (socket) => {
        console.log(`[socket] connected: ${socket.id}`);
        // Join a chat room
        socket.on("join-room", (roomId) => {
            // Leave all previous rooms (except the default socket room)
            const currentRooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
            currentRooms.forEach((r) => socket.leave(r));
            socket.join(roomId);
            console.log(`[socket] ${socket.id} joined room: ${roomId}`);
        });
        // Send a message
        socket.on("send-message", (data) => {
            const { roomId, username, text } = data;
            const newMessage = {
                id: (0, uuid_1.v4)(),
                roomId,
                username,
                text,
                timestamp: new Date().toISOString(),
            };
            // Persist to in-memory store
            const roomMessages = store_1.messages.get(roomId) ?? [];
            roomMessages.push(newMessage);
            store_1.messages.set(roomId, roomMessages);
            // Broadcast to all clients in the room
            io.to(roomId).emit("receive-message", newMessage);
            console.log(`[socket] message in ${roomId} from ${username}: ${text}`);
        });
        // Typing indicator – broadcast full { roomId, username } so clients can update correct room
        socket.on("typing", (data) => {
            socket.to(data.roomId).emit("user-typing", { roomId: data.roomId, username: data.username });
        });
        // Stop typing indicator
        socket.on("stop-typing", (data) => {
            socket.to(data.roomId).emit("user-stopped-typing", { roomId: data.roomId, username: data.username });
        });
        socket.on("disconnect", () => {
            console.log(`[socket] disconnected: ${socket.id}`);
        });
    });
}
