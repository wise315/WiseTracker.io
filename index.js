import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server as SocketIO } from "socket.io";
import dotenv from "dotenv";

import authRoutes from "./src/routes/auth.js";
import transferRoutes from "./src/routes/transfer.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIO(httpServer, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

app.use("/api/auth", authRoutes);
app.use("/api", transferRoutes(io));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
