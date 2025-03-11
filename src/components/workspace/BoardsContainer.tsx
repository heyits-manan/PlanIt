// components/workspace/BoardsContainer.tsx
import React from "react";
import { Board } from "./Board";
import { Board as BoardType, Card as CardType } from "../../types";

interface BoardsContainerProps {
  boards: BoardType[];
  editingBoard: BoardType | null;
  openMenuId: number | null;
  editingCard: CardType | null;
  showCardModal: { [key: number]: boolean };
  setShowCardModal: React.Dispatch<
    React.SetStateAction<{ [key: number]: boolean }>
  >;
  toggleBoardMenu: (boardId: number, event: React.MouseEvent) => void;
  updateBoard: (boardId: number) => Promise<void>;
  setEditingBoard: React.Dispatch<React.SetStateAction<BoardType | null>>;
  deleteBoard: (boardId: number) => Promise<void>;
  setEditingCard: React.Dispatch<React.SetStateAction<CardType | null>>;
  deleteCard: (cardId: number, boardId: number) => Promise<void>;
  updateCard: (cardId: number, boardId: number) => Promise<void>;
  setShowAIModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BoardsContainer: React.FC<BoardsContainerProps> = ({
  boards,
  editingBoard,
  openMenuId,
  editingCard,
  showCardModal,
  setShowCardModal,
  toggleBoardMenu,
  updateBoard,
  setEditingBoard,
  deleteBoard,
  setEditingCard,
  deleteCard,
  updateCard,
  setShowAIModal,
}) => {
  return (
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
  );
};
