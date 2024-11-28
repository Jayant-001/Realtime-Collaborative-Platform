class ExecuteCodeController {
    constructor(bullMQService, redisService) {
        this.bullMQService = bullMQService;
        this.redisService = redisService;
    }

    async submitCode(req, res) {
        await this.bullMQService.addJob(
            process.env.EXECUTE_CODE_QUEUE_JOB_NAME,
            JSON.stringify(req.body)
        );
        return res.json({ success: true, requestId: req.body.requestId });
    }

    async getCodeResult(req, res) {
        const result = await this.redisService.client.get(
            `${process.env.EXECUTE_CODE_RESULT_PREFIX}${req.params.requestId}`
        );
        return res.json({
            requestId: req.params.requestId,
            result,
        });
    }
}

export default ExecuteCodeController;
