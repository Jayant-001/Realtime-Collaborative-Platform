class RoomRepository {
    PREFIX = "room:";

    constructor(redisService) {
        this.redisService = redisService;
    }

    async addUserToRoom(roomId, socketId, username) {
        // Check if the room exists
        const roomExists = await this.redisService.exists(roomId);

        // If the room does not exists, create it
        if (!roomExists) {
            await this.redisService.hset(roomId, "users", JSON.stringify([]));
        }

        // Add the user to the room
        const users = JSON.parse(await this.redisService.hget(roomId, "users"));
        users.push({ socketId, username });

        await this.redisService.hset(roomId, "users", JSON.stringify(users));
    }

    async removeUserFromRoom(roomId, socketId) {
        // Fetch current users in the room
        const users = await getUsersFromRoom(roomId);

        // Filter out the user to be removed
        const updatedUsers = users.filter((user) => user.socketId !== socketId);

        // Update the Redis hash with the new user list
        await this.redisService.hset(
            roomId,
            "users",
            JSON.stringify(updatedUsers)
        );
    }

    async getUsersFromRoom(roomId) {
        const users = await this.redisService.hget(roomId, "users");
        return users ? JSON.parse(users) : [];
    }

    async setRoomIdToSocketId(socketId, roomId) {
        await this.redisService.set(socketId, roomId);
    }

    async getRoomIdBySocketId(socketId) {
        return await this.redisService.get(socketId);
    }

    async deleteRoomIdFromSocketId(socketId) {
        await this.redisService.del(socketId);
    }

}

export default RoomRepository;
