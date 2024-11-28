class UserRepository {
    PREFIX = "user:";
    SOCKET_TO_USER_KEY = "socket-to-user";
    USER_TO_SOCKET_KEY = "user-to-socket";

    constructor(redisService) {
        this.redisService = redisService;
    }

    async registerUser(socketId, username, roomId) {
        // Map socket to user details
        await this.redisService.hset(
            this.SOCKET_TO_USER_KEY,
            socketId,
            JSON.stringify({ username, roomId })
        );

        // Map user to socket
        await this.redisService.hset(
            this.USER_TO_SOCKET_KEY,
            username,
            socketId
        );
    }

    async getUserBySocketId(socketId) {
        const userData = await this.redisService.hget(
            this.SOCKET_TO_USER_KEY,
            socketId
        );
        return userData ? JSON.parse(userData) : null;
    }

    async removeUser(socketId) {
        const userData = await this.getUserBySocketId(socketId);
        if (userData) {
            await this.redisService.hdel(this.SOCKET_TO_USER_KEY, socketId);
            await this.redisService.hdel(
                this.USER_TO_SOCKET_KEY,
                userData.username
            );
        }
    }
}

export default UserRepository;
