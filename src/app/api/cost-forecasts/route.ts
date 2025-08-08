import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { costForecasts } from "@/lib/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";

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

    const workspaceForecasts = await db
      .select()
      .from(costForecasts)
      .where(eq(costForecasts.workspaceId, parseInt(workspaceId)))
      .orderBy(desc(costForecasts.createdAt));

    // Calculate variance and accuracy for each forecast
    const forecastsWithMetrics = workspaceForecasts.map((forecast) => {
      const estimatedCost = Number(forecast.estimatedCost);
      const actualCost = Number(forecast.actualCost);

      const variance =
        actualCost > 0
          ? ((actualCost - estimatedCost) / estimatedCost) * 100
          : 0;
      const accuracy = Math.max(0, 100 - Math.abs(variance));

      return {
        ...forecast,
        variance: Math.round(variance * 100) / 100,
        accuracy: Math.round(accuracy * 100) / 100,
        isOverBudget: actualCost > estimatedCost,
        remainingBudget: estimatedCost - actualCost,
      };
    });

    return NextResponse.json(forecastsWithMetrics);
  } catch (error) {
    console.error("Error fetching cost forecasts:", error);
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
      projectName,
      estimatedCost,
      actualCost = 0,
      forecastedCost,
      startDate,
      endDate,
      confidence,
      notes,
    } = body;

    if (!user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (
      !workspaceId ||
      !projectName ||
      !estimatedCost ||
      !forecastedCost ||
      !startDate ||
      !endDate ||
      !confidence
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db
      .insert(costForecasts)
      .values({
        workspaceId: parseInt(workspaceId),
        projectName,
        estimatedCost,
        actualCost,
        forecastedCost,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        confidence,
        notes,
        createdBy: user.id,
      })
      .returning()
      .execute();

    return NextResponse.json({
      message: "Cost forecast created successfully",
      forecast: result[0],
    });
  } catch (error) {
    console.error("Error creating cost forecast:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
