"use client";
import React, { useState } from "react";
import { useBoardStore } from "../store/useBoardStore";

const AddBoard: React.FC = () => {
  const [boardName, setBoardName] = useState("");
  const addBoard = useBoardStore((state) => state.addBoard);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (boardName) {
      addBoard(boardName);
      setBoardName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <input
        type="text"
        value={boardName}
        onChange={(e) => setBoardName(e.target.value)}
        placeholder="New Board"
        className="p-2 border border-gray-300 text-black rounded-md"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
        Add Board
      </button>
    </form>
  );
};

export default AddBoard;
