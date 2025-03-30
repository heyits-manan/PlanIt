import Header from "@/components/Header";
import React from "react";

export default function Features() {
  return (
    <div className="flex flex-col pt-40 items-center py-16 px-4 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <Header />

      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Choose Your Plan
      </h1>
      <p className="text-gray-600 mb-12 text-lg text-center">
        Find the perfect solution for your productivity needs
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {/* Free Plan */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
          <div className="p-6 flex flex-col h-full">
            <div className="bg-blue-100 rounded-lg inline-block px-4 py-1 text-blue-800 font-medium text-sm mb-4">
              Free Plan
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Basic Features
            </h2>
            <div className="flex items-baseline mb-6">
              <span className="text-3xl font-extrabold text-gray-900">$0</span>
              <span className="text-gray-500 ml-1">/forever</span>
            </div>
            <ul className="mb-6 flex-grow space-y-3">
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Limited number of tasks/projects</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Basic calendar integration</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Standard reminders and notifications</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Basic collaboration</span>
              </li>
            </ul>
            <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Get Started
            </button>
            <div className="mt-3 text-xs text-center text-gray-500">
              Coming Soon
            </div>
          </div>
        </div>

        {/* Premium Subscription */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden relative transition-transform duration-300 hover:scale-105">
          <div className="absolute top-0 right-0 bg-purple-500 text-xs font-bold px-3 py-1 text-white">
            POPULAR
          </div>
          <div className="p-6 flex flex-col h-full">
            <div className="bg-purple-100 rounded-lg inline-block px-4 py-1 text-purple-800 font-medium text-sm mb-4">
              Premium Subscription
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Advanced Features
            </h2>
            <div className="flex items-baseline mb-6">
              <span className="text-3xl font-extrabold text-gray-900">
                $9.99
              </span>
              <span className="text-gray-500 ml-1">/month</span>
            </div>
            <ul className="mb-6 flex-grow space-y-3">
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Unlimited projects/tasks</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Advanced analytics and insights</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Smart scheduling with AI</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Customizable themes</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Priority support</span>
              </li>
            </ul>
            <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors">
              Upgrade Now
            </button>
            <div className="mt-3 text-xs text-center text-gray-500">
              Coming Soon
            </div>
          </div>
        </div>

        {/* Team/Business Plan */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
          <div className="p-6 flex flex-col h-full">
            <div className="bg-green-100 rounded-lg inline-block px-4 py-1 text-green-800 font-medium text-sm mb-4">
              Team/Business Plan
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Collaboration
            </h2>
            <div className="flex items-baseline mb-6">
              <span className="text-3xl font-extrabold text-gray-900">
                $29.99
              </span>
              <span className="text-gray-500 ml-1">/month</span>
            </div>
            <ul className="mb-6 flex-grow space-y-3">
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Team collaboration</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Admin dashboard</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Integrations (Slack, Notion, Jira)</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Role-based access control</span>
              </li>
            </ul>
            <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
              Get Team Access
            </button>
            <div className="mt-3 text-xs text-center text-gray-500">
              Coming Soon
            </div>
          </div>
        </div>

        {/* Lifetime Access */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden text-white transition-transform duration-300 hover:scale-105">
          <div className="p-6 flex flex-col h-full">
            <div className="bg-gray-700 rounded-lg inline-block px-4 py-1 text-gray-100 font-medium text-sm mb-4">
              Lifetime Access
            </div>
            <h2 className="text-2xl font-bold mb-4">One-Time Payment</h2>
            <div className="flex items-baseline mb-6">
              <span className="text-3xl font-extrabold">$149</span>
              <span className="text-gray-300 ml-1">/once</span>
            </div>
            <ul className="mb-6 flex-grow space-y-3 text-gray-200">
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-400 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>All premium features included</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-400 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>No recurring payments</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-400 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Future updates included</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-400 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Priority support for life</span>
              </li>
            </ul>
            <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-colors">
              Get Lifetime Access
            </button>
            <div className="mt-3 text-xs text-center text-gray-400">
              Coming Soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
