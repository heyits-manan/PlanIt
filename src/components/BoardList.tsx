import React from "react";
import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import { useBoardStore } from "@/store/useBoardStore";
import NewBoardInput from "@/components/NewBoardInput";
import Board from "@/components/Board";

const BoardList: React.FC = () => {
  const { boards, reorderBoards, moveCard } = useBoardStore();

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === "COLUMN") {
      reorderBoards(source.index, destination.index);
    } else {
      moveCard(
        source.droppableId,
        destination.droppableId,
        source.index,
        destination.index
      );
    }
  };

  return (
    <div className="p-4">
      <NewBoardInput />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="boards" type="COLUMN" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex space-x-4 overflow-x-auto"
            >
              {boards.map((board, index) => (
                <Board key={board.id} board={board} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default BoardList;
