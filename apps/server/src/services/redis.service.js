import Redis from "ioredis";
import { newRedisConfig } from "../config/redis.config.js";

class RedisService {
    constructor() {
        this.publisher = new Redis(newRedisConfig);
        this.subscriber = new Redis(newRedisConfig);
        this.client = new Redis(newRedisConfig);
    }

    async publish(channel, message) {
        await this.publisher.publish(channel, message);
    }

    async subscribe(channel, callback) {
        await this.subscriber.subscribe(channel);
        this.subscriber.on("message", (ch, msg) => {
            if (ch === channel) {
                callback(msg);
            }
        });
    }

    // Key-Value Operations
    async set(key, value, expiry = null) {
        if (expiry) {
            await this.client.set(key, value, "EX", expiry);
        } else {
            await this.client.set(key, value);
        }
    }

    async get(key) {
        return await this.client.get(key);
    }

    async exists(key) {
        return await this.client.exists(key);
    }

    async del(key) {
        await this.client.del(key);
    }

    // Hash Operations for Complex Data
    async hset(key, field, value) {
        await this.client.hset(key, field, value);
    }

    async hget(key, field) {
        return await this.client.hget(key, field);
    }

    async hdel(key, field) {
        await this.client.hdel(key, field);
    }

    // Set Operations
    async sadd(key, member) {
        await this.client.sadd(key, member);
    }

    async srem(key, member) {
        await this.client.srem(key, member);
    }

    async smembers(key) {
        return await this.client.smembers(key);
    }

    async rightPush(key, data) {
        console.log("adding message to reids", key, data);
        return await this.client.rpush(key, JSON.stringify(data));
    }

    async leftGet(key) {
        return await this.client.lrange(key, 0, -1);
    }
}

export default RedisService;
