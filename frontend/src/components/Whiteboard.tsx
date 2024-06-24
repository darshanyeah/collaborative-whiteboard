"use client";
import React, { useRef, useEffect, useMemo, useCallback } from "react";
import { Stage, Layer, Line, Text } from "react-konva";
import { v4 as uuidv4 } from "uuid";
import socket from "@/utils/socket";
import ToolBar from "./ToolBar";
import { DrawEvent } from "@/utils/interfaces";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  RESET_BOARD,
  SET_HISTORY,
  SET_LOCAL_HISTORY,
  SET_REDO_HISTORY,
} from "@/lib/reducers/boardSlice";
import { TOOL } from "@/utils/constant";
import axios from "axios";

interface WhiteboardProps {
  id: string;
}

/**
 * Whiteboard component responsible for rendering the whiteboard functionality.
 *
 * @param {WhiteboardProps} props - Props containing the board ID.
 * @return {JSX.Element} Rendered whiteboard component.
 */
const Whiteboard: React.FC<WhiteboardProps> = (
  props: WhiteboardProps
): JSX.Element => {
  const boardId = props.id;
  const currentShapeRef = useRef<string>();

  const { activeTool, color, history, localHistory, redoHistory } =
    useAppSelector((state) => state.board);
  const dispatch = useAppDispatch();

  const isDrawing = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const board = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/whiteboard/${boardId}`
        );
        dispatch(SET_HISTORY(board.data.data.data));
      } catch (error) {
        console.error("Error fetching whiteboard:", error);
      }
    })();
  }, [boardId, dispatch]);

  const handleBeforeUnload = useCallback(() => {
    if (boardId) {
      dispatch(RESET_BOARD());
      socket.emit("leaveRoom", boardId);
    }
  }, [boardId, dispatch]);

  useEffect(() => {
    socket.emit("joinRoom", boardId);

    return () => handleBeforeUnload();
  }, [boardId, handleBeforeUnload]);

  useEffect(() => {
    socket.on("drawing", (data: DrawEvent[]) => {
      dispatch(SET_HISTORY(data)); // it need to be optimized like have to update only the line which is changed instead of all
    });

    socket.on("undo", (data: DrawEvent[]) => {
      dispatch(SET_HISTORY(data));
    });

    socket.on("redo", (data: DrawEvent[]) => {
      dispatch(SET_HISTORY(data));
    });

    return () => {
      socket.off("drawing");
      socket.off("undo");
      socket.off("redo");
    };
  }, [dispatch]);

  /**
   * Handles the mouse down event on the canvas.
   *
   * @param {any} e - The mouse down event object.
   * @return {void} This function does not return anything.
   */
  const handleMouseDown = (e: any): void => {
    if (activeTool === TOOL.TEXT) return;

    isDrawing.current = true;

    const pos = e.target.getStage().getPointerPosition();
    const id = uuidv4();
    currentShapeRef.current = id;

    const updatedLines = [
      ...history,
      { id, tool: activeTool, color, points: [pos.x, pos.y] },
    ];
    dispatch(SET_HISTORY(updatedLines));
    if (!localHistory.includes(id)) {
      dispatch(SET_LOCAL_HISTORY([...localHistory, id]));
    }
    dispatch(SET_REDO_HISTORY([]));
  };

  /**
   * Handles the click event on the canvas for text tool.
   *
   * @param {any} e - The click event object.
   * @return {void} This function does not return anything.
   */
  const handleTextClick = (e: any): void => {
    if (activeTool !== TOOL.TEXT) return;

    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const id = uuidv4();

    const updatedTexts = [
      ...history,
      { id, tool: activeTool, color, points: [pos.x, pos.y], text: "New Text" },
    ];
    dispatch(SET_HISTORY(updatedTexts));
    if (!localHistory.includes(id)) {
      dispatch(SET_LOCAL_HISTORY([...localHistory, id]));
    }
    dispatch(SET_REDO_HISTORY([]));
    socket.emit("drawing", boardId, updatedTexts);
  };

  /**
   * Updates the text content of a text element in the history array and emits a "drawing" event to the server.
   *
   * @param {string} id - The ID of the text element to update.
   * @param {string} newText - The new text content for the text element.
   * @return {void} This function does not return anything.
   */
  const handleTextChange = (id: string, newText: string): void => {
    const updatedTexts = history.map((text) =>
      text.id === id ? { ...text, text: newText } : text
    );
    dispatch(SET_HISTORY(updatedTexts));
    if (!localHistory.includes(id)) {
      dispatch(SET_LOCAL_HISTORY([...localHistory, id]));
    }
    dispatch(SET_REDO_HISTORY([]));
    socket.emit("drawing", boardId, updatedTexts);
  };

  /**
   * Handles the mouse move event on the canvas and updates the drawing based on the movement.
   *
   * @param {any} e - The mouse move event object.
   * @return {void} This function does not return anything.
   */
  const handleMouseMove = (e: any): void => {
    if (!isDrawing.current) return;
    if (!currentShapeRef.current) return;
    if (activeTool === TOOL.TEXT) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const id = currentShapeRef.current;
    if (!id) return;
    const prevLines = [...history];
    const updatedLines = prevLines.map((line) =>
      line.id === id
        ? { ...line, points: [...line.points, point.x, point.y] }
        : line
    );
    dispatch(SET_HISTORY(updatedLines));
    if (!localHistory.includes(id)) {
      dispatch(SET_LOCAL_HISTORY([...localHistory, id]));
    }
    dispatch(SET_REDO_HISTORY([]));
    socket.emit("drawing", boardId, updatedLines);
  };

  /**
   * Handles the mouse up event and performs necessary actions.
   *
   * This function sets the currentShapeRef to undefined, sets isDrawing to false,
   * and emits a "drawing" event to the socket if the activeTool is not TOOL.TEXT.
   *
   * @return {void} This function does not return anything.
   */
  const handleMouseUp = (): void => {
    currentShapeRef.current = undefined;
    isDrawing.current = false;
    if (activeTool === TOOL.TEXT) return;
    socket.emit("drawing", boardId, history);
  };

  return (
    <div className="w-full h-full col-span-7">
      <ToolBar boardId={boardId} />
      <Stage
        width={window.innerWidth - 128}
        height={500}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onDblClick={handleTextClick}
        className="w-full border border-black rounded-md"
      >
        <Layer>
          {history
            ?.filter((element) => !element.undo)
            ?.map((element) => {
              const tool = element.tool;
              switch (tool) {
                case TOOL.PEN:
                  return (
                    <Line
                      key={element.id}
                      points={element.points}
                      stroke={element?.color ?? "#df4b26"}
                      strokeWidth={2}
                      tension={0.5}
                      lineCap="round"
                      globalCompositeOperation={
                        element.tool === "eraser"
                          ? "destination-out"
                          : "source-over"
                      }
                    />
                  );

                case TOOL.TEXT:
                  return (
                    <Text
                      key={element.id}
                      x={element.points[0]}
                      y={element.points[1]}
                      text={element.text}
                      fill={element?.color ?? "#df4b26"}
                      fontSize={20}
                      onClick={() => {
                        const newText = prompt("Enter new text:", element.text);
                        if (newText !== null) {
                          handleTextChange(element.id, newText);
                        }
                      }}
                    />
                  );

                default:
                  return null;
              }
            })}
        </Layer>
      </Stage>
    </div>
  );
};

export default Whiteboard;
