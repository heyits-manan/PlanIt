import AddBoard from "@/components/AddBoard";
import BoardList from "@/components/BoardList";
import React from "react";

export default function Board() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-black">PlanIt</h1>
      <AddBoard />
      <BoardList />
    </div>
  );
}
