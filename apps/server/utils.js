import Redis from "ioredis";
import logger from "@repo/logger/index.js";

const redisClient = new Redis(); // Create a new ioredis client

async function publishMessage(message) {
    try {
        // Publish messages to "my_channel"
        await redisClient.publish("execute-code", message);
        logger.info("Published:", { message });
    } catch (err) {
        logger.error("Error while publishing message:", err);
    }
}

async function getExecutedCodeResult(requestKey) {
    try {
        return await redisClient.get(`code-result:${requestKey}`);
    } catch (error) {
        logger.error(
            `Error while get result for KEY: '${requestKey}, ERROR: '${error.message}'`
        );
    }
}

export { publishMessage, getExecutedCodeResult };
