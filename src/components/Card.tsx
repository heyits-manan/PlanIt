"use client";
import React from "react";

interface CardProps {
  id: string;
  title: string;
  onDelete: (cardId: string) => void;
}

const Card: React.FC<CardProps> = ({ id, title, onDelete }) => {
  return (
    <div className="p-3 bg-white text-gray-800 rounded-md shadow-sm border border-gray-200 flex justify-between items-center hover:shadow-md transition-shadow">
      <p className="truncate">{title}</p>
      <button
        onClick={() => onDelete(id)}
        className="text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </div>
  );
};

export default Card;
