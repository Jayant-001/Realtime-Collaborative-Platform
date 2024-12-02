import Redis from "ioredis";
import processCode from "./codeProcessor.js";
import logger from "@repo/logger/index.js";
import { Worker } from "bullmq";

const redis = new Redis({
    host: "localhost",
    port: 6379,
});

const queueName = "myQueue";

const processJob = async (job) => {
    logger.info(
        `Received a job with ID: ${job.id} from ${job.queueName} with job name: ${job.name}`
    );

    if (job.name !== "execute-code") {
        logger.error(`Can't identify job with name ${job.name}. Exit process`);
        return;
    }

    // Step 1: Process the message (this is where you put your task processing logic)
    const parsedMessage = JSON.parse(job.data);

    // Code result(output) after executing the code
    const result = await processCode(parsedMessage.content);

    const resultKey = `code-result:${parsedMessage.requestId}`;

    // Step 2: Store the result in Redis as a key-value pair
    await redis.set(resultKey, result);
    logger.info(`Result saved in redis with KEY: '${resultKey}'`);
};

const worker = new Worker(queueName, processJob, {
    connection: {
        host: "localhost",
        port: 6379,
    },
});
