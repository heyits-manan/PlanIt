import React, { useState } from "react";
import { PlusIcon } from "lucide-react";
import { useBoardStore } from "@/store/useBoardStore";

const NewBoardInput: React.FC = () => {
  const [boardName, setBoardName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { addBoard } = useBoardStore();

  const handleAddBoard = () => {
    const trimmedName = boardName.trim();
    if (trimmedName) {
      addBoard(trimmedName);
      setBoardName("");
      setIsAdding(false);
    }
  };

  return (
    <div>
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium 
          bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-all"
        >
          <PlusIcon size={18} className="mr-2" />
          Add Board
        </button>
      ) : (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            placeholder="Enter board name"
            className="px-3 py-2 border border-blue-300 rounded-lg focus:outline-none 
            focus:ring-2 focus:ring-blue-500 transition-all"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddBoard();
              if (e.key === "Escape") setIsAdding(false);
            }}
          />
          <button
            onClick={handleAddBoard}
            disabled={!boardName.trim()}
            className="bg-blue-500 text-white px-3 py-2 rounded-lg 
            hover:bg-blue-600 disabled:bg-blue-300 transition-all"
          >
            Add
          </button>
          <button
            onClick={() => setIsAdding(false)}
            className="text-gray-500 hover:text-gray-700 
            bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-all"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default NewBoardInput;
