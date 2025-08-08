"use client";

import { Loader2, Settings, Star } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import FinancialDashboard from "@/components/financial/FinancialDashboard";
import { AddContributorModal } from "@/components/workspace/AddContributorModal";
import BoardsView from "@/components/workspace/BoardsView";
import { AIBoardGeneratorModal } from "../../../components/workspace/AIBoardGeneratorModal";
import { BoardModal } from "../../../components/workspace/BoardModal";
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
  const [isLoading, setIsLoading] = useState(true);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showContributorModal, setShowContributorModal] = useState(false);
  const [activeView, setActiveView] = useState("boards");
  // const [contributors, setContributors] = useState([]);

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

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch(`/api/workspaces/${id}/contributors`);
        if (response.ok) {
          const contributorResponse = await response.json();
          // setContributors(contributorResponse);
          console.log("Contributors fetched:", contributorResponse);
          // Update state to display contributors
        } else {
          console.error("Failed to fetch contributors");
        }
      } catch (error) {
        console.error("Error fetching contributors:", error);
      }
    };

    fetchContributors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setShowContributorModal(true)}
              >
                Add Contributors
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
              onClick={() => setActiveView("financial")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeView === "financial"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Financial
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

      {/* Main content with horizontal scrolling */}
      <div className="container mx-auto px-4 py-6">
        {activeView === "boards" && (
          <BoardsView
            boards={boards}
            onUpdateBoards={setBoards}
            onShowBoardModal={() => setShowBoardModal(true)}
            onShowCardModal={(boardId) =>
              setShowCardModal({
                ...showCardModal,
                [boardId]: true,
              })
            }
            onShowAIModal={() => setShowAIModal(true)}
          />
        )}

        {/* Financial Tab */}
        {activeView === "financial" && (
          <div className="pt-2">
            <FinancialDashboard workspaceId={id as string} />
          </div>
        )}

        {/* Calendar Tab */}
        {activeView === "calendar" && (
          <div className="pt-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Calendar View
              </h3>
              <p className="text-gray-500">
                Calendar functionality coming soon...
              </p>
            </div>
          </div>
        )}

        {/* Timeline Tab */}
        {activeView === "timeline" && (
          <div className="pt-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Timeline View
              </h3>
              <p className="text-gray-500">
                Timeline functionality coming soon...
              </p>
            </div>
          </div>
        )}

        {/* Files Tab */}
        {activeView === "files" && (
          <div className="pt-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Files View
              </h3>
              <p className="text-gray-500">
                File management functionality coming soon...
              </p>
            </div>
          </div>
        )}
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

      <AddContributorModal
        isOpen={showContributorModal}
        onClose={() => setShowContributorModal(false)}
        workspaceId={parseInt(id as string)}
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
