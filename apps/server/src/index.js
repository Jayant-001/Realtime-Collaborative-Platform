import express from "express";
import dotenv from "dotenv";
import { publishMessage, getExecutedCodeResult } from "../utils.js";
import logger from "@repo/logger/index.js";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import SocketService from "./socket/socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const socketService = new SocketService();

// Initlizing Socket with http server
socketService.getIo().attach(server);
socketService.initListeners();

const PORT = process.env.PORT || 4001;
const morganFormat = ":method :url :status :response-time ms";

// middlewares
app.use(cors());
app.use(express.json());
app.use(
    morgan(morganFormat, {
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

app.post("/api/send", async (req, res) => {
    try {
        await publishMessage(JSON.stringify(req.body));
        res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        logger.error({ error });
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/code-result/:requestId", async (req, res) => {
    const response = await getExecutedCodeResult(req.params.requestId);

    if (response) {
        res.status(200).json({ result: response });
    } else {
        res.status(404).send("Response not found");
    }
});

server.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`));
