import Redis from "ioredis";
import processCode from "./codeProcessor.js";
import logger from "@repo/logger/index.js";
import { Worker } from "bullmq";
import dotenv from "dotenv";

dotenv.config();

const REDIS_URL = process.env.REDIS_URL;
const QUEUE_NAME = process.env.QUEUE_NAME;

// Here add check if redis_url or queue_name is empty then log and then return from the process
// Check if REDIS_URL or QUEUE_NAME is missing
if (!REDIS_URL || !QUEUE_NAME) {
    logger.error(
        "Missing REDIS_URL or QUEUE_NAME in environment variables. Exiting process... =>",
        { REDIS_URL, QUEUE_NAME }
    );
    process.exit(1); // Exit with a non-zero code to indicate failure
}

const redis = new Redis(process.env.REDIS_URL);

const queueName = process.env.QUEUE_NAME || "defaultQueue";

const processJob = async (job) => {
    // Step 1: Process the message (this is where you put your task processing logic)
    const parsedMessage = JSON.parse(job.data);
    try {
        logger.info(
            `Received a job with ID: ${job.id} from ${job.queueName} with job name: ${job.name}`
        );

        if (job.name !== "execute-code") {
            logger.error(
                `Can't identify job with name ${job.name}. Exit process`
            );
            return;
        }

        // Getting status and result(output) after executing the code
        const [success, result] = await processCode(parsedMessage.content);

        logger.info(`Execution status for job.id: ${success}`);

        const resultKey = `code-result:${parsedMessage.requestId}`;

        // Step 2: Store the status of the job
        await redis.set(
            `code-status:${parsedMessage.requestId}`,
            success ? "success" : "error"
        );

        // Set result of the job
        await redis.set(resultKey, result);
        logger.info(`Result saved in redis with KEY: '${resultKey}'`);
    } catch (error) {
        logger.error(`Error while executing the code: ${error.message}`);

        // set status and result as false
        await redis.set(`code-status:${parsedMessage.requestId}`, "error");
        await redis.set(
            `code-result:${parsedMessage.requestId}`,
            "Unexpected error occurred"
        );
    }
};

const worker = new Worker(queueName, processJob, {
    connection: process.env.REDIS_URL,
});

// Log a message indicating that the worker is running and listening to the queue
worker.on("ready", () => {
    logger.info(`Worker is ready and listening on queue: '${queueName}'`);
});

// Gracefully shut down worker and Redis connection
const gracefulShutdown = async () => {
    try {
        logger.info("Gracefully shutting down...");
        // Close the worker
        await worker.close();
        logger.info("Worker closed successfully.");

        // Close the Redis connection
        await redis.quit();
        logger.info("Redis connection closed successfully.");

        // Exit the process
        process.exit(0);
    } catch (error) {
        logger.error("Error during shutdown:", error);
        process.exit(1);
    }
};

// Listen for shutdown signals
process.on("SIGINT", gracefulShutdown); // Handle Ctrl+C termination
process.on("SIGTERM", gracefulShutdown); // Handle termination signals from system/cloud environments
