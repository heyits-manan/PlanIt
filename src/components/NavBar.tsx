"use client";

import Link from "next/link";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { Home, Plus, LogIn, LayoutDashboardIcon } from "lucide-react";

const Navbar: React.FC = () => {
  const { isSignedIn } = useUser();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm py-3">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link href="/" className="flex items-center space-x-2">
          <LayoutDashboardIcon className="text-blue-600" size={28} />
          <span className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
            PlanIt
          </span>
        </Link>

        <nav className="flex items-center space-x-6">
          <Link
            href="/boards"
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
          >
            <Home className="w-5 h-5 mr-2 text-gray-400 group-hover:text-blue-600" />
            Boards
          </Link>

          {isSignedIn && (
            <Link
              href="/boards/new"
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Board
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {isSignedIn ? (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 border-2 border-blue-500",
                  userButtonPopoverFooter: "hidden",
                },
              }}
            />
          ) : (
            <div className="flex items-center">
              <SignInButton mode="modal">
                <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </button>
              </SignInButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
