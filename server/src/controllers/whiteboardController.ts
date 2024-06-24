import { Request, Response } from "express";
import Whiteboard, { IWhiteboard } from "../models/Whiteboard";

/**
 * ## Function to retrieve all whiteboards.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} JSON response with the status and data of retrieved whiteboards.
 */
export const getAllBoards = async (req: Request, res: Response) => {
  try {
    const whiteboards = await Whiteboard.find();
    return res.json({ status: true, data: whiteboards });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
};

/**
 * ## Retrieves a board by its ID.
 *
 * @param {Request} req - The request object containing the board ID in the parameters.
 * @param {Response} res - The response object used to send the JSON response.
 * @return {Promise<void>} A JSON response with the status and data of the retrieved board, or an error response if the board is not found or an error occurs.
 */
export const getBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const board = await Whiteboard.findById(id);
    if (board) {
      return res.json({ status: true, data: board });
    } else {
      return res
        .status(404)
        .json({ status: false, message: "Board not found" });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
};

/**
 * ## Creates a new whiteboard with the provided data.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A JSON response with the status and data of the newly created whiteboard.
 */
export const createBoard = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const newBoard = new Whiteboard({ data });
    await newBoard.save();
    return res.json({ status: true, data: newBoard });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
};

/**
 * ## Updates a whiteboard with the given ID by setting its data to the provided data.
 *
 * @param {Request} req - The request object containing the board ID and updated data in the parameters and body, respectively.
 * @param {Response} res - The response object used to send the JSON response.
 * @return {Promise<void>} A JSON response with the status and data of the updated board, or an error response if the board is not found or an error occurs.
 */
export const updateBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const board = await Whiteboard.findByIdAndUpdate(
      id,
      { data },
      { new: true }
    );
    if (board) {
      return res.json({ status: true, data: board });
    } else {
      return res
        .status(404)
        .json({ status: false, message: "Board not found" });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
};

/**
 * ## Updates the data of a whiteboard using socket communication.
 *
 * @param {string} id - The ID of the whiteboard.
 * @param {IWhiteboard["data"]} data - The new data to be set for the whiteboard.
 * @return {Promise<{ status: boolean, data: any }>} A Promise containing the status and updated board data.
 */
export const updateBoardDataBySocket = async (
  id: string,
  data: IWhiteboard["data"]
) => {
  try {
    const board = await Whiteboard.findByIdAndUpdate(
      id,
      { data },
      { new: true }
    );
    if (board) {
      return { status: true, data: board };
    } else {
      return { status: false, data: null };
    }
  } catch (error: any) {
    console.log(error);
    return { status: false, data: null };
  }
};
