import UserRepository from "../repositories/user.repository.js";
import RoomRepository from "../repositories/room.repository.js";
import { SocketActions } from "../utils/socket-actions.js";
import logger from "@repo/logger";
import Repository from "../repositories/repository.js";

class SocketController {
    constructor(io, redisService) {
        this.io = io;
        this.redisService = redisService;
        this.userRepository = new UserRepository(redisService);
        this.roomRepository = new RoomRepository(redisService);
        this.repository = new Repository(redisService);
    }

    initListeners() {
        this.io.on("connection", (socket) => {
            logger.info("New socket connected:", { socketId: socket.id });

            socket.on(SocketActions.JOIN, async ({ roomId, username }) => {
                logger.info(`New Join request: `, { roomId, username });

                // Join room
                socket.join(roomId);

                // Register user in Redis
                await this.repository.addUserToRoom(
                    roomId,
                    socket.id,
                    username
                );

                // Notify other users in the room
                socket.to(roomId).emit(SocketActions.JOINED, {
                    socketId: socket.id,
                    username,
                });

                // Get room members
                const users =
                    await this.repository.getRoomUsersByRoomId(roomId);

                socket.in(roomId).emit(SocketActions.ROOM_USERS, { users });
                socket.emit(SocketActions.ROOM_USERS, { users });
            });

            socket.on("disconnecting", async () => {
                const roomId = await this.repository.getRoomIdBySocketId(
                    socket.id
                );

                const username = await this.repository.getUsernameBySocketId(
                    socket.id
                );

                await this.repository.deleteUserBySocketId(socket.id);

                socket.to(roomId).emit(SocketActions.DISCONNECTED, {
                    socketId: socket.id,
                    username,
                });
            });

            socket.on(
                SocketActions.SYNC_USER,
                async ({ socketId, code, text }) => {
                    socket
                        .to(socketId)
                        .emit(SocketActions.CODE_CHANGE, { code });
                    socket
                        .to(socketId)
                        .emit(SocketActions.TEXT_CHANGE, { text });
                }
            );

            // Code Sync Handlers
            socket.on(SocketActions.CODE_CHANGE, async ({ roomId, code }) => {
                socket.to(roomId).emit(SocketActions.CODE_CHANGE, { code });
            });

            // Text Sync Handlers
            socket.on(SocketActions.TEXT_CHANGE, async ({ roomId, text }) => {
                socket.to(roomId).emit(SocketActions.TEXT_CHANGE, { text });
            });

            socket.on(
                SocketActions.SYNC_CODE,
                async ({ socketId, code, text }) => {
                    this.io
                        .to(socketId)
                        .emit(SocketActions.SYNC_CODE, { code, text });
                }
            );

            // Message Handling with Redis Pub/Sub
            socket.on(SocketActions.MESSAGE, async (message) => {
                await this.redisService.publish(
                    "MESSAGES",
                    JSON.stringify(message)
                );
            });

            socket.on(SocketActions.LEAVED, async ({ roomId }) => {
                logger.info(`Sending leave message to ${roomId}`);

                const username = await this.repository.getUsernameBySocketId(
                    socket.id
                );

                await this.repository.deleteUserBySocketId(socket.id);

                socket.leave(roomId);
                this.io.to(roomId).emit(SocketActions.LEAVED, {
                    socketId: socket.id,
                    username,
                });
            });
        });

        // Redis Pub/Sub Message Listener
        this.redisService.subscribe("MESSAGES", (message) => {
            this.io.emit(SocketActions.MESSAGE, JSON.parse(message));
        });
    }
}

export default SocketController;
