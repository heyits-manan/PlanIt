import React from "react";

export default function Footer() {
  return (
    <footer className="w-full py-4 bg-blue-600 text-white text-center">
      <p>&copy; {new Date().getFullYear()} PlanIt. All rights reserved.</p>
    </footer>
  );
}
