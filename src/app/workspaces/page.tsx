"use client";

import React, { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  Home,
  Settings,
  PlusCircle,
  Search,
  Loader2,
  FolderOpen,
} from "lucide-react";

const WorkspacePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingWorkspace, setEditingWorkspace] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  interface Workspace {
    id: string;
    name: string;
  }

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const { user } = useUser();

  const filteredWorkspaces = workspaces.filter((workspace) =>
    workspace.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createWorkspace = async () => {
    if (!workspaceName.trim()) return alert("Workspace name cannot be empty.");

    try {
      setIsLoading(true);
      const response = await fetch("api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: workspaceName, ownerId: user?.id }),
      });

      if (response.ok) {
        const newWorkspace = await response.json();
        setWorkspaces((prev) => [...prev, newWorkspace]);
        setWorkspaceName("");
        setShowModal(false);
      } else {
        alert("Failed to create workspace. Please try again.");
      }
    } catch (error) {
      console.error("Error creating workspace:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateWorkspace = async () => {
    if (!editingWorkspace || !newWorkspaceName.trim()) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/workspaces/${editingWorkspace.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newWorkspaceName }),
      });

      if (response.ok) {
        setWorkspaces((prev) =>
          prev.map((ws) =>
            ws.id === editingWorkspace.id
              ? { ...ws, name: newWorkspaceName }
              : ws
          )
        );
        setEditingWorkspace(null);
      } else {
        alert("Failed to update workspace. Please try again.");
      }
    } catch (error) {
      console.error("Error updating workspace:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("api/workspaces");
        if (response.ok) {
          const data = await response.json();
          setWorkspaces(data);
        } else {
          alert("Failed to fetch workspaces. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error);
        alert("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6 flex flex-col justify-between">
        <div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Workspace Hub</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your projects</p>
          </div>

          <nav className="space-y-6">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-4">
                Main Menu
              </p>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/workspaces"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-800 text-white"
                  >
                    <Home className="w-5 h-5" />
                    <span>Workspaces</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            <span>New Workspace</span>
          </button>

          <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-800">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10",
                  userButtonOuter: "flex items-center space-x-2",
                },
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.fullName}</p>
              <p className="text-xs text-gray-400 truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">My Workspaces</h1>
            <p className="mt-2 text-gray-600">
              Manage and organize your projects in one place
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search workspaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            />
          </div>

          {/* Workspaces Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : filteredWorkspaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkspaces.map((workspace) => (
                <Link
                  href={`/workspaces/${workspace.id}`}
                  key={workspace.id}
                  className="group relative bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {workspace.name}
                      </h2>
                      <p className="mt-2 text-sm text-gray-500">
                        Created {new Date().toLocaleDateString()}
                      </p>
                    </div>

                    <FolderOpen className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No workspaces found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? "No workspaces match your search criteria"
                  : "Get started by creating your first workspace"}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create Workspace</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {editingWorkspace && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Edit Workspace Name
            </h2>
            <input
              type="text"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-200 mb-6 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            />

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setEditingWorkspace(null)}
                className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateWorkspace}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Update</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Create New Workspace
            </h2>
            <p className="text-gray-500 mb-6">
              Enter a name for your new workspace to get started.
            </p>

            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="Enter workspace name"
              className="w-full p-3 rounded-lg border border-gray-200 mb-6 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            />

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createWorkspace}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Create Workspace</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspacePage;
