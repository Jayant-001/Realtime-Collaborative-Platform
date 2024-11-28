import UserRepository from "../repositories/user.repository.js";
import RoomRepository from "../repositories/room.repository.js";
import { SocketActions } from "../utils/socket-actions.js";
import logger from "@repo/logger";

class SocketController {
    constructor(io, redisService) {
        this.io = io;
        this.redisService = redisService;
        this.userRepository = new UserRepository(redisService);
        this.roomRepository = new RoomRepository(redisService);
    }

    initListeners() {
        this.io.on("connection", (socket) => {
            logger.info("New socket connected:", { socketId: socket.id });

            socket.on(SocketActions.JOIN, async (data) => {
                const { roomId, username } = data;
                logger.info(`New Join request: `, data);

                // Register user in Redis
                await this.userRepository.registerUser(
                    socket.id,
                    username,
                    roomId
                );
                await this.roomRepository.addUserToRoom(roomId, socket.id);

                // Join room
                socket.join(roomId);

                // Get room members
                const roomMembers =
                    await this.roomRepository.getRoomMembers(roomId);

                // console.log("Room members :->>", roomMembers);
                // const tempData = Array.from(
                //     this.io.sockets.adapter.rooms.get(roomId) || []
                // ).map((socketId) => ({
                //     socketId,
                //     // username: this.socketUsernameMap[socketId],
                // }));

                // console.log("Temp data : ->>>", tempData);

                const clients = await Promise.all(
                    roomMembers.map(async (socketId) => {
                        const userData =
                            await this.userRepository.getUserBySocketId(
                                socketId
                            );
                        return {
                            socketId,
                            username: userData?.username,
                        };
                    })
                );

                // console.log("Clients, ", clients);

                // Emit to the newly connected client
                socket.emit(SocketActions.JOINED, {
                    clients, // Send the list of clients to the newly connected user
                    username,
                    socketId: socket.id,
                });

                // Broadcast to room
                socket.in(roomId).emit(SocketActions.JOINED, {
                    clients,
                    username,
                    socketId: socket.id,
                });
            });

            socket.on("disconnecting", async () => {
                const userData = await this.userRepository.getUserBySocketId(
                    socket.id
                );

                if (userData) {
                    const { roomId } = userData;

                    // Remove from room
                    await this.roomRepository.removeUserFromRoom(
                        roomId,
                        socket.id
                    );

                    // Notify room
                    socket.to(roomId).emit(SocketActions.DISCONNECTED, {
                        socketId: socket.id,
                        username: userData.username,
                    });

                    // Remove user from tracking
                    await this.userRepository.removeUser(socket.id);
                }
            });

            // Code Sync Handlers
            socket.on(SocketActions.CODE_CHANGE, async ({ roomId, code }) => {
                socket.to(roomId).emit(SocketActions.CODE_CHANGE, { code });
            });

            socket.on(SocketActions.SYNC_CODE, async (data) => {
                const { socketId, code } = data;
                this.io.to(socketId).emit(SocketActions.SYNC_CODE, { code });
            });

            // Message Handling with Redis Pub/Sub
            socket.on(SocketActions.MESSAGE, async (message) => {
                await this.redisService.publish(
                    "MESSAGES",
                    JSON.stringify(message)
                );
            });
        });

        // Redis Pub/Sub Message Listener
        this.redisService.subscribe("MESSAGES", (message) => {
            this.io.emit(SocketActions.MESSAGE, JSON.parse(message));
        });
    }
}

export default SocketController;
