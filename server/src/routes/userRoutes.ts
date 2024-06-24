import { Router } from "express";
import { registerUser, authUser } from "../controllers/userController";

const router = Router();

/**
 * ## Registers a new user.
 *
 * @param {Request} req - The request object containing the user's username and password.
 * @param {Response} res - The response object used to send the response back to the client.
 * @return {Promise<void>} - A promise that resolves when the user is successfully registered.
 */
router.post("/register", registerUser);

/**
 * ## Authenticates a user.
 *
 * @param {Request} req - The request object containing the user's username and password.
 * @param {Response} res - The response object used to send the response back to the client.
 * @return {Promise<void>} - A promise that resolves when the user is successfully authenticated.
 */
router.post("/login", authUser);

export default router;
