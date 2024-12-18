import RedisService from "../services/redis.service.js";
import Repository from "./repository.js";
import Redis from "ioredis";

const redisService = new RedisService();
console.log(process.env.UPSTASH_REDIS_REST_URL)
const redisClient = new Redis(process.env.UPSTASH_REDIS_REST_URL);

const repository = new Repository(redisService);

const room1 = "room1";
const room2 = "room2";

const user1 = { socketId: "socket1", username: "user 1" };
const user2 = { socketId: "socket2", username: "user 2" };

const user3 = { socketId: "socket3", username: "user 3" };
const user4 = { socketId: "socket4", username: "user 4" };

(async () => {
    // await repository.addUserToRoom(room1, user1.socketId, user1.username);
    // await repository.addUserToRoom(room1, user2.socketId, user2.username);

    // await repository.addUserToRoom(room2, user3.socketId, user3.username);
    // await repository.addUserToRoom(room2, user4.socketId, user4.username);
    // return;

    // const users1 = await repository.getRoomUsersByRoomId(room1);
    // const users2 = await repository.getRoomUsersByRoomId(room2);

    // console.log(users1);
    // console.log(users2);

    // console.log(await repository.getRoomUsersByRoomId("room1"));
    // console.log(await repository.deleteUserBySocketId("socket2"));
    // console.log(await repository.getRoomUsersByRoomId("room1"));

    // console.log("Data added");

    // await redisClient.set("name", "jayant");
    console.log(await redisClient.get("name"));

    // const roomId = "49fe9077-4067-458f-ba90-be3f01f13513";
    // const roomKey = `room:${roomId}:messages`;

    // const data = await repository.getRoomMssages(roomId);
    // console.log(data);

    // data.forEach(d => console.log(JSON.parse(d)))
    // console.log( data);
})();
