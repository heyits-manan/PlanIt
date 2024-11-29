import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { useBoardStore } from "@/store/useBoardStore";

const BoardList = () => {
  const {
    boards,
    addBoard,
    deleteBoard,
    addCard,
    deleteCard,
    reorderBoards,
    moveCard,
  } = useBoardStore();

  const [newBoardName, setNewBoardName] = useState("");
  const [newCardTexts, setNewCardTexts] = useState({});

  const onDragEnd = (result) => {
    const { source, destination, type } = result;

    if (type === "COLUMN") {
      if (!destination) return;
      reorderBoards(source.index, destination.index);
      return;
    }

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    moveCard(
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index
    );
  };

  const handleAddBoard = () => {
    if (!newBoardName.trim()) return;
    addBoard(newBoardName);
    setNewBoardName("");
  };

  const handleAddCard = (boardId) => {
    const cardText = newCardTexts[boardId] || "";
    if (!cardText.trim()) return;

    addCard(boardId, cardText);
    setNewCardTexts((prev) => ({
      ...prev,
      [boardId]: "",
    }));
  };

  return (
    <div className="p-4">
      <div className="flex mb-4">
        <input
          type="text"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          placeholder="New board name"
          className="border p-2 mr-2 flex-grow"
          onKeyDown={(e) => e.key === "Enter" && handleAddBoard()}
        />
        <button
          onClick={handleAddBoard}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Board
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex space-x-4 overflow-x-auto"
            >
              {boards.map((board, index) => (
                <Draggable key={board.id} draggableId={board.id} index={index}>
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

                      {/* New Card Input */}
                      <div className="flex mb-4">
                        <input
                          type="text"
                          value={newCardTexts[board.id] || ""}
                          onChange={(e) =>
                            setNewCardTexts((prev) => ({
                              ...prev,
                              [board.id]: e.target.value,
                            }))
                          }
                          placeholder="New card"
                          className="border p-2 mr-2 flex-grow"
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleAddCard(board.id)
                          }
                        />
                        <button
                          onClick={() => handleAddCard(board.id)}
                          className="bg-green-500 text-white p-2 rounded"
                        >
                          <PlusIcon size={16} />
                        </button>
                      </div>

                      <Droppable droppableId={board.id}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="min-h-[300px]"
                          >
                            {board.cards.map((card, index) => (
                              <Draggable
                                key={card.id}
                                draggableId={card.id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="bg-white p-4 mb-2 rounded shadow flex justify-between items-center group"
                                  >
                                    <div
                                      {...provided.dragHandleProps}
                                      className="flex-grow"
                                    >
                                      {card.title}
                                    </div>
                                    <button
                                      onClick={() =>
                                        deleteCard(board.id, card.id)
                                      }
                                      className="text-red-500 hover:bg-red-100 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <XIcon size={16} />
                                    </button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
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
