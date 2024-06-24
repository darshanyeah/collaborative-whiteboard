import { Router } from "express";
import {
  getAllBoards,
  getBoard,
  createBoard,
  updateBoard,
} from "../controllers/whiteboardController";

const router = Router();

/**
 * ## Get all whiteboards.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} JSON response with the status and data of
 * retrieved whiteboards.
 */
router.get("/", getAllBoards);

/**
 * ## Get a whiteboard by ID.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} JSON response with the status and data of
 * retrieved whiteboard.
 */
router.get("/:id", getBoard);

/**
 * ## Create a new whiteboard.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} JSON response with the status and data of
 * the created whiteboard.
 */
router.post("/", createBoard);

/**
 * ## Update a whiteboard by ID.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} JSON response with the status and data of
 * the updated whiteboard.
 */
router.put("/:id", updateBoard);

export default router;
