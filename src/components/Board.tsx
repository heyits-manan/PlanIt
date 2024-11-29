import React from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import NewCardInput from "@/components/NewCardInput"; // Correct import
import Card from "@/components/Card";
import { TrashIcon } from "lucide-react";
import { useBoardStore } from "@/store/useBoardStore";

interface BoardProps {
  board: {
    id: string;
    name: string;
    cards: { id: string; title: string }[];
  };
  index: number;
}

const Board: React.FC<BoardProps> = ({ board, index }) => {
  const { deleteBoard } = useBoardStore();

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
              onClick={() => deleteBoard(board.id)}
              className="text-red-500 hover:bg-red-100 p-1 rounded"
            >
              <TrashIcon size={16} />
            </button>
          </div>

          {/* Fixed reference to NewCardInput */}
          <NewCardInput boardId={board.id} />

          <Droppable droppableId={board.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="min-h-[300px]"
              >
                {board.cards.map((card, index) => (
                  <Card
                    key={card.id}
                    card={card}
                    index={index}
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
