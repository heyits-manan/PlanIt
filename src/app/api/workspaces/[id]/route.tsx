import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { workspaces } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const workspaceId = parseInt(id || "", 10);

    if (isNaN(workspaceId)) {
      return NextResponse.json(
        { error: "Invalid workspace ID" },
        { status: 400 }
      );
    }

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

    if (workspace[0].ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(workspace[0]);
  } catch {
    console.error("Error fetching workspace");
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
  } catch {
    console.error("Error deleting workspace");
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
  } catch {
    console.error("Error updating workspace.");
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
