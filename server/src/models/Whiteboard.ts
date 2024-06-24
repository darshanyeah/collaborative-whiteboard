import mongoose, { Document, Schema } from "mongoose";

export interface IDrawing extends Document {
  tool: string;
  points: number[];
  text?: string;
  color?: string;
  undo?: boolean;
}
export interface IWhiteboard extends Document {
  data: IDrawing[];
}

/**
 * ## Whiteboard schema for MongoDB.
 * @interface IWhiteboard - Interface for User
 * @property {Array<IDrawing>} data - The array of drawings on the whiteboard.
 */
const whiteboardSchema: Schema = new mongoose.Schema(
  {
    data: {
      type: Array<IDrawing>,
    },
  },
  {
    timestamps: true,
  }
);

const Whiteboard = mongoose.model<IWhiteboard>("Whiteboard", whiteboardSchema);

export default Whiteboard;
