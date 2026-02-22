"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  CreditCard,
  Target,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";

// Mock data - will be replaced with real data from API
const summaryData = {
  netWorth: 450000,
  netWorthChange: 12500,
  netWorthChangePercent: 2.86,
  totalAssets: 520000,
  totalDebts: 70000,
  monthlyIncome: 12500,
  monthlyExpenses: 8200,
  monthlySavings: 4300,
  retirementReadiness: 72,
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s your financial overview.
          </p>
        </div>
        <Button asChild>
          <Link href="/plan">
            <Plus className="mr-2 h-4 w-4" />
            Add Data
          </Link>
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summaryData.netWorth)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {summaryData.netWorthChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span
                className={
                  summaryData.netWorthChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {summaryData.netWorthChange >= 0 ? "+" : ""}
                {formatCurrency(summaryData.netWorthChange)} (
                {summaryData.netWorthChangePercent}%)
              </span>
              <span className="text-muted-foreground">this month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summaryData.totalAssets)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debts</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(summaryData.totalDebts)}
            </div>
            <p className="text-xs text-muted-foreground">
              Mortgage, loans, credit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Retirement Readiness
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryData.retirementReadiness}%
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${summaryData.retirementReadiness}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Cash Flow */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Monthly Cash Flow</CardTitle>
            <CardDescription>
              Your income and expenses this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Income</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(summaryData.monthlyIncome)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Monthly Savings</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(summaryData.monthlySavings)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Monthly Expenses</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(summaryData.monthlyExpenses)}
                </p>
              </div>
            </div>
            <div className="h-4 rounded-full bg-muted overflow-hidden flex">
              <div
                className="h-full bg-green-500"
                style={{
                  width: `${
                    (summaryData.monthlySavings / summaryData.monthlyIncome) *
                    100
                  }%`,
                }}
              />
              <div
                className="h-full bg-orange-500"
                style={{
                  width: `${
                    (summaryData.monthlyExpenses / summaryData.monthlyIncome) *
                    100
                  }%`,
                }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>
                Savings rate:{" "}
                {Math.round(
                  (summaryData.monthlySavings / summaryData.monthlyIncome) * 100
                )}
                %
              </span>
              <span>
                Expense ratio:{" "}
                {Math.round(
                  (summaryData.monthlyExpenses / summaryData.monthlyIncome) *
                    100
                )}
                %
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with your plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/plan/income">
                Add income source
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/plan/assets">
                Add investment account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/retirement">
                Run retirement analysis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/what-if">
                Create scenario
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Educational Section */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Complete these steps to build your comprehensive financial plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                1
              </div>
              <div>
                <p className="font-medium">Add your income</p>
                <p className="text-sm text-muted-foreground">
                  Salary, investments, side income
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-medium">
                2
              </div>
              <div>
                <p className="font-medium">Track expenses</p>
                <p className="text-sm text-muted-foreground">
                  Monthly bills, subscriptions, spending
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-medium">
                3
              </div>
              <div>
                <p className="font-medium">Add your assets</p>
                <p className="text-sm text-muted-foreground">
                  401k, IRA, brokerage, real estate
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-medium">
                4
              </div>
              <div>
                <p className="font-medium">Run projections</p>
                <p className="text-sm text-muted-foreground">
                  Monte Carlo simulation, scenarios
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
