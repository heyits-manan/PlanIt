"use client";
import BoardList from "@/components/Board";
import React from "react";

export default function Board() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Manage Your Boards
        </h2>
        <BoardList />
      </main>
    </div>
  );
}
