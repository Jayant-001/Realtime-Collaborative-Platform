import Redis from "ioredis";
import { Server } from "socket.io";
import { SocketActions } from "./SocketActions.js";

const pub = new Redis();
const sub = new Redis();

class SocketService {
    socketUsernameMap = {}; // stores [ socketId: username ] || userSocketMap
    userRoomMap = {}; // stores [ socketId: roomId ]

    constructor() {
        console.log("Init Socker service...");
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*",
            },
        });
        sub.subscribe("MESSAGES");
    }

    getAllConnectedClients(roomId) {
        return Array.from(this._io.sockets.adapter.rooms.get(roomId) || []).map(
            (socketId) => ({
                socketId,
                username: this.socketUsernameMap[socketId],
            })
        );
    }

    initListeners() {
        console.log("Init Socket listeners...");
        this._io.on("connect", (socket) => {
            console.log("New socket connected:", socket.id);

            // Handle new user join to room
            socket.on(SocketActions.JOIN, async ({ roomId, username }) => {
                // Store username of the socket.id to a map
                this.socketUsernameMap[socket.id] = username;
                this.userRoomMap[socket.id] = roomId;

                // join the current user into given roomId
                socket.join(roomId);

                // Get all connected clients of the room
                const clients = this.getAllConnectedClients(roomId);

                console.log(clients);

                // Send message (new user joined) to all clients connected to the room
                clients.forEach(({ socketId }) => {
                    this._io.to(socketId).emit(SocketActions.JOINED, {
                        clients,
                        username,
                        socketId: socket.id,
                    });
                });
            });

            socket.on("disconnecting", () => {
                const userRoomId = this.userRoomMap[socket.id];

                // send to all users in the room but `not self`
                socket.to(userRoomId).emit(SocketActions.DISCONNECTED, {
                    socketId: socket.id,
                    username: this.socketUsernameMap[socket.id],
                });
                delete this.socketUsernameMap[socket.id];
                socket.leave();
            });

            // On code change by the user
            socket.on(SocketActions.CODE_CHANGE, ({ roomId, code }) => {
                const userRoomId = this.userRoomMap[socket.id];
                socket.to(userRoomId).emit(SocketActions.CODE_CHANGE, {
                    code,
                });
            });

            socket.on(SocketActions.SYNC_CODE, ({ socketId, code }) => {
                io.to(socketId).emit(SocketActions.SYNC_CODE, {
                    code,
                });
            });

            socket.on("event:message", async (message) => {
                console.log("New message received:", message);

                await pub.publish("MESSAGES", JSON.stringify(message));
            });
        });

        sub.on("message", (channel, message) => {
            if (channel == "MESSAGES") {
                console.log("Emitting msg: ", message);
                this._io.emit("message", message);
            }
        });
    }

    getIo() {
        return this._io;
    }
}

export default SocketService;
