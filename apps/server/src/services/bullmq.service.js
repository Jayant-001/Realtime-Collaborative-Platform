import { Queue } from "bullmq";
import logger from "@repo/logger";

class BullMQService {
    constructor() {
        // Configure the Redis connection
        this.queueName = process.env.QUEUE_NAME || "defaultQueue";

        // Create a queue with the name provided
        this.queue = new Queue(this.queueName, {
            connection: process.env.REDIS_URL,
        });
        logger.info(
            `BullMQ server is redy to push message in queue: '${this.queueName}'`
        );
    }

    /**
     * Method to add a job to the queue
     * @param {Object} data - The data you want to send with the job.
     * @param {Object} options - Job options (e.g., delay, priority).
     */
    async addJob(jobName, data, options = {}) {
        try {
            const job = await this.queue.add(jobName, data, options);
            logger.info(`Job added with ID: ${job.id}`);
            return job;
        } catch (error) {
            logger.error(`Error adding job to queue: ${error.message}`);
        }
    }

    /**
     * Gracefully shutdown the queue
     */
    async shutdown() {
        await this.queue.close();
        logger.info("BullMQ service gracefully shut down");
    }
}

export default BullMQService;
