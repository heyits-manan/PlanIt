"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ArrowRightIcon } from "lucide-react";
import { Header } from "../components/Header";
import { Features } from "../components/Features";
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
          }),
        });
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }
  }, [isSignedIn]);

  return (
    <div className="min-h-screen bg-gradient-to-br mt-20 ">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12 flex flex-col items-center justify-center text-center">
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight text-center justify-center animate-fade-in">
            Organize Your Work,{" "}
            <span className="text-blue-600">Effortlessly</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            PlanIt transforms how you manage tasks and collaborate. Create,
            track, and achieve more with our intuitive, powerful board
            management system.
          </p>

          {!isSignedIn && (
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in">
              <Link
                href="/sign-up"
                className="px-6 py-3 bg-blue-500 text-white rounded-full text-lg font-medium 
                shadow-md hover:bg-blue-600 hover:shadow-lg transition-all flex items-center justify-center"
              >
                Start Free
                <ArrowRightIcon className="ml-2" size={20} />
              </Link>
            </div>
          )}
        </div>
      </main>

      <Features />
      {/* <footer className="w-full  py-4 bg-blue-600 text-white text-center">
          <p>&copy; {new Date().getFullYear()} PlanIt. All rights reserved.</p>
        </footer> */}
    </div>
  );
}
