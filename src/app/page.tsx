"use client";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  PlusCircleIcon,
  LayoutDashboardIcon,
  UsersIcon,
  StarIcon,
} from "lucide-react";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 selection:bg-blue-100">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <LayoutDashboardIcon className="text-blue-600" size={28} />
            <span className="text-2xl font-bold text-gray-800">PlanIt</span>
          </Link>

          <nav className="flex items-center space-x-6">
            {isSignedIn && (
              <Link
                href="/boards"
                className="flex items-center text-gray-700 hover:text-blue-600 
                transition-colors group"
              >
                <CheckCircle2Icon
                  className="mr-2 text-gray-500 group-hover:text-blue-600"
                  size={18}
                />
                My Boards
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox:
                        "w-10 h-10 ring-2 ring-blue-200 hover:ring-blue-300 transition-all",
                    },
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/sign-in"
                  className="px-4 py-2 border border-blue-500 text-blue-600 rounded-full hover:bg-blue-50 transition"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition flex items-center"
                >
                  Get Started
                  <ArrowRightIcon className="ml-2" size={18} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-12 flex flex-col items-center justify-center text-center">
        <div className="max-w-4xl">
          <h2 className="text-5xl font-extrabold mb-6 leading-tight text-center justify-center animate-fade-in">
            Organize Your Work,{" "}
            <span className="text-blue-600">Effortlessly</span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            PlanIt transforms how you manage tasks and collaborate. Create,
            track, and achieve more with our intuitive, powerful board
            management system.
          </p>

          {!isSignedIn && (
            <div className="flex justify-center space-x-4 animate-fade-in">
              <Link
                href="/sign-up"
                className="px-6 py-3 bg-blue-500 text-white rounded-full text-lg font-medium 
                shadow-md hover:bg-blue-600 hover:shadow-lg transition-all flex items-center"
              >
                Start Free
                <ArrowRightIcon className="ml-2" size={20} />
              </Link>
              <Link
                href="/features"
                className="px-6 py-3 border border-blue-500 text-blue-600 rounded-full 
                text-lg font-medium hover:bg-blue-50 transition-all flex items-center"
              >
                Learn More
              </Link>
            </div>
          )}
        </div>
      </main>

      <section className="py-16 bg-white/70 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Teams Love PlanIt
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle2Icon className="text-blue-600" size={40} />,
                title: "Streamlined Workflow",
                description:
                  "Simplify task management with our drag-and-drop interface.",
              },
              {
                icon: <UsersIcon className="text-blue-600" size={40} />,
                title: "Team Collaboration",
                description:
                  "Real-time updates and seamless team communication.",
              },
              {
                icon: (
                  <LayoutDashboardIcon className="text-blue-600" size={40} />
                ),
                title: "Flexible Boards",
                description: "Customize boards to match your unique workflow.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg 
                transition-all text-center flex flex-col items-center"
              >
                <div className="mb-4">{feature.icon}</div>
                <h4 className="font-bold text-xl text-gray-800 mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
