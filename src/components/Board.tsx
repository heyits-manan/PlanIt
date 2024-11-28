"use client";
import React from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useBoardStore } from "../store/useBoardStore";
import AddCard from "./AddCard";
import Card from "./Card";

interface BoardProps {
  id: string;
  name: string;
  index: number;
}

const Board: React.FC<BoardProps> = ({ id, name, index }) => {
  const deleteCard = useBoardStore((state) => state.deleteCard);
  const boards = useBoardStore((state) => state.boards);
  const board = boards.find((b) => b.id === id);
  const deleteBoard = useBoardStore((state) => state.deleteBoard);

  const confirmDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this board?")) {
      deleteBoard(id);
    }
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="p-4 bg-white rounded-lg shadow-lg m-2  min-w-[350px] flex flex-col justify-between border border-gray-300"
        >
          <div className="flex justify-between items-center  mb-4">
            <h3
              {...provided.dragHandleProps}
              className="text-lg font-bold text-blue-600 truncate"
              title={name}
            >
              {name}
            </h3>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => confirmDelete(board!.id)}
            >
              Delete
            </button>
          </div>

          <Droppable droppableId={id} type="CARD">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col gap-2 bg-gray-100 rounded-lg p-2 overflow-y-auto max-h-[300px] "
              >
                {board?.cards.map((card, index) => (
                  <Draggable key={card.id} draggableId={card.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card
                          id={card.id}
                          title={card.title}
                          onDelete={(cardId) => deleteCard(id, cardId)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="mt-4">
            <AddCard boardId={id} />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Board;
