"use client";

import { UserButton, useUser } from "@clerk/nextjs";

const Navbar: React.FC = () => {
  const { isSignedIn } = useUser();

  return (
    <header className="bg-blue-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">PlanIt</h1>
        <div className="flex items-center space-x-4">
          {isSignedIn && (
            <div>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
