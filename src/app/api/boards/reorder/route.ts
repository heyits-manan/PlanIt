// app/api/boards/reorder/route.ts
import { db } from "@/lib/db";
import { boards } from "@/lib/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function PUT(req: Request) {
  try {
    const { items } = await req.json();

    // Update each board's position
    await Promise.all(
      items.map(async (item: { id: number; position: number }) => {
        await db
          .update(boards)
          .set({ position: item.position })
          .where(eq(boards.id, item.id));
      })
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update board positions" },
      { status: 500 }
    );
  }
}
