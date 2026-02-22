import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RetirementCalculator } from "@/components/retirement/RetirementCalculator";
import { Calculator } from "lucide-react";

export default function RetirementPage() {
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
        <div className="max-w-[680px] mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#4A7C59]/10">
                <Calculator className="h-5 w-5 text-[#4A7C59]" />
              </div>
              <h1 className="font-serif text-3xl font-extrabold text-[#2C3E2D]">Monte Carlo Simulator</h1>
            </div>
            <p className="text-[#6B7B6E] leading-relaxed">
              Run 1,000 market scenarios to calculate your retirement success probability.
              Enter your details below and see your personalized roadmap.
            </p>
          </div>
          <RetirementCalculator />
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
              <Link href="/about" className="hover:text-foreground transition-colors">
                About
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
