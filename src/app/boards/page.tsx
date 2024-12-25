"use client";
import React, { useState, useEffect } from "react";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import WorkspaceModal from "@/components/WorkspaceModal";
import BoardList from "@/components/BoardList";
import { Spinner } from "@/components/Spinner";

export default function WorkspacesMain() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { workspaces, fetchWorkspaces } = useWorkspaceStore();
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  useEffect(() => {
    if (workspaces.length > 0 && !selectedWorkspaceId) {
      setSelectedWorkspaceId(workspaces[0]._id);
    }
  }, [workspaces, selectedWorkspaceId]);

  const selectedWorkspace = workspaces.find(
    (workspace) => workspace._id === selectedWorkspaceId
  );

  const handleWorkspaceChange = (workspaceId: string) => {
    setIsLoading(true);
    setSelectedWorkspaceId(workspaceId);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 selection:bg-blue-100">
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-extrabold text-white tracking-tight">
                  Workspaces
                </h2>
                <p className="text-blue-100 mt-2">
                  Organize your projects and tasks across multiple workspaces
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                title="Create New Workspace"
              >
                Create New Workspace
              </button>
            </div>
          </div>

          {/* Workspace Selection */}
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex space-x-2 overflow-x-auto">
              {workspaces.map((workspace) => (
                <button
                  key={workspace._id}
                  onClick={() => handleWorkspaceChange(workspace._id)}
                  className={`p-2 rounded-full transition-colors ${
                    selectedWorkspaceId === workspace._id
                      ? "bg-blue-500 text-white"
                      : "bg-white text-black"
                  }`}
                  title={workspace.name}
                >
                  {workspace.name}
                </button>
              ))}
            </div>
          </div>

          {/* Boards for Selected Workspace */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center">
                <Spinner />
              </div>
            ) : selectedWorkspace ? (
              <BoardList workspaceId={selectedWorkspace._id} />
            ) : (
              <p className="text-gray-500 text-center">
                No workspaces found. Create a workspace to get started.
              </p>
            )}
          </div>
        </div>
      </main>
      {isModalOpen && <WorkspaceModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
