import { Layout, Calendar, Plus, Pencil, Trash2 } from "lucide-react";
import { Workspace } from "../../types";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "./Modal";

interface WorkspaceHeaderProps {
  workspace: Workspace | null;
  onNewBoard: () => void;
}

export const WorkspaceHeader = ({
  workspace,
  onNewBoard,
}: WorkspaceHeaderProps) => {
  const [workspaceName, setWorkspaceName] = useState(workspace?.name);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const router = useRouter();
  const { id } = useParams();

  const updateModal = () => {
    setShowUpdateModal(true);
  };

  const updateWorkspace = async () => {
    try {
      const response = await fetch(`/api/workspaces/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: workspaceName }),
      });

      if (!response.ok) {
        throw new Error("Failed to update workspace");
      }

      const updatedWorkspace = await response.json();
      setWorkspaceName(updatedWorkspace.name);
      setShowUpdateModal(false);
    } catch (error) {
      console.error("Failed to update workspace", error);
    }
  };

  const deleteWorkspace = async () => {
    try {
      const response = await fetch(`/api/workspaces/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete workspace");
      }

      if (!confirm("Are you sure you want to delete this workspace?")) return;

      router.push("/workspaces"); // Redirect to another page after deletion
    } catch (error) {
      console.error("Failed to delete workspace", error);
    }
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {workspaceName || workspace?.name}
              </h1>
              <div className="flex items-center mt-2 text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <Layout className="w-4 h-4 mr-1" />
                  <span>Workspace ID: {workspace?.id}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    Created{" "}
                    {workspace &&
                      new Date(workspace.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={updateModal}
                className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={deleteWorkspace}
                className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={onNewBoard}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Board
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        title="Update Workspace"
        description="Update the name of your workspace."
      >
        <div>
          <input
            type="text"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="Enter workspace name"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowUpdateModal(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={updateWorkspace}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Workspace
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
