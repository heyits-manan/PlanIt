import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { invoices, invoiceItems } from "@/lib/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");
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

    const whereConditions = [eq(invoices.workspaceId, parseInt(workspaceId))];

    if (status) {
      // Only allow valid status values to be used in the query
      const validStatuses = [
        "draft",
        "sent",
        "paid",
        "overdue",
        "cancelled",
      ] as const;
      if (validStatuses.includes(status as (typeof validStatuses)[number])) {
        whereConditions.push(
          eq(invoices.status, status as (typeof validStatuses)[number])
        );
      }
    }

    const workspaceInvoices = await db
      .select()
      .from(invoices)
      .where(and(...whereConditions))
      .orderBy(desc(invoices.createdAt));

    // Get invoice items for each invoice
    const invoicesWithItems = await Promise.all(
      workspaceInvoices.map(async (invoice) => {
        const items = await db
          .select()
          .from(invoiceItems)
          .where(eq(invoiceItems.invoiceId, invoice.id));

        return {
          ...invoice,
          items,
        };
      })
    );

    return NextResponse.json(invoicesWithItems);
  } catch (error) {
    console.error("Error fetching invoices:", error);
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
      invoiceNumber,
      clientName,
      clientEmail,
      amount,
      taxAmount = 0,
      currency = "USD",
      issueDate,
      dueDate,
      notes,
      items,
    } = body;

    if (!user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (
      !workspaceId ||
      !invoiceNumber ||
      !clientName ||
      !amount ||
      !issueDate ||
      !dueDate
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const totalAmount = Number(amount) + Number(taxAmount);

    // Create invoice
    const invoiceResult = await db
      .insert(invoices)
      .values({
        workspaceId: parseInt(workspaceId),
        invoiceNumber,
        clientName,
        clientEmail,
        amount,
        taxAmount,
        totalAmount: totalAmount.toString(),
        currency,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        notes,
        createdBy: user.id,
      })
      .returning()
      .execute();

    const invoice = invoiceResult[0];

    // Create invoice items if provided
    if (items && items.length > 0) {
      const invoiceItemsData = items.map(
        (item: {
          description: string;
          quantity: number;
          unitPrice: number;
        }) => ({
          invoiceId: invoice.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: (item.quantity * item.unitPrice).toString(),
        })
      );

      await db.insert(invoiceItems).values(invoiceItemsData).execute();
    }

    return NextResponse.json({
      message: "Invoice created successfully",
      invoice: {
        ...invoice,
        items: items || [],
      },
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
