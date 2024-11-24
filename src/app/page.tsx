import Head from "next/head";
import BoardList from "../components/BoardList";
import AddBoard from "../components/AddBoard";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center text-black">PlanIt</h1>
        <AddBoard />
        <BoardList />
      </div>
    </div>
  );
}
