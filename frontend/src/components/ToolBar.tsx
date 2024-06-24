"use client";
import BackSvg from "@/assets/svg/back.svg";
import ForwardSvg from "@/assets/svg/forward.svg";
import PenSvg from "@/assets/svg/pen.svg";
import TextSvg from "@/assets/svg/text.svg";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  RESET_BOARD,
  SET_ACTIVE_TOOL,
  SET_COLOR,
  SET_HISTORY,
  SET_LOCAL_HISTORY,
  SET_REDO_HISTORY,
} from "@/lib/reducers/boardSlice";
import { LOGOUT } from "@/lib/reducers/userSlice";
import { TOOL } from "@/utils/constant";
import socket from "@/utils/socket";
import React from "react";

/**
 * Renders the ToolBar component which displays buttons for undo, redo, pen, text, color picker, and logout.
 *
 * @param {string} boardId - The ID of the board.
 * @return {JSX.Element} The rendered ToolBar component.
 */
const ToolBar = ({ boardId }: { boardId: string }): JSX.Element => {
  const { activeTool, history, localHistory, redoHistory } = useAppSelector(
    (state) => state.board
  );
  const dispatch = useAppDispatch();

  /**
   * Handles the click event for a tool button.
   *
   * @param {string} tool - The tool to set as active.
   * @return {void}
   */
  const handleClick = (tool: string): void => {
    dispatch(SET_ACTIVE_TOOL(tool));
  };

  /**
   * Handles the undo operation.
   *
   * If there is an item in the local history, it updates the history by marking the last item as "undo" and emits a "undo" event to the socket.
   *
   * @return {void}
   */
  const handleUndo = (): void => {
    if (localHistory.length > 0) {
      const id = localHistory[localHistory.length - 1];
      const updatedHistory = history.map((item) =>
        item.id === id ? { ...item, undo: true } : item
      );
      dispatch(SET_HISTORY(updatedHistory));
      dispatch(SET_LOCAL_HISTORY(localHistory.slice(0, -1)));
      dispatch(SET_REDO_HISTORY([...redoHistory, id]));

      socket.emit("undo", boardId, updatedHistory);
    }
  };

  /**
   * Handles the redo operation.
   *
   * If there is an item in the redo history, it updates the history by marking the last item as "undo" and emits a "redo" event to the socket.
   *
   * @return {void}
   */
  const handleRedo = (): void => {
    if (redoHistory.length > 0) {
      const id = redoHistory[redoHistory.length - 1];
      const updatedHistory = history.map((item) =>
        item.id === id ? { ...item, undo: false } : item
      );
      dispatch(SET_HISTORY(updatedHistory));
      dispatch(SET_REDO_HISTORY(redoHistory.slice(0, -1)));
      dispatch(SET_LOCAL_HISTORY([...localHistory, id]));

      socket.emit("redo", boardId, updatedHistory);
    }
  };

  /**
   * Logs out the user and resets the board.
   *
   * This function dispatches the LOGOUT action to log out the user and then dispatches the RESET_BOARD action to reset the board.
   *
   * @return {void} This function does not return anything.
   */
  const handleLogout = (): void => {
    dispatch(LOGOUT());
    dispatch(RESET_BOARD());
  };

  const disabledUndo = localHistory.length === 0;
  const disabledRedo = redoHistory.length === 0;

  return (
    <div className="flex space-x-2 m-3">
      <button
        title="undo"
        className={`h-8 w-8 flex items-center justify-center p-1.5 rounded-md bg-cyan-100 ${
          disabledUndo ? "cursor-not-allowed bg-gray-200" : "hover:bg-cyan-300"
        }`}
        onClick={handleUndo}
        disabled={disabledUndo}
      >
        <BackSvg className="stroke-cyan-500" />
      </button>
      <button
        title="redo"
        className={`h-8 w-8 flex items-center justify-center p-1.5 rounded-md bg-cyan-100 ${
          disabledRedo ? "cursor-not-allowed bg-gray-200" : "hover:bg-cyan-300"
        }`}
        onClick={handleRedo}
        disabled={disabledRedo}
      >
        <ForwardSvg className="stroke-cyan-500" />
      </button>
      <button
        title={TOOL.PEN}
        className={`h-8 w-8 flex items-center justify-center p-1.5 rounded-md hover:bg-cyan-300 ${
          activeTool === TOOL.PEN ? "bg-cyan-500" : "bg-cyan-100"
        }`}
        onClick={() => handleClick(TOOL.PEN)}
      >
        <PenSvg
          className={
            activeTool === TOOL.PEN ? "stroke-white" : "stroke-cyan-500"
          }
        />
      </button>
      <button
        title={TOOL.TEXT}
        className={`h-8 w-8 flex items-center justify-center p-1.5 rounded-md hover:bg-cyan-300 ${
          activeTool === TOOL.TEXT ? "bg-cyan-500" : "bg-cyan-100"
        }`}
        onClick={() => handleClick(TOOL.TEXT)}
      >
        <TextSvg
          className={
            activeTool === TOOL.TEXT ? "stroke-white" : "stroke-cyan-500"
          }
        />
      </button>
      <input
        type="color"
        onChange={(e) => dispatch(SET_COLOR(e.target.value))}
      />

      <div className="w-full" />

      <button
        className="h-8 flex items-center justify-center p-1.5 rounded-md bg-cyan-100 hover:bg-cyan-300"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default ToolBar;
