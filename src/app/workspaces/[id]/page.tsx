"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const WorkspaceDetailPage = () => {
  const { id } = useParams(); // Get dynamic route parameter
  const [workspace, setWorkspace] = useState(null);
  const [boards, setBoards] = useState<any[]>([]);
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [boardName, setBoardName] = useState("");

  console.log("id: ", id);

  const createBoard = async () => {
    if (!boardName.trim()) return alert("Board name cannot be empty.");
    try {
      const response = await fetch(`/api/boards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: boardName, workspaceId: id }),
      });
      if (response.ok) {
        const newBoard = await response.json();
        setBoards((prev) => [...prev, newBoard]); // Add new board to state
        setBoardName(""); // Clear input
        setShowBoardModal(false); // Close modal
      } else {
        alert("Failed to create board.");
      }
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };
  console.log("Boards: ", boards);
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch(`/api/boards?id=${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        console.log("Response: ", response);
        if (response.ok) {
          const data = await response.json();
          setBoards(data);
        } else {
          console.error("Failed to fetch boards.");
        }
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };
    const fetchWorkspace = async () => {
      try {
        const response = await fetch(`/api/workspaces/${id}`);
        if (response.ok) {
          const data = await response.json();
          setWorkspace(data);
        } else {
          console.error("Failed to fetch workspace details.");
        }
      } catch (error) {
        console.error("Error fetching workspace:", error);
      }
    };

    fetchWorkspace();
    fetchBoards();
  }, []);

  if (!workspace) {
    return <div>Loading workspace...</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-6">{workspace.name}</h1>
      <p className="text-gray-700">Workspace ID: {workspace.id}</p>
      <p className="text-gray-700">
        Created At: {new Date(workspace.createdAt).toLocaleString()}
      </p>
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Boards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <div
              key={board.id}
              className="bg-gray-100 p-4 rounded shadow cursor-pointer"
            >
              <h3 className="text-xl font-semibold">{board.name}</h3>
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowBoardModal(true)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create New Board
        </button>
      </div>

      {/* Board Creation Modal */}
      {showBoardModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Board</h2>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="Enter board name"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowBoardModal(false)}
                className="py-2 px-4 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={createBoard}
                className="py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceDetailPage;
