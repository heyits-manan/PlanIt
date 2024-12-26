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
      const ownerId = user.id; // Use Clerk's user ID directly as a string
      console.log("Owner ID:", ownerId);
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
            "user-id": ownerId, // Pass user ID in headers
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
            placeholder="Workspace Name"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Workspace
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default WorkspaceModal;
