import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { expenses, budgets } from "@/lib/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");
    const budgetId = searchParams.get("budgetId");
    const status = searchParams.get("status");

    if (!user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 }
      );
    }

    const whereConditions = [eq(expenses.workspaceId, parseInt(workspaceId))];

    if (budgetId) {
      whereConditions.push(eq(expenses.budgetId, parseInt(budgetId)));
    }

    if (status) {
      whereConditions.push(eq(expenses.status, status));
    }

    const workspaceExpenses = await db
      .select()
      .from(expenses)
      .where(and(...whereConditions))
      .orderBy(desc(expenses.createdAt));

    return NextResponse.json(workspaceExpenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    const body = await request.json();
    const {
      workspaceId,
      budgetId,
      title,
      description,
      amount,
      category,
      date,
      receiptUrl,
      isReimbursable = false,
    } = body;

    if (!user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (!workspaceId || !title || !amount || !category || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db
      .insert(expenses)
      .values({
        workspaceId: parseInt(workspaceId),
        budgetId: budgetId ? parseInt(budgetId) : null,
        title,
        description,
        amount,
        category,
        date: new Date(date),
        receiptUrl,
        isReimbursable,
        createdBy: user.id,
      })
      .returning()
      .execute();

    // Update budget spent amount if budget is specified
    if (budgetId) {
      const budget = await db
        .select()
        .from(budgets)
        .where(eq(budgets.id, parseInt(budgetId)))
        .limit(1);

      if (budget.length > 0) {
        const currentSpent = Number(budget[0].spentAmount) || 0;
        const newSpent = currentSpent + Number(amount);

        await db
          .update(budgets)
          .set({ spentAmount: newSpent.toString() })
          .where(eq(budgets.id, parseInt(budgetId)));
      }
    }

    return NextResponse.json({
      message: "Expense created successfully",
      expense: result[0],
    });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
