import express from "express";
import ExecuteCodeController from "../controllers/executeCode.controller.js";

export function createExecuteRouteRoutes(bullMQService, redisService) {
    const router = express.Router();
    const controller = new ExecuteCodeController(bullMQService, redisService);

    router.post("/execute-code", controller.submitCode.bind(controller));
    router.get(
        "/code-result/:requestId",
        controller.getCodeResult.bind(controller)
    );

    return router;
}
