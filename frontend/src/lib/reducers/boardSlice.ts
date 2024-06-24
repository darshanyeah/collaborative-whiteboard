import { TOOL } from "@/utils/constant";
import { Board } from "@/utils/interfaces";
import { createSlice } from "@reduxjs/toolkit";

const initialState: Board = {
  activeTool: TOOL.PEN,
  color: "#000000",

  history: [],
  localHistory: [],
  redoHistory: [],
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    SET_ACTIVE_TOOL: (state, action) => {
      state.activeTool = action.payload;
    },
    SET_COLOR: (state, action) => {
      state.color = action.payload;
    },

    SET_HISTORY: (state, action) => {
      state.history = action.payload;
    },

    SET_LOCAL_HISTORY: (state, action) => {
      state.localHistory = action.payload;
    },

    SET_REDO_HISTORY: (state, action) => {
      state.redoHistory = action.payload;
    },

    RESET_BOARD: (state) => {
      state.activeTool = initialState.activeTool;
      state.color = initialState.color;

      state.history = initialState.history;
      state.localHistory = initialState.localHistory;
      state.redoHistory = initialState.redoHistory;
    },
  },
});

export const {
  SET_ACTIVE_TOOL,
  SET_COLOR,
  SET_HISTORY,
  SET_LOCAL_HISTORY,
  SET_REDO_HISTORY,
  RESET_BOARD,
} = boardSlice.actions;
export default boardSlice.reducer;
