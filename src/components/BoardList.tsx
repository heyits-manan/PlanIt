import React from "react";
import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import NewBoardInput from "@/components/NewBoardInput";
import Board from "@/components/Board";

interface BoardListProps {
  workspaceId: string;
}

const BoardList: React.FC<BoardListProps> = ({ workspaceId }) => {
  const { workspaces, moveCard, reorderBoards } = useWorkspaceStore();
  const currentWorkspace = workspaces.find((w) => w.id === workspaceId);
  const boards = currentWorkspace?.boards || [];

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === "COLUMN") {
      reorderBoards(workspaceId, source.index, destination.index);
    } else {
      moveCard(
        workspaceId,
        workspaceId,
        source.droppableId,
        destination.droppableId,
        source.index,
        destination.index
      );
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-gray-800">
          {currentWorkspace?.name || "Workspace"} Boards
        </h3>
        <NewBoardInput workspaceId={workspaceId} />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="boards" type="COLUMN" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex space-x-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100"
            >
              {boards.map((board, index) => (
                <Board
                  key={board.id}
                  board={board}
                  index={index}
                  workspaceId={workspaceId}
                />
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
