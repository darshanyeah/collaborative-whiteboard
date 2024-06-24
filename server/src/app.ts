import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import whiteboardRoutes from "./routes/whiteboardRoutes";
import { updateBoardDataBySocket } from "./controllers/whiteboardController";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
connectDB();

// ================= Middleware start =================

/**
 * Enable CORS by using the `cors` middleware.
 */
app.use(cors());
/**
 * Parses incoming requests with JSON payloads.
 */
app.use(express.json());

// ================= Middleware end =================

// ================= Models start =================
import "./models/User";
import "./models/Whiteboard";
// ================= Models end =================

// ================= Routes start =================
app.use("/api/users", userRoutes);
app.use("/api/whiteboard", whiteboardRoutes);
// ================= Routes end =================

// ================= Sockets start =================
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  /**
   * Event handler for when a client joins a room.
   *
   * @param {string} data - The ID of the room to join.
   */
  socket.on("joinRoom", (data) => {
    socket.join(data);
  });

  /**
   * Event handler for when a client leaves a room.
   *
   * @param {string} data - The ID of the room to leave.
   */
  socket.on("leaveRoom", (data) => {
    socket.leave(data);
  });

  /**
   * Event handler for when a client sends drawing data.
   *
   * @param {string} boardId - The ID of the board.
   * @param {Array<IDrawing>} data - The drawing data.
   */
  socket.on("drawing", (boardId, data) => {
    updateBoardDataBySocket(boardId, data);
    io.to(boardId).emit("drawing", data);
  });

  /**
   * Event handler for when a client sends an undo command.
   *
   * @param {string} boardId - The ID of the board.
   * @param {Array<IDrawing>} data - The drawing data.
   */
  socket.on("undo", (boardId, data) => {
    io.to(boardId).emit("undo", data);
  });

  /**
   * Event handler for when a client sends a redo command.
   *
   * @param {string} boardId - The ID of the board.
   * @param {Array<IDrawing>} data - The drawing data.
   */
  socket.on("redo", (boardId, data) => {
    io.to(boardId).emit("redo", data);
  });

  /**
   * Event handler for when a client disconnects.
   */
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// ================= Sockets end =================

const PORT = process.env.PORT || 5000;

/**
 * Starts the server on the specified port.
 */
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
