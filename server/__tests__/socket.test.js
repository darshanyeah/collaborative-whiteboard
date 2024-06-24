const express = require("express");
const http = require("http");
const ioc = require("socket.io-client");
const { Server } = require("socket.io");

describe("Whiteboard project", () => {
  let io;
  let serverSocket;
  let clientSocket;
  let httpServer;

  /**
   * Setup the server and client before all tests.
   *
   * @param {Function} done - Callback to indicate setup is complete.
   */
  beforeAll((done) => {
    const app = express();
    httpServer = http.createServer(app);
    io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    httpServer.listen(() => {
      const port = httpServer.address().port; // Get the dynamically assigned port
      clientSocket = ioc(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  }, 10000);

  /**
   * Cleanup after all tests.
   */
  afterAll(() => {
    io?.close();
    clientSocket?.disconnect();
    httpServer?.close();
  });

  /**
   * Test for joining a board.
   *
   * @param {Function} done - Callback to indicate the test is complete.
   */
  test("should join board", (done) => {
    const roomId = "myRoom";
    clientSocket.emit("joinRoom", roomId);
    serverSocket.on("joinRoom", (room) => {
      expect(room).toBe(roomId);
      done();
    });
  });

  /**
   * Test for leaving a board.
   *
   * @param {Function} done - Callback to indicate the test is complete.
   */
  test("should leave board", (done) => {
    const roomId = "myRoom";
    clientSocket.emit("joinRoom", roomId);
    clientSocket.emit("leaveRoom", roomId);
    serverSocket.on("leaveRoom", (room) => {
      expect(room).toBe(roomId);
      done();
    });
  });

  /**
   * Test for sending drawing data.
   *
   * @param {Function} done - Callback to indicate the test is complete.
   */
  test("should send drawing data", (done) => {
    const boardId = "myBoard";
    const drawingData = [{ x: 0, y: 0 }];
    clientSocket.emit("drawing", boardId, drawingData);
    serverSocket.on("drawing", (board, data) => {
      expect(board).toBe(boardId);
      expect(data).toEqual(drawingData);
      done();
    });
  });

  /**
   * Test for sending undo command.
   *
   * @param {Function} done - Callback to indicate the test is complete.
   */
  test("should send undo command", (done) => {
    const boardId = "myBoard";
    const undoData = [{ x: 0, y: 0 }];
    clientSocket.emit("undo", boardId, undoData);
    serverSocket.on("undo", (board, data) => {
      expect(board).toBe(boardId);
      expect(data).toEqual(undoData);
      done();
    });
  });

  /**
   * Test for sending redo command.
   *
   * @param {Function} done - Callback to indicate the test is complete.
   */
  test("should send redo command", (done) => {
    const boardId = "myBoard";
    const redoData = [{ x: 0, y: 0 }];
    clientSocket.emit("redo", boardId, redoData);
    serverSocket.on("redo", (board, data) => {
      expect(board).toBe(boardId);
      expect(data).toEqual(redoData);
      done();
    });
  });
});
