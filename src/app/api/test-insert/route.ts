import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust the import path as needed
import { users } from "@/lib/schema"; // Adjust the import path as needed

export async function GET() {
  return NextResponse.json({ message: "Hello from the test-insert API route" });
}
