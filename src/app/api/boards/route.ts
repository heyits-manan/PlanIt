// app/api/boards/route.ts
import { db } from "@/lib/db";
import { boards } from "@/lib/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { name, workspaceId } = await req.json();
    const user = await currentUser();

    // Get highest position for the new board
    const existingBoards = await db
      .select()
      .from(boards)
      .where(eq(boards.workspaceId, workspaceId));

    const position = existingBoards.length;

    const newBoard = await db
      .insert(boards)
      .values({
        name,
        workspaceId,
        position,
        ownerName: user?.fullName,
      })
      .returning();

    return NextResponse.json(newBoard[0]);
  } catch {
    return NextResponse.json(
      { error: "Failed to create board" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const workspaceId = url.searchParams.get("id");

  if (!workspaceId) {
    return NextResponse.json(
      { error: "Workspace ID is required" },
      { status: 400 }
    );
  }

  try {
    const boardList = await db
      .select()
      .from(boards)
      .where(eq(boards.workspaceId, parseInt(workspaceId)))
      .orderBy(boards.position);

    return NextResponse.json(boardList);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch boards" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name } = await req.json();

    const updatedBoard = await db
      .update(boards)
      .set({ name })
      .where(eq(boards.id, id))
      .returning();

    return NextResponse.json(updatedBoard[0]);
  } catch {
    return NextResponse.json(
      { error: "Failed to update board" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const boardId = url.searchParams.get("id");

  if (!boardId) {
    return NextResponse.json(
      { error: "Board ID is required" },
      { status: 400 }
    );
  }

  try {
    await db.delete(boards).where(eq(boards.id, parseInt(boardId)));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete board" },
      { status: 500 }
    );
  }
}
