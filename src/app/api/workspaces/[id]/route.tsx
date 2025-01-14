import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { workspaces } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    // Extract the workspace ID from the URL
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const workspaceId = parseInt(id || "", 10); // Parse ID from path
    if (isNaN(workspaceId)) {
      return NextResponse.json(
        { error: "Invalid workspace ID" },
        { status: 400 }
      );
    }
    // Fetch the workspace from the database
    const workspace = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .execute();

    if (workspace.length === 0) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(workspace[0]);
  } catch (error) {
    console.error("Error fetching workspace:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Extract the workspace ID from the URL
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const workspaceId = parseInt(id || "", 10); // Parse ID from path
    if (isNaN(workspaceId)) {
      return NextResponse.json(
        { error: "Invalid workspace ID" },
        { status: 400 }
      );
    }

    await db.delete(workspaces).where(eq(workspaces.id, workspaceId)).execute();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting workspace:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Extract the workspace ID from the URL
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const workspaceId = parseInt(id || "", 10); // Parse ID from path
    if (isNaN(workspaceId)) {
      return NextResponse.json(
        { error: "Invalid workspace ID" },
        { status: 400 }
      );
    }

    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Workspace name is required" },
        { status: 400 }
      );
    }

    const updatedWorkspace = await db
      .update(workspaces)
      .set({ name })
      .where(eq(workspaces.id, workspaceId))
      .returning()
      .execute();

    return NextResponse.json(updatedWorkspace[0]);
  } catch (error) {
    console.error("Error updating workspace:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
