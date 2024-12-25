import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Board } from "@/models/Board";

export async function POST(req: NextRequest) {
  const { name, workspaceId, cards } = await req.json();

  try {
    await connectToDatabase();

    const newBoard = new Board({
      name,
      workspaceId,
      cards,
    });

    await newBoard.save();

    return NextResponse.json(
      { message: "Board created successfully", board: newBoard },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating board:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const workspaceId = req.nextUrl.searchParams.get("workspaceId");

  try {
    await connectToDatabase();

    const boards = await Board.find({ workspaceId }).populate("workspaceId");

    return NextResponse.json({ boards }, { status: 200 });
  } catch (error) {
    console.error("Error fetching boards:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { id, name, cards } = await req.json();

  try {
    await connectToDatabase();

    const updatedBoard = await Board.findByIdAndUpdate(
      id,
      { name, cards },
      { new: true }
    );

    if (!updatedBoard) {
      return NextResponse.json({ message: "Board not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Board updated successfully", board: updatedBoard },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating board:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  try {
    await connectToDatabase();

    const deletedBoard = await Board.findByIdAndDelete(id);

    if (!deletedBoard) {
      return NextResponse.json({ message: "Board not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Board deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting board:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
