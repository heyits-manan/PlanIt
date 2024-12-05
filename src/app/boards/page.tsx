"use client";
import React, { useState } from "react";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import WorkspaceModal from "@/components/WorkspaceModal";
import BoardList from "@/components/BoardList";
import { PlusIcon, HomeIcon } from "lucide-react";
import { Spinner } from "@/components/Spinner"; // Assume you have a Spinner component

export default function WorkspacesMain() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { workspaces } = useWorkspaceStore();
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    workspaces.length > 0 ? workspaces[0].id : null
  );
  const [isLoading, setIsLoading] = useState(false);

  const selectedWorkspace = workspaces.find(
    (workspace) => workspace.id === selectedWorkspaceId
  );

  const handleWorkspaceChange = (workspaceId: string) => {
    setIsLoading(true);
    setSelectedWorkspaceId(workspaceId);
    setTimeout(() => setIsLoading(false), 500); // Simulate loading time
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
                <PlusIcon size={24} />
              </button>
            </div>
          </div>

          {/* Workspace Selection */}
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex space-x-2 overflow-x-auto">
              {workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => handleWorkspaceChange(workspace.id)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                    selectedWorkspaceId === workspace.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <HomeIcon size={16} className="mr-2" />
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
              <BoardList workspaceId={selectedWorkspace.id} />
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
