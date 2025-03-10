"use client";

import React, { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { WorkspaceHeader } from "../../../components/workspace/WorkspaceHeader";
import { Board } from "../../../components/workspace/Board";
import { Modal } from "../../../components/workspace/Modal";
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
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState("");

  const generateAIBoards = async () => {
    if (!prompt.trim()) {
      setAiError("Please enter a prompt");
      return;
    }

    setAiError("");
    setIsGenerating(true);

    try {
      const genAI = new GoogleGenerativeAI(
        process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Create a prompt that asks for structured JSON
      const formattedPrompt = `
        Create a kanban board structure based on the following request: "${prompt}"
        
        Respond ONLY with valid JSON in the following format:
        {
          "boards": [
            {
              "name": "Board Name",
              "cards": [
                {
                  "title": "Card Title",
                  "description": "Detailed description of the card"
                }
              ]
            }
          ]
        }
        
        Create as many boards and cards as told by the user. If the number is not specified, create as much as needed.
      `;

      const result = await model.generateContent(formattedPrompt);
      const responseText = result.response.text();

      // Extract the JSON from the response
      let jsonData;
      try {
        // First try to parse the entire response as JSON
        jsonData = JSON.parse(responseText);
      } catch (error) {
        // If that fails, try to extract JSON from the response text
        console.log("Error parsing JSON:", error);
        const jsonMatch =
          responseText.match(/```json\s*({[\s\S]*?})\s*```/) ||
          responseText.match(/{[\s\S]*?}/);

        if (jsonMatch && jsonMatch[1]) {
          jsonData = JSON.parse(jsonMatch[1]);
        } else {
          throw new Error("Could not parse JSON from response");
        }
      }

      // Create the boards and cards from the parsed JSON
      if (jsonData && jsonData.boards && Array.isArray(jsonData.boards)) {
        const workspaceId = parseInt(id as string);

        // Create each board with its cards
        for (const boardData of jsonData.boards) {
          const boardResponse = await fetch(`/api/boards`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: boardData.name,
              workspaceId,
            }),
          });

          if (boardResponse.ok) {
            const newBoard: BoardType = await boardResponse.json();
            const cards: CardType[] = [];

            // Create cards for this board
            if (boardData.cards && Array.isArray(boardData.cards)) {
              for (const cardData of boardData.cards) {
                const cardResponse = await fetch("/api/cards", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    title: cardData.title,
                    description: cardData.description || "",
                    boardId: newBoard.id,
                  }),
                });

                if (cardResponse.ok) {
                  const card: CardType = await cardResponse.json();
                  cards.push(card);
                }
              }
            }

            // Add the new board with its cards to the state
            setBoards((prev) => [...prev, { ...newBoard, cards }]);
          }
        }

        setShowAIModal(false);
        setPrompt("");
      } else {
        throw new Error("Invalid response format from AI");
      }
    } catch (error) {
      console.error("Error generating boards:", error);
      setAiError("Failed to generate boards. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchCards = async (boardId: number): Promise<CardType[]> => {
    try {
      const response = await fetch(`/api/cards?boardId=${boardId}`);
      if (response.ok) {
        const cards: CardType[] = await response.json();
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
      <WorkspaceHeader
        workspace={workspace}
        onNewBoard={() => setShowBoardModal(true)}
      />

      <div className="p-8">
        <div className="w-full mx-auto mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Boards</h2>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAIModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <span className="mr-2">AI Generate Boards</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm-2-9a2 2 0 114 0 2 2 0 01-4 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-6 pb-4">
              {boards.map((board) => (
                <Board
                  key={board.id}
                  board={board}
                  isEditing={editingBoard?.id === board.id}
                  editingBoard={editingBoard}
                  openMenuId={openMenuId}
                  onAddCard={() =>
                    setShowCardModal({ ...showCardModal, [board.id]: true })
                  }
                  onToggleMenu={toggleBoardMenu}
                  onUpdateBoard={updateBoard}
                  onCancelEdit={() => setEditingBoard(null)}
                  onDeleteBoard={deleteBoard}
                  onEditBoard={setEditingBoard}
                  setEditingBoard={setEditingBoard}
                  onEditCard={setEditingCard}
                  onDeleteCard={deleteCard}
                  onUpdateCard={updateCard}
                  editingCard={editingCard}
                  setEditingCard={setEditingCard}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Board Modal */}
      <Modal
        isOpen={showBoardModal}
        onClose={() => setShowBoardModal(false)}
        title="Create New Board"
        description="Add a new board to organize your tasks and ideas."
      >
        <div>
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
      </Modal>

      {/* AI Generate Boards Modal */}
      <Modal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        title="AI Generate Boards"
        description="Describe what kind of boards and cards you want to create, and our AI will generate them for you."
      >
        <div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Create a project management setup for a website redesign project with appropriate boards and tasks..."
            rows={6}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4 resize-none"
          />
          {aiError && <p className="text-red-500 mb-3">{aiError}</p>}
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowAIModal(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isGenerating}
            >
              Cancel
            </button>
            <button
              onClick={generateAIBoards}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                "Generate Boards"
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Create Card Modal */}
      {Object.entries(showCardModal).map(([boardId, isVisible]) => (
        <Modal
          key={boardId}
          isOpen={isVisible}
          onClose={() =>
            setShowCardModal({ ...showCardModal, [parseInt(boardId)]: false })
          }
          title="Create New Card"
          description="Add details about your new task or idea."
        >
          <div>
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
        </Modal>
      ))}
    </div>
  );
};

export default WorkspaceDetailPage;
