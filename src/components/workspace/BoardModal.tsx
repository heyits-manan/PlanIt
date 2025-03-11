// components/workspace/BoardModal.tsx
import React from "react";
import { Modal } from "./Modal";

interface BoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardName: string;
  setBoardName: React.Dispatch<React.SetStateAction<string>>;
  onCreateBoard: () => Promise<void>;
}

export const BoardModal: React.FC<BoardModalProps> = ({
  isOpen,
  onClose,
  boardName,
  setBoardName,
  onCreateBoard,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onCreateBoard}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Board
          </button>
        </div>
      </div>
    </Modal>
  );
};
