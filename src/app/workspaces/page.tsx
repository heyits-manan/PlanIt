"use client";

import React, { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/router";

const WorkspacePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaces, setWorkspaces] = useState<{ name: string }[]>([]); // To dynamically update workspaces
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
  }, [workspaces]);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        <ul>
          <li className="mb-4">
            <Link href="/workspaces" className="text-lg hover:underline">
              Workspaces
            </Link>
          </li>
          <li>
            <Link href="/workspaces" className="text-lg hover:underline">
              Settings
            </Link>
          </li>

          <li className="absolute bottom-6 left-6">
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
          </li>
        </ul>
        <button
          onClick={() => setShowModal(true)}
          className="mt-8 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Create New Workspace
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
            My Workspaces
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workspaces.map((workspace, index) => (
              <Link
                href={`/workspaces/${workspace.id}`}
                key={index}
                className="bg-white p-5 h-[200px] border-2 border-black rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h2 className="text-2xl font-semibold text-black mb-4">
                  {workspace.name}
                </h2>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
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
    </div>
  );
};

export default WorkspacePage;
