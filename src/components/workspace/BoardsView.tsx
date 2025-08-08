"use client";

import React, { useState, useEffect } from "react";
import { Plus, MoreHorizontal, Sparkles } from "lucide-react";
import { Board as BoardType, Card as CardType } from "../../types";

interface BoardsViewProps {
  boards: BoardType[];
  onUpdateBoards: (boards: BoardType[]) => void;
  onShowBoardModal: () => void;
  onShowCardModal: (boardId: number) => void;
  onShowAIModal: () => void;
}

const BoardsView: React.FC<BoardsViewProps> = ({
  boards,
  onUpdateBoards,
  onShowBoardModal,
  onShowCardModal,
  onShowAIModal,
}) => {
  const [editingBoard, setEditingBoard] = useState<BoardType | null>(null);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !(event.target as Element).closest(".board-menu")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const updateBoard = async (boardId: number) => {
    if (!editingBoard?.name.trim()) return alert("Board name cannot be empty.");

    try {
      const response = await fetch(`/api/boards`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingBoard),
      });

      if (response.ok) {
        const updatedBoard: BoardType = await response.json();
        const updatedBoards = boards.map((board) =>
          board.id === boardId ? { ...board, ...updatedBoard } : board
        );
        onUpdateBoards(updatedBoards);
        setEditingBoard(null);
      }
    } catch (error) {
      console.error("Error updating board:", error);
    }
  };

  const deleteBoard = async (boardId: number) => {
    if (!confirm("Are you sure you want to delete this board?")) return;

    try {
      const response = await fetch(`/api/boards?id=${boardId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedBoards = boards.filter((board) => board.id !== boardId);
        onUpdateBoards(updatedBoards);
      }
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

  const updateCard = async (cardId: number, boardId: number) => {
    if (!editingCard?.title.trim()) return alert("Card title cannot be empty.");

    try {
      const response = await fetch("/api/cards", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: cardId,
          title: editingCard.title,
          description: editingCard.description,
        }),
      });

      if (response.ok) {
        const updatedCard: CardType = await response.json();
        const updatedBoards = boards.map((board) =>
          board.id === boardId
            ? {
                ...board,
                cards: board.cards?.map((card) =>
                  card.id === cardId ? updatedCard : card
                ),
              }
            : board
        );
        onUpdateBoards(updatedBoards);
        setEditingCard(null);
      }
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  const deleteCard = async (cardId: number, boardId: number) => {
    if (!confirm("Are you sure you want to delete this card?")) return;

    try {
      const response = await fetch(`/api/cards?id=${cardId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedBoards = boards.map((board) =>
          board.id === boardId
            ? {
                ...board,
                cards: board.cards?.filter((card) => card.id !== cardId),
              }
            : board
        );
        onUpdateBoards(updatedBoards);
      }
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const toggleBoardMenu = (boardId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenMenuId(openMenuId === boardId ? null : boardId);
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Boards</h3>
          <p className="text-sm text-gray-600">
            Manage your project boards and tasks
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onShowAIModal}
            className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg font-medium text-sm hover:bg-indigo-200 transition-colors flex items-center"
          >
            <Sparkles className="mr-2" size={16} />
            AI Generate
          </button>
          <button
            onClick={onShowBoardModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="mr-2" size={16} />
            New Board
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-6 pt-2 -mx-2 px-2 snap-x">
        {boards.map((board) => {
          const cardsCount = board.cards?.length || 0;
          // Calculate width class (consistent width) with proper height based on card count
          const heightClass =
            cardsCount <= 2
              ? "h-auto min-h-[320px]"
              : cardsCount <= 4
              ? "h-auto min-h-[420px]"
              : "h-auto min-h-[520px]";

          return (
            <div
              key={board.id}
              className={`flex-shrink-0 w-80 mr-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden snap-start ${heightClass}`}
            >
              {/* Board header */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h3 className="font-medium text-gray-800 truncate">
                  {editingBoard?.id === board.id ? (
                    <input
                      type="text"
                      value={editingBoard.name}
                      onChange={(e) =>
                        setEditingBoard({
                          ...editingBoard,
                          name: e.target.value,
                        })
                      }
                      onBlur={() => updateBoard(board.id)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && updateBoard(board.id)
                      }
                      autoFocus
                      className="px-2 py-1 w-full border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="flex items-center">
                      <span>{board.name}</span>
                      <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                        {cardsCount}
                      </span>
                    </span>
                  )}
                </h3>

                <div className="relative">
                  <button
                    onClick={(e) => toggleBoardMenu(board.id, e)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {openMenuId === board.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10 board-menu">
                      <div className="py-1">
                        <button
                          onClick={() => setEditingBoard(board)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => deleteBoard(board.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cards container with flexible height */}
              <div className="p-4 flex-grow overflow-y-auto">
                {board.cards && board.cards.length > 0 ? (
                  <div className="space-y-3">
                    {board.cards.map((card) => (
                      <div
                        key={card.id}
                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100 group"
                      >
                        {editingCard?.id === card.id ? (
                          <div>
                            <input
                              type="text"
                              value={editingCard.title}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  title: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 mb-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            <textarea
                              value={editingCard.description || ""}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  description: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={3}
                            />
                            <div className="flex justify-end mt-2 space-x-2">
                              <button
                                onClick={() => setEditingCard(null)}
                                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700 bg-gray-200 hover:bg-gray-300 rounded"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => updateCard(card.id, board.id)}
                                className="px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h4 className="text-gray-800 font-medium mb-1">
                              {card.title}
                            </h4>
                            {card.description && (
                              <p className="text-gray-500 text-sm">
                                {card.description}
                              </p>
                            )}
                            <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex items-center space-x-1">
                                {Math.random() > 0.5 && (
                                  <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                                    J
                                  </div>
                                )}
                              </div>
                              <div>
                                <button
                                  onClick={() => setEditingCard(card)}
                                  className="text-xs text-gray-500 hover:text-blue-500 mr-3"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteCard(card.id, board.id)}
                                  className="text-xs text-gray-500 hover:text-red-500"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-400 border border-dashed border-gray-200 rounded-lg h-full min-h-[200px] flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <Plus size={20} className="text-gray-400" />
                    </div>
                    <p>No cards yet</p>
                    <p className="text-sm mt-1">Add a card to get started</p>
                  </div>
                )}
              </div>

              {/* Add card button - sticky to bottom */}
              <div className="px-4 py-3 border-t border-gray-100 bg-white sticky bottom-0">
                <button
                  onClick={() => onShowCardModal(board.id)}
                  className="w-full py-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Plus size={16} className="mr-1" />
                  Add Card
                </button>
              </div>
            </div>
          );
        })}

        {/* Add board button */}
        <div
          onClick={onShowBoardModal}
          className="flex-shrink-0 w-80 border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer min-h-[320px] snap-start"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <Plus size={24} />
          </div>
          <p className="font-medium">Add New Board</p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="mt-4 flex justify-center">
        <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200 flex items-center">
          <span>Scroll horizontally to view all boards</span>
          <svg
            className="w-4 h-4 ml-2 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </div>
      </div>
    </>
  );
};

export default BoardsView;
