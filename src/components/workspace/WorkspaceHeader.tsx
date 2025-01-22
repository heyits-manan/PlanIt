import { Layout, Calendar, Plus } from "lucide-react";
import { Workspace } from "../../types";

interface WorkspaceHeaderProps {
  workspace: Workspace | null;
  onNewBoard: () => void;
}

export const WorkspaceHeader = ({
  workspace,
  onNewBoard,
}: WorkspaceHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {workspace?.name}
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
  );
};
