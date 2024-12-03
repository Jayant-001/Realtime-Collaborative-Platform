import { v4 as uuid } from "uuid";
class ExecuteCodeController {
    constructor(bullMQService, redisService) {
        this.bullMQService = bullMQService;
        this.redisService = redisService;
    }

    async submitCode(req, res) {
        const requestId = uuid();
        req.body.requestId = requestId;

        await this.bullMQService.addJob(
            process.env.EXECUTE_CODE_QUEUE_JOB_NAME,
            JSON.stringify(req.body)
            // { delay: 10000 }
        );
        await this.redisService.set(`code-status:${requestId}`, "pending");

        return res.json({ success: true, requestId });
    }

    async getCodeResult(req, res) {
        // status: "pending" | "success" | "error";
        const status = await this.redisService.get(
            `${process.env.EXECUTE_CODE_STATUS_PREFIX}${req.params.requestId}`
        );

        if (status === "pending") {
            return res.json({
                status,
                result: null,
                error: null,
            });
        }

        const result = await this.redisService.client.get(
            `${process.env.EXECUTE_CODE_RESULT_PREFIX}${req.params.requestId}`
        );

        return res.json({
            status,
            result,
            error: null,
        });
    }
}

export default ExecuteCodeController;
