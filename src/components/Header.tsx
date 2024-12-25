import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  LayoutDashboardIcon,
} from "lucide-react";

export function Header() {
  const { isSignedIn } = useUser();

  return (
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
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "w-10 h-10 ring-2 ring-blue-200 hover:ring-blue-300 transition-all",
                },
              }}
            />
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
  );
}
