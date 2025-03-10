import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { workspaces } from "@/lib/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "Owner ID is required" },
        { status: 400 }
      );
    }

    const data = await db
      .select({ name: workspaces.name, id: workspaces.id })
      .from(workspaces)
      .where(eq(workspaces.ownerId, user.id))
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
    const { name, ownerId } = await request.json();
    const user = await currentUser();

    if (!name) {
      return NextResponse.json(
        { error: "Workspace name is required" },
        { status: 400 }
      );
    }

    const result = await db
      .insert(workspaces)
      .values({ name, ownerId, ownerName: user?.fullName })
      .returning()
      .execute();
    const workspaceId = result[0].id;

    return NextResponse.json({
      message: "Workspace created",
      id: workspaceId,
      name,
    });
  } catch (error) {
    console.error("Error creating workspace:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
