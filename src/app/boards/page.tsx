import AddBoard from "@/components/AddBoard";
import BoardList from "@/components/BoardList";
import React from "react";

export default function Board() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Manage Your Boards
        </h2>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Create a New Board
          </h3>
          <AddBoard />
        </div>

        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Your Boards
          </h3>
          <BoardList />
        </section>
      </main>
    </div>
  );
}
