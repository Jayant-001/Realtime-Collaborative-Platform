import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import RedisService from "./services/redis.service.js";
import SocketController from "./controllers/socket.controller.js";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import logger from "@repo/logger/index.js";
import { createExecuteRouteRoutes } from "./routes/execute-code.route.js";
import BullMQService from "./services/bullmq.service.js";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";

dotenv.config();

class App {
    morganFormat = ":method :url :status :response-time ms";

    constructor() {
        this.app = express();
        this.httpServer = createServer(this.app);
        const pubClient = new Redis(process.env.REDIS_URL);
        const subClient = pubClient.duplicate();
        this.io = new Server(this.httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
            adapter: createAdapter(pubClient, subClient),
        });

        this.redisService = new RedisService();
        this.bullMQService = new BullMQService(); // TODO: Remove hard-coded queue name
        this.socketController = new SocketController(
            this.io,
            this.redisService
        );

        this.applyMiddlewares();
        this.initRoutes();
    }

    start(port = process.env.PORT | 4000) {
        this.socketController.initListeners();

        this.httpServer.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
        });
    }

    applyMiddlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(
            morgan(this.morganFormat, {
                stream: {
                    write: (message) => {
                        const logObject = {
                            method: message.split(" ")[0],
                            url: message.split(" ")[1],
                            status: message.split(" ")[2],
                            responseTime: message.split(" ")[3],
                        };
                        logger.info(JSON.stringify(logObject));
                    },
                },
            })
        );
    }

    initRoutes() {
        // Chat Routes
        this.app.use(
            "/api",
            createExecuteRouteRoutes(this.bullMQService, this.redisService)
        );

        // You can easily add more routes here
        // this.app.use('/api/users', createUserRoutes());
        // this.app.use('/api/rooms', createRoomRoutes());
    }
}

const app = new App();
app.start();

export default app;
