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
          className="p-4 bg-gray-200 rounded-md shadow-md m-2 w-[300px]"
        >
          <button
            className="mt-4 text-red-500 hover:text-red-700"
            onClick={() => confirmDelete(board.id)}
          >
            Delete Board
          </button>
          <h3 {...provided.dragHandleProps} className="text-lg font-bold mb-2">
            {name}
          </h3>
          <Droppable droppableId={id} type="CARD">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-100 p-2 rounded-md"
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
          <AddCard boardId={id} />
        </div>
      )}
    </Draggable>
  );
};

export default Board;
