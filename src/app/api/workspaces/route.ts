import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Workspace } from "@/models/Workspace";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  const { name, owner } = await req.json();

  try {
    await connectToDatabase();

    const newWorkspace = new Workspace({
      name,
      owner: new mongoose.Types.ObjectId(), // Generate a new ObjectId for the owner
    });

    await newWorkspace.save();

    return NextResponse.json(
      { message: "Workspace created successfully", workspace: newWorkspace },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating workspace:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const workspaces = await Workspace.find().populate("owner members");

    return NextResponse.json({ workspaces }, { status: 200 });
  } catch (error) {
    console.error("Error fetching workspaces:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
}
export async function PUT(req: NextRequest) {
  const { id, name, description, members, boards } = await req.json();

  try {
    await connectToDatabase();

    const updatedWorkspace = await Workspace.findByIdAndUpdate(
      id,
      { name, description, members, boards },
      { new: true }
    );

    if (!updatedWorkspace) {
      return NextResponse.json(
        { message: "Workspace not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Workspace updated successfully",
        workspace: updatedWorkspace,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating workspace:", error);
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

    const deletedWorkspace = await Workspace.findByIdAndDelete(id);

    if (!deletedWorkspace) {
      return NextResponse.json(
        { message: "Workspace not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Workspace deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting workspace:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
