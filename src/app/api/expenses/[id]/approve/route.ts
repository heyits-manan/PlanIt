import { db } from "@/lib/db";
import { budgets, expenses } from "@/lib/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    const { action } = await request.json();
    // notes parameter is available for future use if needed
    const { id } = await params;
    const expenseId = parseInt(id);

    if (!user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    // Get the expense to check if user has permission
    const expense = await db
      .select()
      .from(expenses)
      .where(eq(expenses.id, expenseId))
      .limit(1);

    if (expense.length === 0) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    const expenseData = expense[0];

    // Check if user is the workspace owner (you might need to adjust this based on your workspace structure)
    // For now, we'll allow the action if the user is authenticated
    // In a real app, you'd check if the user is the workspace owner

    const newStatus = action === "approve" ? "approved" : "rejected";

    // Update the expense status
    await db
      .update(expenses)
      .set({
        status: newStatus,
        // You might want to add fields like approvedBy, approvedAt, approvalNotes, etc.
      })
      .where(eq(expenses.id, expenseId));

    // If approved and has a budget, update the budget spent amount
    if (action === "approve" && expenseData.budgetId) {
      const budget = await db
        .select()
        .from(budgets)
        .where(eq(budgets.id, expenseData.budgetId))
        .limit(1);

      if (budget.length > 0) {
        const currentSpent = Number(budget[0].spentAmount) || 0;
        const newSpent = currentSpent + Number(expenseData.amount);

        await db
          .update(budgets)
          .set({ spentAmount: newSpent.toString() })
          .where(eq(budgets.id, expenseData.budgetId));
      }
    }

    return NextResponse.json({
      message: `Expense ${action}d successfully`,
      status: newStatus,
    });
  } catch (error) {
    console.error("Error updating expense status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
