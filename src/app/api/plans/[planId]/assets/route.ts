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

// GET /api/plans/[planId]/assets
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

    const assets = await prisma.asset.findMany({
      where: { planId },
      orderBy: { currentValue: "desc" },
    });

    return NextResponse.json({ success: true, data: assets });
  } catch (error) {
    console.error("Error fetching assets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/plans/[planId]/assets
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
      currentValue,
      purchaseDate,
      costBasis,
      expectedReturn,
      volatility,
      accountType,
      contributions,
      employerMatch,
      stockAllocation,
      bondAllocation,
      cashAllocation,
      notes,
    } = body;

    if (!name || !type || currentValue === undefined) {
      return NextResponse.json(
        { error: "Name, type, and current value are required" },
        { status: 400 }
      );
    }

    const asset = await prisma.asset.create({
      data: {
        planId,
        name,
        type,
        currentValue,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        costBasis,
        expectedReturn: expectedReturn ?? 7,
        volatility,
        accountType,
        contributions,
        employerMatch,
        stockAllocation: stockAllocation ?? 60,
        bondAllocation: bondAllocation ?? 30,
        cashAllocation: cashAllocation ?? 10,
        notes,
      },
    });

    return NextResponse.json({ success: true, data: asset }, { status: 201 });
  } catch (error) {
    console.error("Error creating asset:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/plans/[planId]/assets
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
        { error: "Asset ID is required" },
        { status: 400 }
      );
    }

    const existingAsset = await prisma.asset.findFirst({
      where: { id, planId },
    });

    if (!existingAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const asset = await prisma.asset.update({
      where: { id },
      data: {
        ...updateData,
        purchaseDate: updateData.purchaseDate ? new Date(updateData.purchaseDate) : undefined,
      },
    });

    return NextResponse.json({ success: true, data: asset });
  } catch (error) {
    console.error("Error updating asset:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/plans/[planId]/assets
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { planId } = await params;
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get("id");

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plan = await verifyPlanOwnership(planId, session.user.id);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    if (!assetId) {
      return NextResponse.json(
        { error: "Asset ID is required" },
        { status: 400 }
      );
    }

    const existingAsset = await prisma.asset.findFirst({
      where: { id: assetId, planId },
    });

    if (!existingAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    await prisma.asset.delete({ where: { id: assetId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting asset:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
