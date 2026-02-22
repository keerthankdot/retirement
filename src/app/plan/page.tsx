import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  TrendingUp,
  PiggyBank,
  CreditCard,
  Home,
  Shield,
  ArrowRight,
  Plus
} from "lucide-react";

const sections = [
  {
    title: "Income",
    description: "Salary, rental income, dividends, and other sources",
    icon: DollarSign,
    href: "/plan/income",
    color: "text-[#4A7C59]",
    bgColor: "bg-[#4A7C59]/10",
  },
  {
    title: "Expenses",
    description: "Track your spending by category",
    icon: CreditCard,
    href: "/plan/expenses",
    color: "text-[#D4A853]",
    bgColor: "bg-[#D4A853]/10",
  },
  {
    title: "Assets",
    description: "401(k), IRA, Roth, brokerage, savings accounts",
    icon: TrendingUp,
    href: "/plan/assets",
    color: "text-[#4A7C59]",
    bgColor: "bg-[#4A7C59]/10",
  },
  {
    title: "Debts",
    description: "Mortgage, loans, credit cards",
    icon: PiggyBank,
    href: "/plan/debts",
    color: "text-[#C45B4A]",
    bgColor: "bg-[#C45B4A]/10",
  },
  {
    title: "Real Estate",
    description: "Primary residence and rental properties",
    icon: Home,
    href: "/plan/real-estate",
    color: "text-[#8B6F47]",
    bgColor: "bg-[#8B6F47]/10",
  },
  {
    title: "Insurance",
    description: "Life, health, and long-term care coverage",
    icon: Shield,
    href: "/plan/insurance",
    color: "text-[#2C3E2D]",
    bgColor: "bg-[#2C3E2D]/10",
  },
];

export default function PlanPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-[#2C3E2D] flex items-center justify-center">
              <span className="text-lg font-bold text-[#D4A853]">A</span>
            </div>
            <span className="text-xl font-serif font-bold text-[#2C3E2D]">Azul Wells</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button className="bg-[#4A7C59] hover:bg-[#3A6B49]" asChild>
              <Link href="/register">Save My Plan</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-extrabold text-[#2C3E2D]">Your Financial Picture</h1>
            <p className="text-[#6B7B6E] mt-2 leading-relaxed">
              Everything in one place — income, expenses, assets, debts, and more. No spreadsheets needed.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="border-[#E0D8CC]">
              <CardContent className="pt-6 text-center">
                <div className="text-[11px] text-[#9CA89E] uppercase tracking-wide mb-1">Net Worth</div>
                <div className="font-serif text-2xl font-bold text-[#4A7C59]">$0</div>
              </CardContent>
            </Card>
            <Card className="border-[#E0D8CC]">
              <CardContent className="pt-6 text-center">
                <div className="text-[11px] text-[#9CA89E] uppercase tracking-wide mb-1">Monthly Income</div>
                <div className="font-serif text-2xl font-bold text-[#2C3E2D]">$0</div>
              </CardContent>
            </Card>
            <Card className="border-[#E0D8CC]">
              <CardContent className="pt-6 text-center">
                <div className="text-[11px] text-[#9CA89E] uppercase tracking-wide mb-1">Monthly Expenses</div>
                <div className="font-serif text-2xl font-bold text-[#D4A853]">$0</div>
              </CardContent>
            </Card>
          </div>

          {/* Sections Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Card key={section.title} className="border-[#E0D8CC] hover:border-[#4A7C59]/30 hover:shadow-md transition-all cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${section.bgColor}`}>
                        <Icon className={`h-5 w-5 ${section.color}`} />
                      </div>
                      <ArrowRight className="h-4 w-4 text-[#9CA89E] group-hover:text-[#4A7C59] transition-colors" />
                    </div>
                    <CardTitle className="font-serif text-lg text-[#2C3E2D] group-hover:text-[#4A7C59] transition-colors">
                      {section.title}
                    </CardTitle>
                    <CardDescription className="text-[#6B7B6E]">
                      {section.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 text-sm text-[#9CA89E]">
                      <Plus className="h-4 w-4" />
                      <span>Add {section.title.toLowerCase()}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-8 bg-[#F2ECE0] rounded-2xl p-6 border border-[#E8DCC8]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C3E2D]">Ready to see your roadmap?</h3>
                <p className="text-sm text-[#6B7B6E] mt-1">
                  Once you&apos;ve added your financial details, run the Monte Carlo simulation.
                </p>
              </div>
              <Button className="bg-[#4A7C59] hover:bg-[#3A6B49]" asChild>
                <Link href="/retirement">
                  Run Simulation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-[#F2ECE0] mt-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded bg-[#2C3E2D] flex items-center justify-center">
                <span className="text-xs font-bold text-[#D4A853]">A</span>
              </div>
              <span className="font-serif font-semibold text-[#2C3E2D]">Azul Wells</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Educational retirement planning tools. Not investment advice.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/retirement" className="hover:text-foreground transition-colors">
                Calculator
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
