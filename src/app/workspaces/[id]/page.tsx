"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Loader2,
  Plus,
  Settings,
  Star,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";

import { BoardModal } from "../../../components/workspace/BoardModal";
import { AIBoardGeneratorModal } from "../../../components/workspace/AIBoardGeneratorModal";
import { CardModal } from "../../../components/workspace/CardModal";
import {
  Board as BoardType,
  Card as CardType,
  Workspace,
} from "../../../types";

const WorkspaceDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [showCardModal, setShowCardModal] = useState<{
    [key: number]: boolean;
  }>({});
  const [newCard, setNewCard] = useState({ title: "", description: "" });
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [editingBoard, setEditingBoard] = useState<BoardType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [activeView, setActiveView] = useState("boards");

  // Logic functions remain unchanged
  const fetchCards = async (boardId: number): Promise<CardType[]> => {
    try {
      const response = await fetch(`/api/cards?boardId=${boardId}`);
      if (response.ok) {
        return await response.json();
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
        const createdCard: CardType = await response.json();
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
        const updatedCard: CardType = await response.json();
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
        const newBoard: BoardType = await response.json();
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
        const updatedBoard: BoardType = await response.json();
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

  const toggleBoardMenu = (boardId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenMenuId(openMenuId === boardId ? null : boardId);
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

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      setIsLoading(true);
      try {
        const workspaceResponse = await fetch(`/api/workspaces/${id}`);
        if (workspaceResponse.ok) {
          const workspaceData: Workspace = await workspaceResponse.json();
          setWorkspace(workspaceData);
        } else {
          console.error("Error fetching workspace data:", workspaceResponse);
          router.push("/workspaces");
        }

        const boardsResponse = await fetch(`/api/boards?id=${id}`);
        if (boardsResponse.ok) {
          const boardsData: BoardType[] = await boardsResponse.json();
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
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="relative">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <div className="absolute top-0 left-0 w-full h-full bg-blue-100 rounded-full opacity-30 animate-ping"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading workspace...</p>
          <p className="text-gray-400 text-sm mt-2">
            Preparing your boards and cards
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Custom Header instead of WorkspaceHeader component */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                {workspace?.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 flex items-center">
                  {workspace?.name}
                  <button className="ml-2 text-gray-400 hover:text-yellow-500">
                    <Star size={16} />
                  </button>
                </h1>
                <p className="text-sm text-gray-500">
                  {boards.length} boards • Last updated{" "}
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAIModal(true)}
                className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg font-medium text-sm hover:bg-indigo-200 transition-colors flex items-center"
              >
                <Sparkles className="mr-2" size={16} />
                AI Generate
              </button>
              <button
                onClick={() => setShowBoardModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="mr-2" size={16} />
                New Board
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="flex items-center space-x-1 mt-4">
            <button
              onClick={() => setActiveView("boards")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeView === "boards"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Boards
            </button>
            <button
              onClick={() => setActiveView("calendar")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeView === "calendar"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setActiveView("timeline")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeView === "timeline"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveView("files")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeView === "files"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Files
            </button>
          </div>
        </div>
      </header>

      {/* Main content with enhanced styling */}
      <div className="container mx-auto px-4 py-6">
        {/* Enhanced BoardsContainer implementation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boards.map((board) => (
            <div
              key={board.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
            >
              {/* Board header */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
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
                    board.name
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

              {/* Cards container */}
              <div className="p-4">
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
                            <div className="mt-2 pt-2 border-t border-gray-200 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
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
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-400 border border-dashed border-gray-200 rounded-lg">
                    <p>No cards yet</p>
                  </div>
                )}
              </div>

              {/* Add card button */}
              <div className="px-4 py-3 border-t border-gray-100">
                <button
                  onClick={() =>
                    setShowCardModal({ ...showCardModal, [board.id]: true })
                  }
                  className="w-full py-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Plus size={16} className="mr-1" />
                  Add Card
                </button>
              </div>
            </div>
          ))}

          {/* Add board button */}
          <div
            onClick={() => setShowBoardModal(true)}
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer min-h-[200px]"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Plus size={24} />
            </div>
            <p className="font-medium">Add New Board</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BoardModal
        isOpen={showBoardModal}
        onClose={() => setShowBoardModal(false)}
        boardName={boardName}
        setBoardName={setBoardName}
        onCreateBoard={createBoard}
      />

      <AIBoardGeneratorModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        workspaceId={parseInt(id as string)}
        onBoardsCreated={(newBoards) => {
          setBoards((prev) => [...prev, ...newBoards]);
        }}
      />

      {/* Create Card Modal */}
      {Object.entries(showCardModal).map(([boardId, isVisible]) => (
        <CardModal
          key={boardId}
          isOpen={isVisible}
          onClose={() =>
            setShowCardModal({ ...showCardModal, [parseInt(boardId)]: false })
          }
          cardData={newCard}
          setCardData={setNewCard}
          onSubmit={() => createCard(parseInt(boardId))}
          isEditing={false}
        />
      ))}
    </div>
  );
};

export default WorkspaceDetailPage;
