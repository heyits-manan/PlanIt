import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 flex flex-col items-center justify-center text-gray-800">
      <header className="w-full px-8 py-4 bg-white shadow-md fixed top-0 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">PlanIt</h1>
        <nav>
          <Link
            href="/boards"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Go to Boards
          </Link>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center pt-20">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          Organize Your Work, <span className="text-blue-500">Your Way</span>
        </h2>
        <p className="text-lg md:text-xl mb-8 text-gray-700 max-w-2xl">
          PlanIt is a modern task management tool to streamline your workflow,
          organize your tasks, and collaborate effectively with your team.
        </p>
        <Link
          href="/boards"
          className="px-6 py-3 bg-blue-500 text-white rounded-full text-lg font-medium shadow-md hover:bg-blue-600 transition"
        >
          Get Started
        </Link>
      </main>

      <section className="py-12 bg-white w-full">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-center mb-8">Why PlanIt?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg shadow-md bg-blue-50">
              <h4 className="font-bold text-lg text-blue-600 mb-2">
                Easy to Use
              </h4>
              <p className="text-gray-700">
                An intuitive interface that makes managing tasks and boards
                effortless.
              </p>
            </div>

            <div className="p-6 rounded-lg shadow-md bg-blue-50">
              <h4 className="font-bold text-lg text-blue-600 mb-2">
                Customizable
              </h4>
              <p className="text-gray-700">
                Adapt PlanIt to your workflow with boards, cards, and
                drag-and-drop functionality.
              </p>
            </div>

            <div className="p-6 rounded-lg shadow-md bg-blue-50">
              <h4 className="font-bold text-lg text-blue-600 mb-2">
                Collaborative
              </h4>
              <p className="text-gray-700">
                Collaborate with your team in real-time and stay on top of your
                tasks.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
