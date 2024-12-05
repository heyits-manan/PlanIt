import React, { useState } from "react";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";

interface WorkspaceModalProps {
  onClose: () => void;
}

const WorkspaceModal: React.FC<WorkspaceModalProps> = ({ onClose }) => {
  const [workspaceName, setWorkspaceName] = useState("");
  const { createWorkspace } = useWorkspaceStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (workspaceName.trim()) {
      createWorkspace(workspaceName.trim());
      onClose();
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
