import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

interface RouteParams {
  params: Promise<{ planId: string }>;
}

async function verifyPlanOwnership(planId: string, userId: string) {
  return prisma.financialPlan.findFirst({
    where: { id: planId, userId },
  });
}

// GET /api/plans/[planId]/debts
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

    const debts = await prisma.debt.findMany({
      where: { planId },
      orderBy: { principalBalance: "desc" },
    });

    return NextResponse.json({ success: true, data: debts });
  } catch (error) {
    console.error("Error fetching debts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/plans/[planId]/debts
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
      principalBalance,
      interestRate,
      minimumPayment,
      startDate,
      termMonths,
      isInterestDeductible,
      notes,
    } = body;

    if (!name || !type || principalBalance === undefined || interestRate === undefined || minimumPayment === undefined) {
      return NextResponse.json(
        { error: "Name, type, principal balance, interest rate, and minimum payment are required" },
        { status: 400 }
      );
    }

    const debt = await prisma.debt.create({
      data: {
        planId,
        name,
        type,
        principalBalance,
        interestRate,
        minimumPayment,
        startDate: startDate ? new Date(startDate) : null,
        termMonths,
        isInterestDeductible: isInterestDeductible ?? false,
        notes,
      },
    });

    return NextResponse.json({ success: true, data: debt }, { status: 201 });
  } catch (error) {
    console.error("Error creating debt:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/plans/[planId]/debts
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
        { error: "Debt ID is required" },
        { status: 400 }
      );
    }

    const existingDebt = await prisma.debt.findFirst({
      where: { id, planId },
    });

    if (!existingDebt) {
      return NextResponse.json({ error: "Debt not found" }, { status: 404 });
    }

    const debt = await prisma.debt.update({
      where: { id },
      data: {
        ...updateData,
        startDate: updateData.startDate ? new Date(updateData.startDate) : undefined,
      },
    });

    return NextResponse.json({ success: true, data: debt });
  } catch (error) {
    console.error("Error updating debt:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/plans/[planId]/debts
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { planId } = await params;
    const { searchParams } = new URL(request.url);
    const debtId = searchParams.get("id");

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plan = await verifyPlanOwnership(planId, session.user.id);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    if (!debtId) {
      return NextResponse.json(
        { error: "Debt ID is required" },
        { status: 400 }
      );
    }

    const existingDebt = await prisma.debt.findFirst({
      where: { id: debtId, planId },
    });

    if (!existingDebt) {
      return NextResponse.json({ error: "Debt not found" }, { status: 404 });
    }

    await prisma.debt.delete({ where: { id: debtId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting debt:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
