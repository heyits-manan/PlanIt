// app/api/cards/route.ts
import { db } from "@/lib/db";
import { cards } from "@/lib/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { title, description, boardId } = await req.json();

    const existingCards = await db
      .select()
      .from(cards)
      .where(eq(cards.boardId, boardId));

    const position = existingCards.length;

    const newCard = await db
      .insert(cards)
      .values({
        title,
        description,
        boardId,
        position,
      })
      .returning();

    return NextResponse.json(newCard[0]);
  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json(
      { error: "Failed to create card" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, title, description } = await req.json();

    const updatedCard = await db
      .update(cards)
      .set({
        title,
        description,
      })
      .where(eq(cards.id, id))
      .returning();

    return NextResponse.json(updatedCard[0]);
  } catch (error) {
    console.error("Error updating card:", error);
    return NextResponse.json(
      { error: "Failed to update card" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Card ID is required" }, { status: 400 });
  }

  try {
    const deletedCard = await db
      .delete(cards)
      .where(eq(cards.id, parseInt(id)))
      .returning();

    return NextResponse.json(deletedCard[0]);
  } catch {
    console.error("Error deleting card");
    return NextResponse.json(
      { error: "Failed to delete card" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const boardId = url.searchParams.get("boardId");

  if (!boardId) {
    return NextResponse.json(
      { error: "Board ID is required" },
      { status: 400 }
    );
  }

  try {
    const cardList = await db
      .select()
      .from(cards)
      .where(eq(cards.boardId, parseInt(boardId)))
      .orderBy(cards.position);

    return NextResponse.json(cardList);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch cards" },
      { status: 500 }
    );
  }
}
