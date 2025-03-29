"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  ArrowRightIcon,
  CheckCircle,
  Zap,
  Globe,
  Wrench,
  LayoutDashboardIcon,
} from "lucide-react";

import { useEffect } from "react";

export default function Home() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      try {
        fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user?.id,
            email: user?.emailAddresses[0].emailAddress,
            name: user?.fullName,
          }),
        });
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }
  }, [isSignedIn]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
      <header className="top-0 left-0 right-0 z-50 bg-white/90  ">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-800">PlanIt</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-28 pb-24">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-20">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
              <Zap size={16} className="mr-2" />
              Boost your productivity with PlanIt
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Organize Your Work, Effortlessly
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              PlanIt transforms how you manage tasks and collaborate. Create,
              track, and achieve more with our intuitive, powerful board
              management system.
            </p>

            {!isSignedIn ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/sign-up"
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-medium 
                  shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center group"
                >
                  Start Free
                  <ArrowRightIcon
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                    size={20}
                  />
                </Link>
                <Link
                  href="/features"
                  className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg text-lg font-medium 
                  hover:bg-gray-50 transition-all flex items-center justify-center"
                >
                  Learn More
                </Link>
              </div>
            ) : (
              <Link
                href="/workspaces"
                className=" py-4 bg-blue-600 text-white rounded-lg  text-lg font-medium 
                shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center group"
              >
                Go to My Workspace
                <ArrowRightIcon
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </Link>
            )}
          </div>
          <div className="relative w-full max-w-lg">
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-4 right-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
            <div className="relative">
              {/* <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/31346973/pexels-photo-31346973/free-photo-of-misty-lake-scene-with-overhanging-branches.jpeg"
                  alt="PlanIt dashboard preview"
                  className="w-full h-auto"
                />
              </div> */}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose PlanIt?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform is designed to make work management simple yet
              powerful.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle className="text-green-500" size={24} />,
                title: "Simple Task Management",
                description:
                  "Create, organize, and track tasks with our intuitive drag-and-drop interface.",
              },
              {
                icon: <Wrench className="text-blue-500" size={24} />,
                title: "Powerful Customization",
                description:
                  "Tailor your workflow with custom fields, labels, and automation tools.",
              },
              {
                icon: <Globe className="text-purple-500" size={24} />,
                title: "Seamless Collaboration",
                description:
                  "Work together in real-time with team members from anywhere in the world.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join PlanIt to organize work and boost productivity.
          </p>

          {!isSignedIn && (
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-medium 
              shadow-lg hover:bg-gray-100 transition-all inline-flex items-center"
            >
              Get Started Today
              <ArrowRightIcon className="ml-2" size={20} />
            </Link>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-blue-600">PlanIt</h3>
              <p className="text-gray-600 mt-2">
                Organize your work, effortlessly.
              </p>
            </div>
            <div className="flex gap-8">
              <Link href="/about" className="text-gray-600 hover:text-blue-600">
                About
              </Link>
              <Link
                href="/features"
                className="text-gray-600 hover:text-blue-600"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-blue-600"
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-blue-600"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} PlanIt. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
