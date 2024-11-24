"use client";
import React from "react";

interface BoardCardProps {
  id: string;
  name: string;
  onDelete: (id: string) => void;
}

const BoardCard: React.FC<BoardCardProps> = ({ id, name, onDelete }) => {
  return (
    <div className="p-4 bg-blue-200 text-black rounded-md shadow-md m-2 flex justify-between items-center">
      <h3>{name}</h3>
      <button
        onClick={() => onDelete(id)}
        className="text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </div>
  );
};

export default BoardCard;
