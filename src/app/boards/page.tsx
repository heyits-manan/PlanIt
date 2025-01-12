"use client";

import React from "react";

const BoardsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Boards</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Board cards will go here */}
        </div>
      </div>
    </div>
  );
};

export default BoardsPage;
