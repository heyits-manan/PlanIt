import React, { useState } from "react";
import { useBoardStore } from "@/store/useBoardStore";

const NewBoardInput: React.FC = () => {
  const [boardName, setBoardName] = useState("");
  const { addBoard } = useBoardStore();

  const handleAddBoard = () => {
    if (!boardName.trim()) return;
    addBoard(boardName);
    setBoardName("");
  };

  return (
    <div className="flex mb-4">
      <input
        type="text"
        value={boardName}
        onChange={(e) => setBoardName(e.target.value)}
        placeholder="New board name"
        className="border p-2 mr-2 flex-grow"
        onKeyDown={(e) => e.key === "Enter" && handleAddBoard()}
      />
      <button
        onClick={handleAddBoard}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Add Board
      </button>
    </div>
  );
};

export default NewBoardInput;
