"use client";

import React, { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

import { Home, Settings, PlusCircle, Pencil, Trash2 } from "lucide-react";

const WorkspacePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaces, setWorkspaces] = useState<{ id: string; name: string }[]>(
    []
  );
  const [editingWorkspace, setEditingWorkspace] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const { user } = useUser();

  console.log(workspaces);
  const createWorkspace = async () => {
    if (!workspaceName.trim()) return alert("Workspace name cannot be empty.");

    try {
      const response = await fetch("api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: workspaceName, ownerId: user?.id }),
      });

      if (response.ok) {
        const newWorkspace = await response.json();
        console.log("New Workspace: ", newWorkspace);
        setWorkspaces((prev) => [...prev, newWorkspace]); // Add new workspace to state
        setWorkspaceName(""); // Reset input
        setShowModal(false); // Close modal
      } else {
        alert("Failed to create workspace. Please try again.");
      }
    } catch (error) {
      console.error("Error creating workspace:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const updateWorkspace = async () => {
    if (!editingWorkspace?.name.trim())
      return alert("Workspace name cannot be empty.");

    try {
      const response = await fetch(`api/workspaces/${editingWorkspace.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editingWorkspace.name }),
      });

      if (response.ok) {
        const updatedWorkspace = await response.json();
        setWorkspaces((prev) =>
          prev.map((workspace) =>
            workspace.id === updatedWorkspace.id ? updatedWorkspace : workspace
          )
        );
        setEditingWorkspace(null); // Close modal
      } else {
        alert("Failed to update workspace. Please try again.");
      }
    } catch (error) {
      console.error("Error updating workspace:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const deleteWorkspace = async (id: string) => {
    if (!confirm("Are you sure you want to delete this workspace?")) return;

    try {
      const response = await fetch(`api/workspaces/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setWorkspaces((prev) =>
          prev.filter((workspace) => workspace.id !== id)
        );
      } else {
        alert("Failed to delete workspace. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting workspace:", error);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
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
      }
    };

    fetchWorkspaces();
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6">Menu</h2>
          <ul>
            <li className="mb-4 flex items-center space-x-2">
              <Home className="w-5 h-5" />
              <Link href="/workspaces" className="text-lg hover:underline">
                Workspaces
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <Link href="/settings" className="text-lg hover:underline">
                Settings
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <button
            onClick={() => setShowModal(true)}
            className="mt-8 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center space-x-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create New Workspace</span>
          </button>
          <div className="mt-6">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-14 h-14",
                  userButtonOuter: "flex items-center space-x-2",
                  userButtonTrigger: "flex items-center space-x-2",
                  userButtonPopoverCard: "bg-gray-800 text-white",
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
            My Workspaces
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workspaces.map((workspace, index) => (
              <div
                key={index}
                className="relative bg-white p-5 h-[200px] border-2 border-black rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <Link
                  href={`/workspaces/${workspace.id}`}
                  className="block h-full"
                >
                  <h2 className="text-2xl font-semibold text-black mb-4">
                    {workspace.name}
                  </h2>
                </Link>
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => setEditingWorkspace(workspace)}
                    className="text-gray-500 hover:text-blue-500"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteWorkspace(workspace.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Workspace Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Workspace</h2>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="Enter workspace name"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="py-2 px-4 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={createWorkspace}
                className="py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Workspace Modal */}
      {editingWorkspace && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Workspace</h2>
            <input
              type="text"
              value={editingWorkspace.name}
              onChange={(e) =>
                setEditingWorkspace({
                  ...editingWorkspace,
                  name: e.target.value,
                })
              }
              placeholder="Enter workspace name"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setEditingWorkspace(null)}
                className="py-2 px-4 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={updateWorkspace}
                className="py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspacePage;
