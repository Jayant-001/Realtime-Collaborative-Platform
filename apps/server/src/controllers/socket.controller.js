import { SocketActions } from "../utils/socket-actions.js";
import logger from "@repo/logger";
import Repository from "../repositories/repository.js";

class SocketController {
    constructor(io, redisService) {
        this.io = io;
        this.redisService = redisService;
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

                // Getting code and text from the DB
                const code = await this.repository.getRoomCode(roomId);
                const text = await this.repository.getRoomText(roomId);
                const messages = await this.repository.getRoomMssages(roomId);
                const input = await this.repository.getRoomCodeInput(roomId);
                const language =
                    await this.repository.getRoomCodeLanguage(roomId);
                const activities =
                    await this.repository.getRoomActivities(roomId);

                socket.in(roomId).emit(SocketActions.ROOM_USERS, { users });
                socket.emit(SocketActions.SYNC_USER, {
                    users,
                    code,
                    text,
                    messages,
                    input,
                    language,
                    activities,
                });
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

            // socket.on(
            //     SocketActions.SYNC_USER,
            //     async ({ socketId, code, text }) => {
            //         socket
            //             .to(socketId)
            //             .emit(SocketActions.CODE_CHANGE, { code });
            //         socket
            //             .to(socketId)
            //             .emit(SocketActions.TEXT_CHANGE, { text });
            //     }
            // );

            // Code Sync Handlers
            socket.on(SocketActions.CODE_CHANGE, async ({ roomId, code }) => {
                await this.repository.setRoomCode(roomId, code);
                socket.to(roomId).emit(SocketActions.CODE_CHANGE, { code });
            });

            // Text Sync Handlers
            socket.on(SocketActions.TEXT_CHANGE, async ({ roomId, text }) => {
                await this.repository.setRoomText(roomId, text);
                socket.to(roomId).emit(SocketActions.TEXT_CHANGE, { text });
            });

            socket.on(
                SocketActions.LANGUAGE_CHANGE,
                async ({ roomId, language }) => {
                    await this.repository.setRoomCodeLanguage(roomId, language);
                    socket
                        .to(roomId)
                        .emit(SocketActions.LANGUAGE_CHANGE, { language });
                }
            );

            socket.on(SocketActions.INPUT_CHANGE, async ({ roomId, input }) => {
                await this.repository.setRoomCodeInput(roomId, input);
                socket.to(roomId).emit(SocketActions.INPUT_CHANGE, { input });
            });

            // socket.on(
            //     SocketActions.SYNC_CODE,
            //     async ({ socketId, code, text }) => {
            //         this.io
            //             .to(socketId)
            //             .emit(SocketActions.SYNC_CODE, { code, text });
            //     }
            // );

            // Message Handling with Redis Pub/Sub
            socket.on(SocketActions.SEND_MESSAGE, async (message) => {
                await this.repository.addRoomMessage(message.roomId, message);
                this.io
                    .to(message.roomId)
                    .emit(SocketActions.SEND_MESSAGE, message);
            });

            socket.on(SocketActions.ACTIVITY_CHANGE, async (activity) => {
                await this.repository.addRoomActivity(
                    activity.roomId,
                    activity
                );
                this.io
                    .to(activity.roomId)
                    .emit(SocketActions.ACTIVITY_CHANGE, activity);
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
    }
}

export default SocketController;
