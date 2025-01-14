"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";

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
        body: JSON.stringify({ name: boardName, workspaceId: parseInt(id) }),
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
    const fetchWorkspaceData = async () => {
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
      }
    };

    fetchWorkspaceData();
  }, [id]);

  if (!workspace) {
    return <div>Loading workspace...</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-6">{workspace?.name}</h1>
      <p className="text-gray-700">Workspace ID: {workspace?.id}</p>
      <p className="text-gray-700">
        Created At:{" "}
        {workspace && new Date(workspace.createdAt).toLocaleString()}
      </p>

      <div className="mt-6 h-[calc(100vh-200px)]">
        {" "}
        {/* Fixed height container */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Boards</h2>
          <button
            onClick={() => setShowBoardModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create New Board
          </button>
        </div>
        {/* Scrollable container for boards */}
        <div className="h-full overflow-x-auto overflow-y-hidden">
          <div className="flex flex-row gap-8 pb-4 h-full">
            {boards.map((board) => (
              <div
                key={board.id}
                className="flex-shrink-0 bg-white p-4 w-80 rounded-xl shadow-lg border border-gray-200 h-full overflow-y-auto hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2 border-b">
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
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  ) : (
                    <h3 className="text-lg font-semibold text-gray-800">
                      {board.name}
                    </h3>
                  )}
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        setShowCardModal({ ...showCardModal, [board.id]: true })
                      }
                      className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-500 transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    {editingBoard?.id === board.id ? (
                      <>
                        <button
                          onClick={() => updateBoard(board.id)}
                          className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-blue-500 transition-colors duration-200"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingBoard(null)}
                          className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-red-500 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingBoard(board)}
                          className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-blue-500 transition-colors duration-200"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteBoard(board.id)}
                          className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-red-500 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  {board.cards && board.cards.length > 0 ? (
                    board.cards.map((card) => (
                      <div
                        key={card.id}
                        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
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
                              className="w-full p-1 border rounded"
                            />
                            <textarea
                              value={editingCard.description}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  description: e.target.value,
                                })
                              }
                              className="w-full p-1 border rounded text-sm"
                            />
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setEditingCard(null)}
                                className="px-2 py-1 text-sm bg-gray-200 rounded"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => updateCard(card.id, board.id)}
                                className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start group">
                              <h4 className="font-medium text-gray-800">
                                {card.title}
                              </h4>
                              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                  onClick={() => setEditingCard(card)}
                                  className="text-gray-400 hover:text-blue-500"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteCard(card.id, board.id)}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            {card.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {card.description}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No cards available.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showBoardModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Board</h2>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="Enter board name"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowBoardModal(false)}
                className="py-2 px-4 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={createBoard}
                className="py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      {Object.keys(showCardModal).map(
        (boardId) =>
          showCardModal[parseInt(boardId)] && (
            <div
              key={boardId}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            >
              <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Create New Card</h2>
                <input
                  type="text"
                  value={newCard.title}
                  onChange={(e) =>
                    setNewCard({ ...newCard, title: e.target.value })
                  }
                  placeholder="Enter card title"
                  className="w-full p-2 border rounded mb-4"
                />
                <textarea
                  value={newCard.description}
                  onChange={(e) =>
                    setNewCard({ ...newCard, description: e.target.value })
                  }
                  placeholder="Enter card description"
                  className="w-full p-2 border rounded mb-4"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() =>
                      setShowCardModal({
                        ...showCardModal,
                        [parseInt(boardId)]: false,
                      })
                    }
                    className="py-2 px-4 rounded bg-gray-300 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => createCard(parseInt(boardId))}
                    className="py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default WorkspaceDetailPage;
