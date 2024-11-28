import Redis from "ioredis";
import processCode from "./codeProcessor.js";
import logger from "@repo/logger/index.js";

const redis = new Redis({
    host: "localhost",
    port: 6379,
});

const subscriber = new Redis({
    host: "localhost",
    port: 6379,
});

// Define the channel name and the result key
const channel = "execute-code";

// Subscribe to the Redis channel
subscriber.subscribe(channel, (err, count) => {
    if (err) {
        console.error("Error subscribing to the channel:", err);
        return;
    }
    console.log(`Subscribed to ${count} channel(s). - ${channel}`);
});

// Process the message and store the result in Redis
subscriber.on("message", async (channel, message) => {
    logger.info(`Received message from channel ${channel}`);

    // Step 1: Process the message (this is where you put your task processing logic)

    const parsedMessage = JSON.parse(message);

    const result = await processCode(parsedMessage.content);

    const resultKey = `code-result:${parsedMessage.requestId}`;

    // Step 2: Store the result in Redis as a key-value pair
    await redis.set(resultKey, result);
    logger.info(`Result saved in redis with KEY: '${resultKey}'`);
});
