import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

interface RouteParams {
  params: Promise<{ planId: string }>;
}

// GET /api/plans/[planId] - Get a specific plan
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { planId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plan = await prisma.financialPlan.findFirst({
      where: {
        id: planId,
        userId: session.user.id,
      },
      include: {
        incomes: { orderBy: { createdAt: "desc" } },
        expenses: { orderBy: { createdAt: "desc" } },
        assets: { orderBy: { createdAt: "desc" } },
        debts: { orderBy: { createdAt: "desc" } },
        realEstateProperties: { orderBy: { createdAt: "desc" } },
        socialSecurityBenefits: true,
        pensions: true,
        annuities: true,
        insurances: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: plan });
  } catch (error) {
    console.error("Error fetching plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/plans/[planId] - Update a plan
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { planId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const existingPlan = await prisma.financialPlan.findFirst({
      where: {
        id: planId,
        userId: session.user.id,
      },
    });

    if (!existingPlan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      name,
      currentAge,
      retirementAge,
      lifeExpectancy,
      state,
      filingStatus,
      inflationAssumption,
      isActive,
    } = body;

    const plan = await prisma.financialPlan.update({
      where: { id: planId },
      data: {
        name,
        currentAge,
        retirementAge,
        lifeExpectancy,
        state,
        filingStatus,
        inflationAssumption,
        isActive,
      },
    });

    return NextResponse.json({ success: true, data: plan });
  } catch (error) {
    console.error("Error updating plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/plans/[planId] - Delete a plan
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { planId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const existingPlan = await prisma.financialPlan.findFirst({
      where: {
        id: planId,
        userId: session.user.id,
      },
    });

    if (!existingPlan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    await prisma.financialPlan.delete({
      where: { id: planId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
