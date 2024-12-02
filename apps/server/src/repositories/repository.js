class Repository {
    usernamePrefix = "username:";
    roomIdPrefix = "roomId:";

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

        await this.redisService.set(
            `${this.usernamePrefix}${socketId}:`,
            username
        );
        await this.redisService.set(`${this.roomIdPrefix}${socketId}:`, roomId);
    }

    async getRoomUsersByRoomId(roomId) {
        return JSON.parse(await this.redisService.hget(roomId, "users"));
    }

    async getRoomIdBySocketId(socketId) {
        return await this.redisService.get(`${this.roomIdPrefix}${socketId}:`);
    }

    async getUsernameBySocketId(socketId) {
        return await this.redisService.get(
            `${this.usernamePrefix}${socketId}:`
        );
    }

    async getUserBySocketId(socketId) {
        const roomId = await this.getRoomIdBySocketId(socketId);
        const users = this.getRoomUsersByRoomId(roomId);
        return users.find((user) => user.socketId == socketId);
    }

    async deleteUserBySocketId(socketId) {
        // Get roomId by user's socket id
        const roomId = await this.getRoomIdBySocketId(socketId);

        // Fetch current users in the room
        const users = (await this.getRoomUsersByRoomId(roomId)) || [];

        // Filter out the user to be removed
        const updatedUsers = users.filter((user) => user.socketId !== socketId);

        // Update the Redis hash with the new user list
        await this.redisService.hset(
            roomId,
            "users",
            JSON.stringify(updatedUsers)
        );
        await this.redisService.del(`${this.usernamePrefix}${socketId}:`);
        await this.redisService.del(`${this.roomIdPrefix}${socketId}:`);
    }

    async setRoomCode(roomId, code) {
        await this.redisService.set(`room:${roomId}:code`, code);
    }

    async getRoomCode(roomId) {
        return await this.redisService.get(`room:${roomId}:code`);
    }

    async setRoomText(roomId, text) {
        await this.redisService.set(`room:${roomId}:text`, text);
    }

    async getRoomText(roomId) {
        return await this.redisService.get(`room:${roomId}:text`);
    }

    async addRoomMessage(roomId, message) {
        const roomKey = `room:${roomId}:messages`;
        await this.redisService.rightPush(roomKey, message);
    }

    async getRoomMssages(roomId) {
        const roomKey = `room:${roomId}:messages`;
        const messagesList = await this.redisService.leftGet(roomKey);
        return messagesList.map((message) => JSON.parse(message));
    }

    async addRoomActivity(roomId, activity) {
        const roomKey = `room:${roomId}:activities`;
        await this.redisService.rightPush(roomKey, activity);
    }

    async getRoomActivities(roomId) {
        const roomKey = `room:${roomId}:activities`;
        const activityList = await this.redisService.leftGet(roomKey);
        return activityList.map((message) => JSON.parse(message));
    }

    async setRoomCodeLanguage(roomId, value) {
        await this.redisService.set(`room:${roomId}:language`, value);
    }

    async getRoomCodeLanguage(roomId) {
        return await this.redisService.get(`room:${roomId}:language`);
    }

    async setRoomCodeInput(roomId, value) {
        await this.redisService.set(`room:${roomId}:code-input`, value);
    }

    async getRoomCodeInput(roomId) {
        return await this.redisService.get(`room:${roomId}:code-input`);
    }
}

export default Repository;
