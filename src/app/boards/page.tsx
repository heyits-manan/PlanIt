"use client";
import BoardList from "@/components/BoardList";
import React from "react";

export default function BoardMain() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 selection:bg-blue-100">
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <h2 className="text-4xl font-extrabold text-center text-white tracking-tight">
              Task Management Board
            </h2>
            <p className="text-center text-blue-100 mt-2 max-w-2xl mx-auto">
              Organize, prioritize, and track your tasks with ease
            </p>
          </div>

          <div className="p-6">
            <BoardList />
          </div>
        </div>
      </main>
    </div>
  );
}
