"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { WorkspaceHeader } from "../../../components/workspace/WorkspaceHeader";
import { BoardsContainer } from "../../../components/workspace/BoardsContainer";
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
        <BoardsContainer
          boards={boards}
          editingBoard={editingBoard}
          openMenuId={openMenuId}
          editingCard={editingCard}
          setShowCardModal={setShowCardModal}
          showCardModal={showCardModal}
          toggleBoardMenu={toggleBoardMenu}
          updateBoard={updateBoard}
          setEditingBoard={setEditingBoard}
          deleteBoard={deleteBoard}
          setEditingCard={setEditingCard}
          deleteCard={deleteCard}
          updateCard={updateCard}
          setShowAIModal={setShowAIModal}
        />
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
