import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

/**
 * ## Generates a JWT token for the given user ID.
 *
 * @param {string} id - The ID of the user for whom the token is generated
 * @return {string} The JWT token with the user ID and expiration time
 */
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });
};

/**
 * ## Registers a new user.
 *
 * @param {Request} req - The request object containing the user's username and password.
 * @param {Response} res - The response object used to send the response back to the client.
 * @return {Promise<void>} - A promise that resolves when the user is successfully registered.
 */
export const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const userExists = await User.findOne({ username });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = new User({ username, password });

  await user.save();

  if (user) {
    return res.status(201).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id as string),
    });
  } else {
    return res.status(400).json({ message: "Invalid user data" });
  }
};

/**
 * ## Authenticates a user based on the provided username and password.
 *
 * @param {Request} req - The request object containing the user's username and password.
 * @param {Response} res - The response object used to send the response back to the client.
 * @return {Promise<void>} - A promise that resolves with user data if authentication is successful, or an error response if not.
 */
export const authUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    return res.json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id as string),
    });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
};
