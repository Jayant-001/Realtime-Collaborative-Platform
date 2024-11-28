import RedisService from "../services/redis.service.js";

class RoomRepository {
    PREFIX = "room:";

    constructor(redisService) {
        this.redisService = redisService;
    }

    async addUserToRoom(roomId, socketId) {
        await this.redisService.sadd(
            `${this.PREFIX}${roomId}:members`,
            socketId
        );
    }

    async removeUserFromRoom(roomId, socketId) {
        await this.redisService.srem(
            `${this.PREFIX}${roomId}:members`,
            socketId
        );
    }

    async getRoomMembers(roomId) {
        return await this.redisService.smembers(
            `${this.PREFIX}${roomId}:members`
        );
    }
}

export default RoomRepository;
