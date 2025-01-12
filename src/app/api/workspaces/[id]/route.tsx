import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { workspaces } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workspaceId = parseInt(params.id, 10); // Parse ID from params
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
