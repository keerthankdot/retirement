"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FinancialProfile } from "@/components/financial-profile";
import {
  TrendingUp,
  Clock,
  Calculator,
  ArrowRight,
  ArrowUp,
  PieChart,
} from "lucide-react";

const tools = [
  {
    title: "Spending Smile",
    description: "See how your spending changes through Go-Go, Slow-Go, and No-Go years",
    icon: TrendingUp,
    href: "/spending-smile",
    color: "text-[#D4A853]",
    bgColor: "bg-[#D4A853]/10",
  },
  {
    title: "1,000 Healthy Weeks",
    description: "Visualize your remaining healthy, active weeks",
    icon: Clock,
    href: "/healthy-weeks",
    color: "text-[#4A7C59]",
    bgColor: "bg-[#4A7C59]/10",
  },
  {
    title: "Monte Carlo Simulator",
    description: "Run 1,000 scenarios to find your success probability",
    icon: Calculator,
    href: "/retirement",
    color: "text-[#4A7C59]",
    bgColor: "bg-[#4A7C59]/10",
  },
];

export default function PlanPage() {
  const scrollToProfile = () => {
    document.getElementById("financial-profile")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAF6F1]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#E0D8CC] bg-[#FAF6F1]/95 backdrop-blur supports-[backdrop-filter]:bg-[#FAF6F1]/60">
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
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-extrabold text-[#2C3E2D]">
              Your Retirement Roadmap
            </h1>
            <p className="text-[#6B7B6E] mt-2 leading-relaxed">
              &ldquo;Let&apos;s start with what you know. The more complete your picture,
              the more accurate your projections will be.&rdquo; — Azul
            </p>
          </div>

          {/* Financial Profile (Accordion Sections) */}
          <FinancialProfile />

          {/* Divider with Azul Quote */}
          <div className="my-8 text-center">
            <div className="inline-block px-6 py-3 bg-[#D4A853]/10 rounded-full border border-[#D4A853]/20">
              <p className="text-sm text-[#8B6F47] italic">
                &ldquo;Now that we see the whole picture, let&apos;s explore what&apos;s possible.&rdquo;
              </p>
            </div>
          </div>

          {/* Tool Cards */}
          <div className="mb-8">
            <h2 className="font-serif text-xl font-bold text-[#2C3E2D] mb-4">
              Your Tools
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.title}
                    href={tool.href}
                    className="group relative rounded-2xl border border-[#E0D8CC] bg-white p-6 hover:border-[#4A7C59]/30 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${tool.bgColor}`}>
                        <Icon className={`h-6 w-6 ${tool.color}`} />
                      </div>
                      <ArrowRight className="h-5 w-5 text-[#9CA89E] group-hover:text-[#4A7C59] group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#2C3E2D] group-hover:text-[#4A7C59] transition-colors mb-1">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-[#6B7B6E] leading-relaxed">
                      {tool.description}
                    </p>
                  </Link>
                );
              })}

              {/* Your Complete Picture Card - Scrolls to profile */}
              <button
                onClick={scrollToProfile}
                className="group relative rounded-2xl border border-[#E0D8CC] bg-white p-6 hover:border-[#4A7C59]/30 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#2C3E2D]/10">
                    <PieChart className="h-6 w-6 text-[#2C3E2D]" />
                  </div>
                  <ArrowUp className="h-5 w-5 text-[#9CA89E] group-hover:text-[#4A7C59] group-hover:-translate-y-1 transition-all" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#2C3E2D] group-hover:text-[#4A7C59] transition-colors mb-1">
                  Your Complete Picture
                </h3>
                <p className="text-sm text-[#6B7B6E] leading-relaxed">
                  Income, expenses, assets, Social Security — all in one place
                </p>
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-[#2C3E2D] rounded-2xl p-6 text-center">
            <h3 className="font-serif text-xl font-bold text-white mb-2">
              Ready to see your roadmap?
            </h3>
            <p className="text-sm text-[#FAF6F1]/70 mb-4">
              Run the Monte Carlo simulation to see your retirement success probability.
            </p>
            <Button className="bg-[#D4A853] hover:bg-[#C4984A] text-white" asChild>
              <Link href="/retirement">
                Run Simulation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E0D8CC] py-8 bg-[#F2ECE0] mt-12">
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
                Monte Carlo
              </Link>
              <Link href="/spending-smile" className="hover:text-foreground transition-colors">
                Spending Smile
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
