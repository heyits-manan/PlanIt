// app/api/user-workspaces/route.ts
import { NextResponse } from 'next/server';
import { currentUser } from "@clerk/nextjs/server";
import { db } from '@/lib/db';
import { workspaces, workspaceMembers } from '@/lib/schema';
import { eq, or } from 'drizzle-orm';

export async function GET() {
  try {
    const user = await currentUser();
    
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
      .where(
          eq(workspaceMembers.email, userEmail),
      );
    
    // Get the full workspace details for member workspaces
    const memberWorkspaces = memberWorkspaceIds.length > 0 
      ? await db
          .select()
          .from(workspaces)
          .where(
            or(...memberWorkspaceIds.map(m => eq(workspaces.id, m.workspaceId)))
          )
      : [];
    
    // Combine both arrays and mark the user's role in each workspace
    const allWorkspaces = [
      ...ownedWorkspaces.map(w => ({ ...w, role: "owner" })),
      ...memberWorkspaces.map(w => ({ ...w, role: "member" }))
    ];
    
    return NextResponse.json(allWorkspaces);
  } catch (error) {
    console.error("ERROR FETCHING USER WORKSPACES:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
export async function POST(req: Request) {
    try {
      const user = await currentUser();
      
      if (!user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      
      const { workspaceId, emails }: { workspaceId: string; emails: string[] } = await req.json();
      
      if (!workspaceId || !emails || emails.length === 0) {
        return new NextResponse("Missing required fields", { status: 400 });
      }
      
      // Verify the user is the owner of the workspace
      const [workspace] = await db
        .select()
        .from(workspaces)
        .where(eq(workspaces.id, Number(workspaceId)))
        .limit(1);
      
      if (!workspace) {
        return new NextResponse("Workspace not found", { status: 404 });
      }
      
      if (workspace.ownerId !== user.id) {
        return new NextResponse("Not authorized to add contributors", { status: 403 });
      }
      
      // Check if any of the emails already exist as members
      const existingMembers = await db
        .select({ email: workspaceMembers.email })
        .from(workspaceMembers)
        .where(eq(workspaceMembers.workspaceId, Number(workspaceId)));
      
      const existingEmails = new Set(existingMembers.map(m => m.email));
      
      // Filter out emails that are already members
      const newEmails = emails.filter(email => !existingEmails.has(email));
      
      // Add all the new contributors
      if (newEmails.length > 0) {
        const memberInserts = newEmails.map(email => ({
          workspaceId: Number(workspaceId),
          email,
          userId: user.id,
          role: "editor" as "owner" | "editor" | "viewer", // Default role
          status: "pending"
        }));
        
        await db.insert(workspaceMembers).values(memberInserts);
      }
      
      // In a real application, you would send emails to these contributors here
      // You would include a token in the email that allows them to accept the invitation
      
      return NextResponse.json({ 
        message: "Contributors added successfully",
        added: newEmails.length,
        skipped: emails.length - newEmails.length
      });
    } catch (error) {
      console.error("ERROR ADDING CONTRIBUTORS:", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }