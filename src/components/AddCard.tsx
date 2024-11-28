"use client";
import React, { useState } from "react";
import { useBoardStore } from "../store/useBoardStore";

interface AddCardProps {
  boardId: string;
}

const AddCard: React.FC<AddCardProps> = ({ boardId }) => {
  const [title, setTitle] = useState("");
  const addCard = useBoardStore((state) => state.addCard);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title) {
      addCard(boardId, title);
      setTitle("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New Card"
        className="p-2 h-14 border border-gray-300 text-black rounded-md"
      />
      <button
        type="submit"
        className="bg-green-500 text-white p-1 h-14 rounded-md"
      >
        Add Card
      </button>
    </form>
  );
};

export default AddCard;
