import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { XIcon, EditIcon, CheckIcon } from "lucide-react";
import { useBoardStore } from "@/store/useBoardStore";

interface CardProps {
  card: { id: string; title: string };
  index: number;
  boardId: string;
}

const Card: React.FC<CardProps> = ({ card, index, boardId }) => {
  const { deleteCard, editCard } = useBoardStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);

  const handleEdit = () => {
    if (isEditing) {
      const trimmedTitle = editedTitle.trim();
      if (trimmedTitle) {
        editCard(boardId, card.id, trimmedTitle);
        setIsEditing(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(card.title);
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="bg-white p-4 mb-2 rounded shadow flex justify-between items-center group relative"
        >
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="flex-grow mr-2 p-1 border rounded outline-none focus:ring-2 focus:ring-blue-300"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEdit();
                if (e.key === "Escape") handleCancel();
              }}
            />
          ) : (
            <div {...provided.dragHandleProps} className="flex-grow">
              {card.title}
            </div>
          )}

          <div className="flex items-center space-x-1">
            {isEditing ? (
              <>
                <button
                  onClick={handleEdit}
                  className="text-green-500 hover:bg-green-100 p-1 rounded transition-all"
                  title="Save"
                >
                  <CheckIcon size={16} />
                </button>
                <button
                  onClick={handleCancel}
                  className="text-red-500 hover:bg-red-100 p-1 rounded transition-all"
                  title="Cancel"
                >
                  <XIcon size={16} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  className="text-blue-500 hover:bg-blue-100 p-1 rounded opacity-0 group-hover:opacity-100 transition-all"
                  title="Edit"
                >
                  <EditIcon size={16} />
                </button>
                <button
                  onClick={() => deleteCard(boardId, card.id)}
                  className="text-red-500 hover:bg-red-100 p-1 rounded opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete"
                >
                  <XIcon size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Card;
