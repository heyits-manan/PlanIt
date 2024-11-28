"use client";
import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useBoardStore } from "../store/useBoardStore";
import Board from "./Board";

const BoardList: React.FC = () => {
  const boards = useBoardStore((state) => state.boards);
  const reorderBoards = useBoardStore((state) => state.reorderBoards);
  const moveCard = useBoardStore((state) => state.moveCard);

  const onDragEnd = (result: any) => {
    const { source, destination, type } = result;

    // Dropped outside of any droppable
    if (!destination) return;

    // No movement
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (type === "BOARD") {
      reorderBoards(source.index, destination.index);
    }

    if (type === "CARD") {
      moveCard(
        source.droppableId,
        destination.droppableId,
        source.index,
        destination.index
      );
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="boardList" direction="horizontal" type="BOARD">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex gap-4 p-4 min-h-screen overflow-x-auto text-black"
          >
            {boards.map((board, index) => (
              <Draggable key={board.id} draggableId={board.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="h-[200px]"
                  >
                    <Board id={board.id} name={board.name} index={index} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default BoardList;
