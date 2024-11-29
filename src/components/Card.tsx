import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { XIcon } from "lucide-react";
import { useBoardStore } from "@/store/useBoardStore";

interface CardProps {
  card: { id: string; title: string };
  index: number;
  boardId: string;
}

const Card: React.FC<CardProps> = ({ card, index, boardId }) => {
  const { deleteCard } = useBoardStore();

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="bg-white p-4 mb-2 rounded shadow flex justify-between items-center group"
        >
          <div {...provided.dragHandleProps} className="flex-grow">
            {card.title}
          </div>
          <button
            onClick={() => deleteCard(boardId, card.id)}
            className="text-red-500 hover:bg-red-100 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <XIcon size={16} />
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default Card;
