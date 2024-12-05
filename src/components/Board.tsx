import React, { useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import NewCardInput from "@/components/NewCardInput";
import Card from "@/components/Card";
import { TrashIcon } from "lucide-react";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";

interface BoardProps {
  board: {
    id: string;
    name: string;
    cards: { id: string; title: string }[];
  };
  index: number;
  workspaceId: string;
}

const Board: React.FC<BoardProps> = ({ board, index, workspaceId }) => {
  const { deleteBoard } = useWorkspaceStore();

  const handleDeleteBoard = () => {
    deleteBoard(workspaceId, board.id);
  };

  return (
    <Draggable draggableId={board.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="w-64 bg-gray-100 rounded-lg p-4 relative"
        >
          <div
            {...provided.dragHandleProps}
            className="flex justify-between items-center mb-4"
          >
            <div className="text-lg font-bold">{board.name}</div>
            <button
              onClick={handleDeleteBoard}
              className="text-red-500 hover:bg-red-100 p-1 rounded"
            >
              <TrashIcon size={16} />
            </button>
          </div>
          <NewCardInput workspaceId={workspaceId} boardId={board.id} />{" "}
          {/* Update this line */}
          <Droppable droppableId={board.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="min-h-[300px]"
              >
                {board.cards.map((card, cardIndex) => (
                  <Card
                    key={card.id}
                    card={card}
                    index={cardIndex}
                    workspaceId={workspaceId}
                    boardId={board.id}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Board;
