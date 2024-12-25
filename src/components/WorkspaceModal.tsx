"use client";
import React, { useState } from "react";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { useUser } from "@clerk/nextjs"; // Import Clerk's useUser hook

interface WorkspaceModalProps {
  onClose: () => void;
}

const WorkspaceModal: React.FC<WorkspaceModalProps> = ({ onClose }) => {
  const [workspaceName, setWorkspaceName] = useState("");
  const { createWorkspace } = useWorkspaceStore();
  const { user } = useUser(); // Get the current user

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (workspaceName.trim() && user?.id) {
      const ownerId = user.id;

      const payload = {
        name: workspaceName.trim(),
        owner: ownerId, // Use Clerk's user ID
      };

      console.log("Request payload:", payload);

      try {
        const response = await fetch("/api/workspaces", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response from server:", errorData);
          throw new Error(errorData.message || "Failed to create workspace");
        }

        const data = await response.json();
        console.log("Workspace created successfully:", data);
        createWorkspace(data.workspace);
        onClose();
      } catch (error) {
        console.error("Error creating workspace:", error);
      }
    } else {
      console.error("Invalid workspace name or user ID");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-2xl font-bold mb-4">Create New Workspace</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="Enter workspace name"
            className="w-full p-2 border rounded mb-4"
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkspaceModal;
