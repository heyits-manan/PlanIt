"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Layout,
  Calendar,
  MoreVertical,
  Check,
  X,
} from "lucide-react";

interface Card {
  id: number;
  title: string;
  description: string;
  boardId: number;
  position: number;
  createdAt: string;
}

interface Board {
  id: number;
  name: string;
  workspaceId: number;
  position: number;
  createdAt: string;
  cards?: Card[];
}

interface Workspace {
  id: number;
  name: string;
  ownerId: string;
  createdAt: string;
}

const WorkspaceDetailPage: React.FC = () => {
  const { id } = useParams();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [showCardModal, setShowCardModal] = useState<{
    [key: number]: boolean;
  }>({});
  const [newCard, setNewCard] = useState({ title: "", description: "" });
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const fetchCards = async (boardId: number): Promise<Card[]> => {
    try {
      const response = await fetch(`/api/cards?boardId=${boardId}`);
      if (response.ok) {
        const cards: Card[] = await response.json();
        return cards;
      }
      return [];
    } catch (error) {
      console.error("Error fetching cards:", error);
      return [];
    }
  };

  const createCard = async (boardId: number) => {
    if (!newCard.title.trim()) return alert("Card title cannot be empty.");

    try {
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newCard,
          boardId,
        }),
      });

      if (response.ok) {
        const createdCard: Card = await response.json();
        setBoards((prevBoards) =>
          prevBoards.map((board) =>
            board.id === boardId
              ? { ...board, cards: [...(board.cards || []), createdCard] }
              : board
          )
        );
        setNewCard({ title: "", description: "" });
        setShowCardModal({ ...showCardModal, [boardId]: false });
      }
    } catch (error) {
      console.error("Error creating card:", error);
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
        const updatedCard: Card = await response.json();
        setBoards((prevBoards) =>
          prevBoards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  cards: board.cards?.map((card) =>
                    card.id === cardId ? updatedCard : card
                  ),
                }
              : board
          )
        );
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
        setBoards((prevBoards) =>
          prevBoards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  cards: board.cards?.filter((card) => card.id !== cardId),
                }
              : board
          )
        );
      }
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const createBoard = async () => {
    if (!boardName.trim()) return alert("Board name cannot be empty.");
    try {
      const response = await fetch(`/api/boards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: boardName,
          workspaceId: parseInt(id as string),
        }),
      });
      if (response.ok) {
        const newBoard: Board = await response.json();
        setBoards((prev) => [...prev, { ...newBoard, cards: [] }]);
        setBoardName("");
        setShowBoardModal(false);
      } else {
        alert("Failed to create board.");
      }
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  const updateBoard = async (boardId: number) => {
    if (!editingBoard?.name.trim()) return alert("Board name cannot be empty.");

    try {
      const response = await fetch(`/api/boards`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingBoard),
      });

      if (response.ok) {
        const updatedBoard: Board = await response.json();
        setBoards((prevBoards) =>
          prevBoards.map((board) =>
            board.id === boardId ? { ...board, ...updatedBoard } : board
          )
        );
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
        setBoards((prevBoards) =>
          prevBoards.filter((board) => board.id !== boardId)
        );
      }
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !(event.target as Element).closest(".board-menu")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const toggleBoardMenu = (boardId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenMenuId(openMenuId === boardId ? null : boardId);
  };

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      setIsLoading(true);
      try {
        const workspaceResponse = await fetch(`/api/workspaces/${id}`);
        if (workspaceResponse.ok) {
          const workspaceData: Workspace = await workspaceResponse.json();
          setWorkspace(workspaceData);
        }

        const boardsResponse = await fetch(`/api/boards?id=${id}`);
        if (boardsResponse.ok) {
          const boardsData: Board[] = await boardsResponse.json();
          const boardsWithCards = await Promise.all(
            boardsData.map(async (board) => {
              const cards = await fetchCards(board.id);
              return { ...board, cards };
            })
          );
          setBoards(boardsWithCards);
        }
      } catch (error) {
        console.error("Error fetching workspace data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaceData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading workspace...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {workspace?.name}
              </h1>
              <div className="flex items-center mt-2 text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <Layout className="w-4 h-4 mr-1" />
                  <span>Workspace ID: {workspace?.id}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    Created{" "}
                    {workspace &&
                      new Date(workspace.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowBoardModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Board
            </button>
          </div>
        </div>
      </div>

      {/* Boards Container */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="overflow-x-auto">
            <div className="flex gap-6 pb-4">
              {boards.map((board) => (
                <div
                  key={board.id}
                  className="flex-shrink-0 w-80 bg-gray-100 rounded-xl overflow-hidden"
                >
                  {/* Board Header */}
                  <div className="p-4 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      {editingBoard?.id === board.id ? (
                        <div className="flex-1 flex items-center space-x-2">
                          <input
                            type="text"
                            value={editingBoard.name}
                            onChange={(e) =>
                              setEditingBoard({
                                ...editingBoard,
                                name: e.target.value,
                              })
                            }
                            className="flex-1 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                          <button
                            onClick={() => updateBoard(board.id)}
                            className="p-1 rounded-md hover:bg-green-100 text-green-600"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setEditingBoard(null)}
                            className="p-1 rounded-md hover:bg-red-100 text-red-600"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <h3 className="font-semibold text-gray-900">
                          {board.name}
                        </h3>
                      )}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() =>
                            setShowCardModal({
                              ...showCardModal,
                              [board.id]: true,
                            })
                          }
                          className="p-1 rounded-md hover:bg-gray-100 text-gray-600 hover:text-blue-600"
                          title="Add new card"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                        <div className="relative board-menu">
                          <button
                            onClick={(e) => toggleBoardMenu(board.id, e)}
                            className="p-1 rounded-md hover:bg-gray-100 text-gray-600"
                            title="More options"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {/* Dropdown Menu */}
                          {openMenuId === board.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                              <button
                                onClick={() => {
                                  setEditingBoard(board);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                              >
                                <Pencil className="w-4 h-4" />
                                <span>Edit Board</span>
                              </button>
                              <button
                                onClick={() => {
                                  deleteBoard(board.id);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete Board</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cards Container */}
                  <div className="p-4 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {board.cards && board.cards.length > 0 ? (
                      board.cards.map((card) => (
                        <div
                          key={card.id}
                          className="group bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-all"
                        >
                          {editingCard?.id === card.id ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={editingCard.title}
                                onChange={(e) =>
                                  setEditingCard({
                                    ...editingCard,
                                    title: e.target.value,
                                  })
                                }
                                className="w-full px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                              />
                              <textarea
                                value={editingCard.description}
                                onChange={(e) =>
                                  setEditingCard({
                                    ...editingCard,
                                    description: e.target.value,
                                  })
                                }
                                className="w-full px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                                rows={3}
                              />
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => setEditingCard(null)}
                                  className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => updateCard(card.id, board.id)}
                                  className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium text-gray-900">
                                  {card.title}
                                </h4>
                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => setEditingCard(card)}
                                    className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteCard(card.id, board.id)
                                    }
                                    className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              {card.description && (
                                <p className="mt-2 text-sm text-gray-600">
                                  {card.description}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">No cards yet</p>
                        <button
                          onClick={() =>
                            setShowCardModal({
                              ...showCardModal,
                              [board.id]: true,
                            })
                          }
                          className="mt-2 text-blue-600 text-sm hover:text-blue-700"
                        >
                          Add a card
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Board Modal */}
      {showBoardModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Create New Board
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Add a new board to organize your tasks and ideas.
            </p>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="Enter board name"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowBoardModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createBoard}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Board
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Card Modal */}
      {Object.entries(showCardModal).map(([boardId, isVisible]) =>
        isVisible ? (
          <div
            key={boardId}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Create New Card
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Add details about your new task or idea.
              </p>
              <input
                type="text"
                value={newCard.title}
                onChange={(e) =>
                  setNewCard({ ...newCard, title: e.target.value })
                }
                placeholder="Card title"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
              />
              <textarea
                value={newCard.description}
                onChange={(e) =>
                  setNewCard({ ...newCard, description: e.target.value })
                }
                placeholder="Add a more detailed description..."
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4 resize-none"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() =>
                    setShowCardModal({
                      ...showCardModal,
                      [parseInt(boardId)]: false,
                    })
                  }
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => createCard(parseInt(boardId))}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Card
                </button>
              </div>
            </div>
          </div>
        ) : null
      )}
    </div>
  );
};

export default WorkspaceDetailPage;
