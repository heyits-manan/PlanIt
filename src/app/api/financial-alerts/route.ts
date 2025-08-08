import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { financialAlerts, budgets, invoices } from "@/lib/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and, desc, lt } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");
    const isRead = searchParams.get("isRead");
    const severity = searchParams.get("severity");

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

    const whereConditions = [
      eq(financialAlerts.workspaceId, parseInt(workspaceId)),
    ];

    if (isRead !== null) {
      whereConditions.push(eq(financialAlerts.isRead, isRead === "true"));
    }

    if (severity) {
      whereConditions.push(eq(financialAlerts.severity, severity));
    }

    const workspaceAlerts = await db
      .select()
      .from(financialAlerts)
      .where(and(...whereConditions))
      .orderBy(desc(financialAlerts.createdAt));

    return NextResponse.json(workspaceAlerts);
  } catch (error) {
    console.error("Error fetching financial alerts:", error);
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
    const { workspaceId, budgetId, type, title, message, severity } = body;

    if (!user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (!workspaceId || !type || !title || !message || !severity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db
      .insert(financialAlerts)
      .values({
        workspaceId: parseInt(workspaceId),
        budgetId: budgetId ? parseInt(budgetId) : null,
        type,
        title,
        message,
        severity,
      })
      .returning()
      .execute();

    return NextResponse.json({
      message: "Financial alert created successfully",
      alert: result[0],
    });
  } catch (error) {
    console.error("Error creating financial alert:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Function to check for budget alerts and create them automatically
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function checkBudgetAlerts(workspaceId: number) {
  try {
    const workspaceBudgets = await db
      .select()
      .from(budgets)
      .where(eq(budgets.workspaceId, workspaceId));

    for (const budget of workspaceBudgets) {
      const spentAmount = Number(budget.spentAmount) || 0;
      const totalBudget = Number(budget.totalBudget);
      const alertThreshold = Number(budget.alertThreshold);
      const spentPercentage = (spentAmount / totalBudget) * 100;

      // Check if budget is near threshold
      if (spentPercentage >= alertThreshold && spentPercentage < 100) {
        const existingAlert = await db
          .select()
          .from(financialAlerts)
          .where(
            and(
              eq(financialAlerts.workspaceId, workspaceId),
              eq(financialAlerts.budgetId, budget.id),
              eq(financialAlerts.type, "budget_alert"),
              eq(financialAlerts.isResolved, false)
            )
          )
          .limit(1);

        if (existingAlert.length === 0) {
          await db.insert(financialAlerts).values({
            workspaceId,
            budgetId: budget.id,
            type: "budget_alert",
            title: `Budget Alert: ${budget.name}`,
            message: `Budget "${budget.name}" has reached ${Math.round(
              spentPercentage
            )}% of its limit.`,
            severity: spentPercentage >= 90 ? "high" : "medium",
          });
        }
      }

      // Check if budget is exceeded
      if (spentAmount > totalBudget) {
        const existingAlert = await db
          .select()
          .from(financialAlerts)
          .where(
            and(
              eq(financialAlerts.workspaceId, workspaceId),
              eq(financialAlerts.budgetId, budget.id),
              eq(financialAlerts.type, "budget_exceeded"),
              eq(financialAlerts.isResolved, false)
            )
          )
          .limit(1);

        if (existingAlert.length === 0) {
          await db.insert(financialAlerts).values({
            workspaceId,
            budgetId: budget.id,
            type: "budget_exceeded",
            title: `Budget Exceeded: ${budget.name}`,
            message: `Budget "${budget.name}" has been exceeded by $${(
              spentAmount - totalBudget
            ).toFixed(2)}.`,
            severity: "critical",
          });
        }
      }
    }
  } catch (error) {
    console.error("Error checking budget alerts:", error);
  }
}

// Function to check for overdue invoices and create alerts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function checkInvoiceAlerts(workspaceId: number) {
  try {
    const overdueInvoices = await db
      .select()
      .from(invoices)
      .where(
        and(
          eq(invoices.workspaceId, workspaceId),
          eq(invoices.status, "sent"),
          lt(invoices.dueDate, new Date())
        )
      );

    for (const invoice of overdueInvoices) {
      const existingAlert = await db
        .select()
        .from(financialAlerts)
        .where(
          and(
            eq(financialAlerts.workspaceId, workspaceId),
            eq(financialAlerts.type, "invoice_overdue"),
            eq(financialAlerts.isResolved, false)
          )
        )
        .limit(1);

      if (existingAlert.length === 0) {
        await db.insert(financialAlerts).values({
          workspaceId,
          type: "invoice_overdue",
          title: `Overdue Invoice: ${invoice.invoiceNumber}`,
          message: `Invoice ${invoice.invoiceNumber} for ${invoice.clientName} is overdue. Amount: $${invoice.totalAmount}`,
          severity: "high",
        });
      }
    }
  } catch (error) {
    console.error("Error checking invoice alerts:", error);
  }
}
