import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { budgets, expenses } from "@/lib/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");

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

    // Get budgets for the workspace
    const workspaceBudgets = await db
      .select()
      .from(budgets)
      .where(eq(budgets.workspaceId, parseInt(workspaceId)))
      .orderBy(desc(budgets.createdAt));

    // Calculate spent amounts for each budget
    const budgetsWithSpentAmounts = await Promise.all(
      workspaceBudgets.map(async (budget) => {
        const expensesForBudget = await db
          .select()
          .from(expenses)
          .where(
            and(
              eq(expenses.budgetId, budget.id),
              eq(expenses.status, "approved")
            )
          );

        const totalSpent = expensesForBudget.reduce(
          (sum, expense) => sum + Number(expense.amount),
          0
        );

        const spentPercentage = (totalSpent / Number(budget.totalBudget)) * 100;
        const isOverBudget = totalSpent > Number(budget.totalBudget);
        const isNearLimit = spentPercentage >= Number(budget.alertThreshold);

        return {
          ...budget,
          spentAmount: totalSpent,
          remainingAmount: Number(budget.totalBudget) - totalSpent,
          spentPercentage: Math.round(spentPercentage * 100) / 100,
          isOverBudget,
          isNearLimit,
        };
      })
    );

    return NextResponse.json(budgetsWithSpentAmounts);
  } catch (error) {
    console.error("Error fetching budgets:", error);
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
      name,
      description,
      totalBudget,
      category,
      startDate,
      endDate,
      alertThreshold = 80,
    } = body;

    if (!user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (
      !workspaceId ||
      !name ||
      !totalBudget ||
      !category ||
      !startDate ||
      !endDate
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db
      .insert(budgets)
      .values({
        workspaceId: parseInt(workspaceId),
        name,
        description,
        totalBudget,
        category,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        alertThreshold,
      })
      .returning()
      .execute();

    return NextResponse.json({
      message: "Budget created successfully",
      budget: result[0],
    });
  } catch (error) {
    console.error("Error creating budget:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await currentUser();
    const body = await request.json();
    const {
      id,
      workspaceId,
      name,
      description,
      totalBudget,
      category,
      startDate,
      endDate,
      alertThreshold = 80,
    } = body;

    if (!user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (
      !id ||
      !workspaceId ||
      !name ||
      !totalBudget ||
      !category ||
      !startDate ||
      !endDate
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db
      .update(budgets)
      .set({
        name,
        description,
        totalBudget,
        category,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        alertThreshold,
        updatedAt: new Date(),
      })
      .where(eq(budgets.id, parseInt(id)))
      .returning()
      .execute();

    return NextResponse.json({
      message: "Budget updated successfully",
      budget: result[0],
    });
  } catch (error) {
    console.error("Error updating budget:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(request.url);
    const budgetId = searchParams.get("id");
    const forceDelete = searchParams.get("force") === "true";

    if (!user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (!budgetId) {
      return NextResponse.json(
        { error: "Budget ID is required" },
        { status: 400 }
      );
    }

    // Check if budget has any expenses
    const budgetExpenses = await db
      .select()
      .from(expenses)
      .where(eq(expenses.budgetId, parseInt(budgetId)));

    if (budgetExpenses.length > 0 && !forceDelete) {
      return NextResponse.json(
        {
          error: "Cannot delete budget with associated expenses",
          details: {
            expenseCount: budgetExpenses.length,
            budgetId: parseInt(budgetId),
            message:
              "This budget has associated expenses. To delete it, you must first remove or reassign all associated expenses.",
          },
        },
        { status: 400 }
      );
    }

    // If force delete is enabled, first remove budgetId from associated expenses
    if (budgetExpenses.length > 0 && forceDelete) {
      await db
        .update(expenses)
        .set({ budgetId: null })
        .where(eq(expenses.budgetId, parseInt(budgetId)))
        .execute();
    }

    await db
      .delete(budgets)
      .where(eq(budgets.id, parseInt(budgetId)))
      .execute();

    return NextResponse.json({
      message: "Budget deleted successfully",
      forceDeleted: forceDelete && budgetExpenses.length > 0,
      expensesRemoved: forceDelete ? budgetExpenses.length : 0,
    });
  } catch (error) {
    console.error("Error deleting budget:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
