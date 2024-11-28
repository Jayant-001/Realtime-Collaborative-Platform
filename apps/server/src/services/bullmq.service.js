import { Queue, Worker } from "bullmq";
import logger from "@repo/logger";

class BullMQService {
    constructor(redisConfig, queueName) {
        // Configure the Redis connection
        this.queueName = queueName || "defaultQueue";

        // Create a queue with the name provided
        this.queue = new Queue(this.queueName, {
            connection: redisConfig,
        });

        // Set up a worker to process jobs in the queue
        this.worker = new Worker(this.queueName, this.processJob.bind(this), {
            connection: redisConfig,
        });
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
     * Method to process a job from the queue
     * @param {Object} job - The job object that was fetched from the queue.
     */
    async processJob(job) {
        try {
            logger.info(`Processing job ${job.id} with data:`, {
                data: job.data,
            });

            // Simulate job processing (this should be replaced with your actual job logic)
            // For example, you might call a service method to handle this job:
            // await someService.doSomething(job.data);
            return `Job ${job.id} completed successfully.`;
        } catch (error) {
            logger.error("Error processing job:", error);
            throw error; // Throwing the error will allow retry logic in BullMQ
        }
    }

    /**
     * Gracefully shutdown the worker and queue
     */
    async shutdown() {
        await this.worker.close();
        await this.queue.close();
        logger.info("BullMQ service gracefully shut down");
    }
}

export default BullMQService;
