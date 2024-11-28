"use client";
import React from "react";

interface CardProps {
  id: string;
  title: string;
  onDelete: (cardId: string) => void;
}

const Card: React.FC<CardProps> = ({ id, title, onDelete }) => {
  return (
    <div className="p-3 bg-white text-black rounded-md shadow-md m-1">
      <div className="flex justify-between items-center">
        <p>{title}</p>
        <button
          onClick={() => onDelete(id)}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Card;
