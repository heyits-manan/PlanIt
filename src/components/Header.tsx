"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ArrowRightIcon, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">PlanIt</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/features"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Pricing
            </Link>
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Resources
                <ChevronDown
                  size={16}
                  className={`ml-1 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-100">
                  <Link
                    href="/blog"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Blog
                  </Link>
                  <Link
                    href="/tutorials"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Tutorials
                  </Link>
                  <Link
                    href="/support"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Support
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Authentication/Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <Link
                href="/workspaces"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium 
                  shadow-sm hover:bg-blue-700 transition-all flex items-center"
              >
                My Workspace
                <ArrowRightIcon className="ml-2 w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium 
                    shadow-sm hover:bg-blue-700 transition-all"
                >
                  Start Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/features"
                className="text-gray-600 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between text-gray-600 font-medium"
              >
                Resources
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="pl-4 flex flex-col space-y-2 border-l-2 border-gray-100">
                  <Link
                    href="/blog"
                    className="text-gray-600 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Blog
                  </Link>
                  <Link
                    href="/tutorials"
                    className="text-gray-600 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tutorials
                  </Link>
                  <Link
                    href="/support"
                    className="text-gray-600 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Support
                  </Link>
                </div>
              )}

              {isSignedIn ? (
                <Link
                  href="/workspaces"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium 
                    shadow-sm hover:bg-blue-700 transition-all flex items-center justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Workspace
                  <ArrowRightIcon className="ml-2 w-4 h-4" />
                </Link>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/sign-in"
                    className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors
                      border border-gray-200 rounded-lg text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium 
                      shadow-sm hover:bg-blue-700 transition-all text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Start Free
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
