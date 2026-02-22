import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

interface RouteParams {
  params: Promise<{ planId: string }>;
}

// Helper to verify plan ownership
async function verifyPlanOwnership(planId: string, userId: string) {
  const plan = await prisma.financialPlan.findFirst({
    where: { id: planId, userId },
  });
  return plan;
}

// GET /api/plans/[planId]/income - Get all income sources
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { planId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plan = await verifyPlanOwnership(planId, session.user.id);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const incomes = await prisma.income.findMany({
      where: { planId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: incomes });
  } catch (error) {
    console.error("Error fetching incomes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/plans/[planId]/income - Create a new income source
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { planId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plan = await verifyPlanOwnership(planId, session.user.id);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      name,
      type,
      amount,
      frequency,
      startDate,
      endDate,
      growthRate,
      isTaxable,
      taxCategory,
      notes,
    } = body;

    if (!name || !type || amount === undefined) {
      return NextResponse.json(
        { error: "Name, type, and amount are required" },
        { status: 400 }
      );
    }

    const income = await prisma.income.create({
      data: {
        planId,
        name,
        type,
        amount,
        frequency: frequency || "MONTHLY",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        growthRate: growthRate || 0,
        isTaxable: isTaxable ?? true,
        taxCategory: taxCategory || "ORDINARY_INCOME",
        notes,
      },
    });

    return NextResponse.json({ success: true, data: income }, { status: 201 });
  } catch (error) {
    console.error("Error creating income:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/plans/[planId]/income - Update an income source (with incomeId in body)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { planId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plan = await verifyPlanOwnership(planId, session.user.id);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Income ID is required" },
        { status: 400 }
      );
    }

    // Verify income belongs to this plan
    const existingIncome = await prisma.income.findFirst({
      where: { id, planId },
    });

    if (!existingIncome) {
      return NextResponse.json({ error: "Income not found" }, { status: 404 });
    }

    const income = await prisma.income.update({
      where: { id },
      data: {
        ...updateData,
        startDate: updateData.startDate ? new Date(updateData.startDate) : undefined,
        endDate: updateData.endDate ? new Date(updateData.endDate) : undefined,
      },
    });

    return NextResponse.json({ success: true, data: income });
  } catch (error) {
    console.error("Error updating income:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/plans/[planId]/income - Delete an income source (with incomeId in query)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { planId } = await params;
    const { searchParams } = new URL(request.url);
    const incomeId = searchParams.get("id");

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plan = await verifyPlanOwnership(planId, session.user.id);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    if (!incomeId) {
      return NextResponse.json(
        { error: "Income ID is required" },
        { status: 400 }
      );
    }

    // Verify income belongs to this plan
    const existingIncome = await prisma.income.findFirst({
      where: { id: incomeId, planId },
    });

    if (!existingIncome) {
      return NextResponse.json({ error: "Income not found" }, { status: 404 });
    }

    await prisma.income.delete({ where: { id: incomeId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting income:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
