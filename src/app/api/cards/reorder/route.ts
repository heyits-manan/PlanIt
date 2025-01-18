// app/api/cards/reorder/route.ts
import { db } from "@/lib/db";
import { cards } from "@/lib/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function PUT(req: Request) {
  try {
    const { items } = await req.json();

    // Update each card's position and boardId
    await Promise.all(
      items.map(
        async (item: { id: number; position: number; boardId: number }) => {
          await db
            .update(cards)
            .set({ position: item.position, boardId: item.boardId })
            .where(eq(cards.id, item.id));
        }
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update card positions" },
      { status: 500 }
    );
  }
}
