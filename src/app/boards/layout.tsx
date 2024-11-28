import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boards",
  description: "Create your boards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased bg-white`}>
        <div className="min-h-screen flex flex-col">
          {/* Navbar */}
          <header className="bg-blue-600 text-white py-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">PlanIt</h1>
              <a
                href="/"
                className="px-4 py-2 bg-white text-blue-600 rounded-md font-medium shadow hover:bg-gray-100 transition"
              >
                Home
              </a>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow container mx-auto p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
