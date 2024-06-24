export interface DrawEvent {
  id: string;
  tool: string;
  points: number[];
  text?: string;
  color?: string;
  undo?: boolean;
}

export interface User {
  _id?: string;
  username?: string;
  token?: string;
}

export interface Board {
  activeTool: string;
  color: string;

  history: DrawEvent[];
  localHistory: string[];
  redoHistory: string[];
}
