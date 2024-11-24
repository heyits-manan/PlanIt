"use client";
import React from "react";
import BoardCard from "./BoardCard";
import { useBoardStore } from "../store/useBoardStore";

const BoardList: React.FC = () => {
  const boards = useBoardStore((state) => state.boards);
  const deleteBoard = useBoardStore((state) => state.deleteBoard);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {boards.map((board) => (
        <BoardCard
          key={board.id}
          id={board.id}
          name={board.name}
          onDelete={deleteBoard}
        />
      ))}
    </div>
  );
};

export default BoardList;
