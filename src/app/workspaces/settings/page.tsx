"use client";

import React from "react";
import { Settings, Construction } from "lucide-react";
import Link from "next/link";

const ComingSoonPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Animated Icons */}
          <div className="relative">
            <Settings className="w-16 h-16 text-gray-400 animate-spin-slow" />
            <Construction className="w-8 h-8 text-blue-500 absolute -top-2 -right-2" />
          </div>

          {/* Main Content */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Settings Coming Soon
            </h1>
            <p className="text-gray-600 max-w-md">
              We're working hard to bring you a new and improved settings
              experience. Check back soon for exciting new features and
              customization options.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="w-full max-w-xs space-y-2">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full w-2/3 animate-pulse"
                style={{ animation: "progress 2s ease-in-out infinite" }}
              />
            </div>
            <p className="text-sm text-gray-500">Development in progress</p>
          </div>

          {/* Return Link */}
          <Link
            href="/workspaces"
            className="mt-8 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default ComingSoonPage;
