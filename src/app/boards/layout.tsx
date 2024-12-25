import type { Metadata } from "next";
import Navbar from "@/components/NavBar";
import { Session } from "inspector/promises";

export const metadata: Metadata = {
  title: "Boards | PlanIt",
  description: "Create your boards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">{children}</main>
    </div>
  );
}
