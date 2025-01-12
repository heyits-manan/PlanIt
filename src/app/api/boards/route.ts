import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { boards } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 }
      );
    }

    const data = await db
      .select({
        name: boards.name,
        id: boards.id,
        workspaceId: boards.workspaceId,
      })
      .from(boards)
      .where(eq(boards.workspaceId, id))
      .execute();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const { name, workspaceId } = await request.json();

    if (!name || !workspaceId) {
      return NextResponse.json(
        { error: "Name and workspace ID are required" },
        { status: 400 }
      );
    }

    const newBoard = await db
      .insert(boards)
      .values({ name, workspaceId })
      .returning({
        id: boards.id,
        name: boards.name,
        workspaceId: boards.workspaceId,
      })
      .execute();

    return NextResponse.json(newBoard[0]);
  } catch (error) {
    console.error("Error creating board:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
