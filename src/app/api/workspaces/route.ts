import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { workspaces, workspaceMembers } from "@/lib/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, or } from "drizzle-orm";

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

    if (!user?.id || !user.emailAddresses.length) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userEmail = user.emailAddresses[0].emailAddress;

    // Get workspaces where user is owner
    const ownedWorkspaces = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.ownerId, user.id));

    // Get workspaces where user is a member with accepted status
    const memberWorkspaceIds = await db
      .select({ workspaceId: workspaceMembers.workspaceId })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.email, userEmail));

    // Get the full workspace details for member workspaces
    const memberWorkspaces =
      memberWorkspaceIds.length > 0
        ? await db
            .select()
            .from(workspaces)
            .where(
              or(
                ...memberWorkspaceIds.map((m) =>
                  eq(workspaces.id, m.workspaceId)
                )
              )
            )
        : [];

    // Combine both arrays and mark the user's role in each workspace
    const allWorkspaces = [
      ...ownedWorkspaces.map((w) => ({ ...w, role: "owner" })),
      ...memberWorkspaces.map((w) => ({ ...w, role: "member" })),
    ];

    if (!data.length) {
      return NextResponse.json(
        { message: "No workspaces found" },
        { status: 404 }
      );
    } else {
      return NextResponse.json(allWorkspaces);
    }
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
