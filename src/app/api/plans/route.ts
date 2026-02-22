import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

// GET /api/plans - Get all plans for current user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plans = await prisma.financialPlan.findMany({
      where: { userId: session.user.id },
      include: {
        incomes: true,
        expenses: true,
        assets: true,
        debts: true,
        _count: {
          select: {
            incomes: true,
            expenses: true,
            assets: true,
            debts: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, data: plans });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/plans - Create a new plan
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    } = body;

    const plan = await prisma.financialPlan.create({
      data: {
        userId: session.user.id,
        name: name || "My Financial Plan",
        currentAge,
        retirementAge,
        lifeExpectancy,
        state,
        filingStatus,
        inflationAssumption,
      },
    });

    return NextResponse.json({ success: true, data: plan }, { status: 201 });
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
