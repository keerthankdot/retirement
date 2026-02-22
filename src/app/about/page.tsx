import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const principles = [
  {
    title: "Fee-Only Means No Conflicts",
    description: "Fee-only advisors are paid directly by you, not by commissions from products they sell. This means their advice is always in your best interest.",
  },
  {
    title: "Retire Sooner, Not Richer",
    description: "The goal isn't to die with the biggest pile of money. It's to enjoy your healthy years while you have them. The math often supports retiring earlier than you think.",
  },
  {
    title: "The Spending Smile Is Real",
    description: "Retirement spending follows a predictable pattern: high in the Go-Go years, lower in Slow-Go, then rising again for healthcare in No-Go years.",
  },
  {
    title: "Time > Money",
    description: "You have roughly 1,000 healthy weeks after 65. No amount of extra savings can buy back time you've lost waiting 'one more year.'",
  },
  {
    title: "Plain English, Not Jargon",
    description: "Financial planning shouldn't require a dictionary. If you can't explain it simply, you don't understand it well enough.",
  },
  {
    title: "Education First",
    description: "This tool is educational — it helps you understand your options and ask better questions. For personalized advice, work with a qualified fee-only advisor.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
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
              <Link href="/register">Start Planning</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-[#F2ECE0] to-background">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-4xl font-extrabold tracking-tight sm:text-5xl text-[#2C3E2D]">
                The Fee-Only Philosophy
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                This tool is built on Azul Wells&apos; approach to retirement planning:
                honest math, plain English, and no products to sell.
              </p>
            </div>
          </div>
        </section>

        {/* Quote */}
        <section className="py-12">
          <div className="container">
            <div className="mx-auto max-w-2xl">
              <div className="rounded-2xl bg-[#D4A853]/10 border-2 border-[#D4A853]/25 p-8 text-center">
                <p className="text-xl italic text-[#8B6F47] leading-relaxed font-serif">
                  &quot;Do NOT waste the Youth of Your Senior Years.&quot;™
                </p>
                <p className="mt-4 font-semibold text-[#2C3E2D]">— Azul Wells</p>
              </div>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-serif text-3xl font-bold text-[#2C3E2D] text-center mb-12">
                Core Principles
              </h2>
              <div className="space-y-8">
                {principles.map((principle, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-6 w-6 text-[#4A7C59]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#2C3E2D] mb-2">
                        {principle.title}
                      </h3>
                      <p className="text-[#6B7B6E] leading-relaxed">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-12 bg-[#F2ECE0]">
          <div className="container">
            <div className="mx-auto max-w-2xl">
              <div className="rounded-xl p-6 border border-[#E8DCC8]">
                <div className="flex gap-3">
                  <span className="text-lg">📋</span>
                  <div>
                    <h3 className="font-semibold text-[#2C3E2D] mb-2">Educational Disclaimer</h3>
                    <p className="text-sm text-[#8B6F47] leading-relaxed">
                      This tool provides general estimates for educational purposes only.
                      It does not constitute financial, tax, or legal advice.
                      The projections shown are based on historical data and assumptions
                      that may not reflect future results. For personalized planning,
                      consult a qualified fee-only financial advisor.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container">
            <div className="dark-panel rounded-2xl p-12 text-center overflow-hidden">
              <div className="relative z-10 mx-auto max-w-2xl">
                <h2 className="font-serif text-3xl font-bold text-white">
                  Ready to See Your Numbers?
                </h2>
                <p className="mt-4 text-lg text-[#FAF6F1]/80">
                  Build your retirement roadmap in 5 minutes — free.
                </p>
                <div className="mt-8">
                  <Button size="lg" className="bg-[#D4A853] hover:bg-[#B8912E] text-[#2C3E2D] font-semibold" asChild>
                    <Link href="/retirement">
                      Start Your Roadmap
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-[#F2ECE0]">
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
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
