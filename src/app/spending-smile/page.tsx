"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  calculateSpendingSmile,
  formatCurrency,
  getSpendingSmileQuote,
  type SpendingSmileResult,
} from "@/lib/calculations/spending-smile";
import { Smile, ChevronDown, ArrowRight, Calculator, Plane, Home, Heart } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function SpendingSmilePage() {
  const [activeSection, setActiveSection] = useState(0);
  const [revealedPhases, setRevealedPhases] = useState<number[]>([]);

  // Calculator inputs
  const [retirementAge, setRetirementAge] = useState(65);
  const [lifeExpectancy, setLifeExpectancy] = useState(95);
  const [annualSpending, setAnnualSpending] = useState(60000);
  const [inflationRate, setInflationRate] = useState(0.03);

  // Calculate results
  const result = useMemo<SpendingSmileResult>(() => {
    return calculateSpendingSmile({
      retirementAge,
      lifeExpectancy,
      initialAnnualSpending: annualSpending,
      inflationRate,
    });
  }, [retirementAge, lifeExpectancy, annualSpending, inflationRate]);

  // Animation for revealing phases
  useEffect(() => {
    if (activeSection === 0 && revealedPhases.length < 3) {
      const timer = setTimeout(() => {
        setRevealedPhases((prev) => [...prev, prev.length]);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [activeSection, revealedPhases]);

  // Load from localStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("azul_spending_inputs");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.retirementAge) setRetirementAge(parsed.retirementAge);
          if (parsed.annualSpending) setAnnualSpending(parsed.annualSpending);
        } catch (e) {
          // Ignore
        }
      }
    }
  }, []);

  // Save to localStorage for Monte Carlo handoff
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "azul_spending_inputs",
        JSON.stringify({ retirementAge, annualSpending, lifeExpectancy })
      );
    }
  }, [retirementAge, annualSpending, lifeExpectancy]);

  const scrollToSection = (index: number) => {
    setActiveSection(index);
    const sections = document.querySelectorAll("section");
    sections[index]?.scrollIntoView({ behavior: "smooth" });
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
              <Link href="/retirement">Monte Carlo Simulator</Link>
            </Button>
            <Button className="bg-[#4A7C59] hover:bg-[#3A6B49]" asChild>
              <Link href="/register">Save My Plan</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-b from-[#2C3E2D] to-[#3A5240] text-white py-16 md:py-24">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4A853]/20 mb-6">
            <Smile className="h-7 w-7 text-[#D4A853]" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            The Spending Smile
          </h1>
          <p className="text-lg md:text-xl text-[#9CA89E] max-w-2xl mx-auto mb-8">
            Discover the research-backed spending pattern that could change how you think about retirement.
          </p>
          <Button
            onClick={() => scrollToSection(0)}
            variant="outline"
            className="border-[#D4A853] text-[#D4A853] hover:bg-[#D4A853]/10"
          >
            Start the Journey <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="sticky top-16 z-40 bg-white border-b border-[#E0D8CC]">
        <div className="container">
          <div className="flex justify-center gap-8 py-3">
            {["What Is It?", "Why It Matters", "Your Smile"].map((label, i) => (
              <button
                key={label}
                onClick={() => scrollToSection(i)}
                className={`text-sm font-medium transition-colors ${
                  activeSection === i
                    ? "text-[#2C3E2D] border-b-2 border-[#D4A853]"
                    : "text-[#9CA89E] hover:text-[#6B7B6E]"
                } pb-2`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 1: What Is the Spending Smile */}
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2C3E2D] mb-4">
              What Is the Spending Smile?
            </h2>
            <p className="text-[#6B7B6E] text-lg max-w-2xl mx-auto">
              Most financial plans assume you&apos;ll spend the same amount every year in retirement.
              But research shows spending follows a predictable pattern—shaped like a smile.
            </p>
          </div>

          {/* Quote */}
          <div className="bg-[#D4A853]/10 rounded-2xl p-6 mb-12 border border-[#D4A853]/20">
            <p className="font-serif text-lg text-[#2C3E2D] italic text-center">
              &ldquo;{getSpendingSmileQuote("intro")?.quote}&rdquo;
            </p>
          </div>

          {/* Animated Smile Curve */}
          <div className="bg-white rounded-2xl p-8 border border-[#E0D8CC] mb-12">
            <svg viewBox="0 0 400 140" className="w-full h-[180px]">
              {/* Grid */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1={20}
                  y1={20 + i * 25}
                  x2={380}
                  y2={20 + i * 25}
                  stroke="#E0D8CC"
                  strokeWidth={0.5}
                  strokeDasharray="4,4"
                />
              ))}

              {/* Flat line comparison */}
              <line
                x1={20}
                y1={60}
                x2={380}
                y2={60}
                stroke="#C45B4A"
                strokeWidth={1.5}
                strokeDasharray="6,4"
                opacity={0.5}
              />
              <text x={390} y={64} fill="#C45B4A" fontSize="9" opacity={0.7}>
                Flat assumption
              </text>

              {/* The smile curve */}
              <path
                d="M 20,40 C 60,40 80,45 120,55 C 160,68 180,90 200,95 C 220,90 240,68 280,55 C 320,45 340,40 380,38"
                fill="none"
                stroke="#D4A853"
                strokeWidth={3}
                strokeLinecap="round"
                className="transition-all duration-1000"
                style={{
                  strokeDasharray: 600,
                  strokeDashoffset: revealedPhases.length === 3 ? 0 : 600,
                }}
              />

              {/* Area fill */}
              <path
                d="M 20,40 C 60,40 80,45 120,55 C 160,68 180,90 200,95 C 220,90 240,68 280,55 C 320,45 340,40 380,38 L 380,120 L 20,120 Z"
                fill="url(#smileGradient)"
                className="transition-opacity duration-1000"
                style={{ opacity: revealedPhases.length === 3 ? 0.2 : 0 }}
              />

              <defs>
                <linearGradient id="smileGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4A853" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#D4A853" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Phase markers */}
              {revealedPhases.includes(0) && (
                <>
                  <circle cx={70} cy={42} r={6} fill="#4A7C59" className="animate-pulse" />
                  <text x={70} y={135} textAnchor="middle" fill="#4A7C59" fontSize="11" fontWeight="600">
                    Go-Go
                  </text>
                </>
              )}
              {revealedPhases.includes(1) && (
                <>
                  <circle cx={200} cy={95} r={6} fill="#D4A853" className="animate-pulse" />
                  <text x={200} y={135} textAnchor="middle" fill="#D4A853" fontSize="11" fontWeight="600">
                    Slow-Go
                  </text>
                </>
              )}
              {revealedPhases.includes(2) && (
                <>
                  <circle cx={330} cy={40} r={6} fill="#C45B4A" className="animate-pulse" />
                  <text x={330} y={135} textAnchor="middle" fill="#C45B4A" fontSize="11" fontWeight="600">
                    No-Go
                  </text>
                </>
              )}

              {/* Phase dividers */}
              <line x1={133} y1={15} x2={133} y2={120} stroke="#E0D8CC" strokeWidth={1} strokeDasharray="3,3" />
              <line x1={267} y1={15} x2={267} y2={120} stroke="#E0D8CC" strokeWidth={1} strokeDasharray="3,3" />
            </svg>
          </div>

          {/* Phase Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Go-Go */}
            <div
              className={`bg-white rounded-2xl p-6 border-2 border-[#4A7C59]/30 transition-all duration-500 ${
                revealedPhases.includes(0) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="h-12 w-12 rounded-xl bg-[#4A7C59]/10 flex items-center justify-center mb-4">
                <Plane className="h-6 w-6 text-[#4A7C59]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2C3E2D] mb-1">Go-Go Years</h3>
              <p className="text-sm text-[#4A7C59] font-medium mb-3">Ages 65–74 • Higher Spending</p>
              <p className="text-[#6B7B6E] text-sm leading-relaxed">
                The active years. Travel, hobbies, dining out, and checking off your bucket list.
                You have the health and energy to enjoy life fully.
              </p>
              <div className="mt-4 pt-4 border-t border-[#E0D8CC]">
                <div className="text-[11px] uppercase tracking-wider text-[#9CA89E] mb-1">Typical Multiplier</div>
                <div className="font-serif text-2xl font-bold text-[#4A7C59]">105%</div>
              </div>
            </div>

            {/* Slow-Go */}
            <div
              className={`bg-white rounded-2xl p-6 border-2 border-[#D4A853]/30 transition-all duration-500 delay-300 ${
                revealedPhases.includes(1) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="h-12 w-12 rounded-xl bg-[#D4A853]/10 flex items-center justify-center mb-4">
                <Home className="h-6 w-6 text-[#D4A853]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2C3E2D] mb-1">Slow-Go Years</h3>
              <p className="text-sm text-[#D4A853] font-medium mb-3">Ages 75–84 • Lower Spending</p>
              <p className="text-[#6B7B6E] text-sm leading-relaxed">
                A natural slowing down. More time at home, less travel, simpler pleasures.
                Your spending decreases as activity levels moderate.
              </p>
              <div className="mt-4 pt-4 border-t border-[#E0D8CC]">
                <div className="text-[11px] uppercase tracking-wider text-[#9CA89E] mb-1">Typical Multiplier</div>
                <div className="font-serif text-2xl font-bold text-[#D4A853]">80%</div>
              </div>
            </div>

            {/* No-Go */}
            <div
              className={`bg-white rounded-2xl p-6 border-2 border-[#C45B4A]/30 transition-all duration-500 delay-500 ${
                revealedPhases.includes(2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="h-12 w-12 rounded-xl bg-[#C45B4A]/10 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-[#C45B4A]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2C3E2D] mb-1">No-Go Years</h3>
              <p className="text-sm text-[#C45B4A] font-medium mb-3">Ages 85+ • Healthcare Focus</p>
              <p className="text-[#6B7B6E] text-sm leading-relaxed">
                While activity decreases, healthcare and potential long-term care costs push
                spending back up. This is why the curve &ldquo;smiles.&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-[#E0D8CC]">
                <div className="text-[11px] uppercase tracking-wider text-[#9CA89E] mb-1">Typical Multiplier</div>
                <div className="font-serif text-2xl font-bold text-[#C45B4A]">105%</div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button onClick={() => scrollToSection(1)} className="bg-[#4A7C59] hover:bg-[#3A6B49]">
              Why This Matters <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Section 2: Why This Matters */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2C3E2D] mb-4">
              Why This Matters
            </h2>
            <p className="text-[#6B7B6E] text-lg max-w-2xl mx-auto">
              The spending smile isn&apos;t just an interesting pattern—it has real implications for
              your retirement planning.
            </p>
          </div>

          {/* Research Card */}
          <div className="bg-[#F2ECE0] rounded-2xl p-8 mb-12">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-[#2C3E2D] flex items-center justify-center flex-shrink-0">
                <span className="text-[#D4A853] font-bold">📊</span>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C3E2D] mb-2">
                  Based on Real Research
                </h3>
                <p className="text-[#6B7B6E] text-sm leading-relaxed">
                  Financial researcher David Blanchett studied actual spending patterns of thousands
                  of retirees. His paper &ldquo;Estimating the True Cost of Retirement&rdquo; found that
                  real spending doesn&apos;t follow the flat line most planners assume—it follows a
                  smile-shaped curve.
                </p>
              </div>
            </div>
          </div>

          {/* Comparison Chart */}
          <div className="bg-[#FAF6F1] rounded-2xl p-8 border border-[#E0D8CC] mb-12">
            <h3 className="font-serif text-xl font-bold text-[#2C3E2D] mb-2 text-center">
              Flat vs. Smile: A 30-Year Comparison
            </h3>
            <p className="text-sm text-[#6B7B6E] text-center mb-6">
              $60,000 annual spending • Retirement at 65 • Life expectancy 95
            </p>

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={result.yearlySpending}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="smileAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4A853" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#D4A853" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#E0D8CC" vertical={false} />
                  <XAxis
                    dataKey="age"
                    stroke="#9CA89E"
                    tick={{ fill: "#9CA89E", fontSize: 11 }}
                    tickLine={false}
                    tickFormatter={(age) => (age % 5 === 0 ? age : "")}
                  />
                  <YAxis
                    stroke="#9CA89E"
                    tick={{ fill: "#9CA89E", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                    width={55}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white border border-[#E0D8CC] rounded-xl p-4 shadow-lg">
                          <div className="font-serif font-bold text-[#2C3E2D] mb-2">Age {label}</div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between gap-4">
                              <span className="text-[#D4A853]">Smile spending:</span>
                              <span className="font-semibold">{formatCurrency(d.realSpending)}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-[#C45B4A]">Flat assumption:</span>
                              <span className="font-semibold">{formatCurrency(annualSpending)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                  {/* Flat line */}
                  <ReferenceLine
                    y={annualSpending}
                    stroke="#C45B4A"
                    strokeDasharray="6 4"
                    strokeWidth={1.5}
                  />
                  {/* Smile curve */}
                  <Area
                    type="monotone"
                    dataKey="realSpending"
                    stroke="#D4A853"
                    strokeWidth={2.5}
                    fill="url(#smileAreaGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-8 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-[#D4A853] rounded" />
                <span className="text-[#6B7B6E]">Spending Smile</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0 border-t-2 border-dashed border-[#C45B4A]" />
                <span className="text-[#6B7B6E]">Flat assumption</span>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[#E8F0EA] rounded-2xl p-6">
              <h4 className="font-serif font-bold text-[#2C3E2D] mb-2">
                You might be oversaving
              </h4>
              <p className="text-[#6B7B6E] text-sm">
                If you plan for flat spending, you might be denying yourself enjoyment in your
                early retirement years—when you&apos;re healthiest and most able to enjoy it.
              </p>
            </div>
            <div className="bg-[#D4A853]/10 rounded-2xl p-6">
              <h4 className="font-serif font-bold text-[#2C3E2D] mb-2">
                Healthcare planning matters
              </h4>
              <p className="text-[#6B7B6E] text-sm">
                The &ldquo;smile&rdquo; upward at the end reminds us to plan for healthcare costs
                in later years, even as discretionary spending decreases.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button onClick={() => scrollToSection(2)} className="bg-[#D4A853] hover:bg-[#C4984A] text-white">
              Calculate Your Smile <Calculator className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Section 3: Your Spending Smile Calculator */}
      <section className="py-16 md:py-24 bg-[#FAF6F1]">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2C3E2D] mb-4">
              Your Spending Smile
            </h2>
            <p className="text-[#6B7B6E] text-lg max-w-2xl mx-auto">
              See what the spending smile looks like with your specific numbers.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Inputs */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-[#E0D8CC]">
                <h3 className="font-serif font-bold text-[#2C3E2D] mb-6">Your Details</h3>

                <div className="space-y-6">
                  {/* Retirement Age */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="text-[#6B7B6E]">Retirement Age</Label>
                      <span className="font-serif text-lg font-bold text-[#2C3E2D]">{retirementAge}</span>
                    </div>
                    <Slider
                      value={[retirementAge]}
                      onValueChange={([v]) => setRetirementAge(v)}
                      min={50}
                      max={75}
                      step={1}
                      className="[&_[role=slider]]:bg-[#4A7C59]"
                    />
                  </div>

                  {/* Life Expectancy */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="text-[#6B7B6E]">Life Expectancy</Label>
                      <span className="font-serif text-lg font-bold text-[#2C3E2D]">{lifeExpectancy}</span>
                    </div>
                    <Slider
                      value={[lifeExpectancy]}
                      onValueChange={([v]) => setLifeExpectancy(v)}
                      min={80}
                      max={100}
                      step={1}
                      className="[&_[role=slider]]:bg-[#4A7C59]"
                    />
                  </div>

                  {/* Annual Spending */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="text-[#6B7B6E]">Annual Spending (Base)</Label>
                      <span className="font-serif text-lg font-bold text-[#2C3E2D]">
                        {formatCurrency(annualSpending)}
                      </span>
                    </div>
                    <Slider
                      value={[annualSpending]}
                      onValueChange={([v]) => setAnnualSpending(v)}
                      min={30000}
                      max={200000}
                      step={5000}
                      className="[&_[role=slider]]:bg-[#D4A853]"
                    />
                  </div>

                  {/* Inflation */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="text-[#6B7B6E]">Inflation Rate</Label>
                      <span className="font-serif text-lg font-bold text-[#2C3E2D]">
                        {(inflationRate * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Slider
                      value={[inflationRate * 100]}
                      onValueChange={([v]) => setInflationRate(v / 100)}
                      min={1}
                      max={5}
                      step={0.5}
                      className="[&_[role=slider]]:bg-[#6B7B6E]"
                    />
                  </div>
                </div>
              </div>

              {/* Phase Summary */}
              <div className="bg-white rounded-2xl p-6 border border-[#E0D8CC]">
                <h3 className="font-serif font-bold text-[#2C3E2D] mb-4">Your Phases</h3>
                <div className="space-y-3">
                  {result.phases.map((phase) => (
                    <div key={phase.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{phase.icon}</span>
                        <span className="text-sm text-[#6B7B6E]">{phase.name}</span>
                      </div>
                      <span className="text-sm font-medium text-[#2C3E2D]">
                        Ages {phase.startAge}–{phase.endAge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-3 space-y-6">
              {/* Chart */}
              <div className="bg-white rounded-2xl p-6 border border-[#E0D8CC]">
                <h3 className="font-serif font-bold text-[#2C3E2D] mb-1">Your Spending Curve</h3>
                <p className="text-sm text-[#6B7B6E] mb-4">Real spending adjusted for the smile pattern</p>

                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={result.yearlySpending}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="yourSmileGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4A7C59" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#4A7C59" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" stroke="#E0D8CC" vertical={false} />
                      <XAxis
                        dataKey="age"
                        stroke="#9CA89E"
                        tick={{ fill: "#9CA89E", fontSize: 11 }}
                        tickLine={false}
                        tickFormatter={(age) => (age % 5 === 0 ? age : "")}
                      />
                      <YAxis
                        stroke="#9CA89E"
                        tick={{ fill: "#9CA89E", fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                        width={55}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload?.length) return null;
                          const d = payload[0].payload;
                          return (
                            <div className="bg-white border border-[#E0D8CC] rounded-xl p-4 shadow-lg">
                              <div className="font-serif font-bold text-[#2C3E2D] mb-2">
                                Age {label} • {d.phase}
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between gap-4">
                                  <span className="text-[#6B7B6E]">Real spending:</span>
                                  <span className="font-semibold text-[#4A7C59]">
                                    {formatCurrency(d.realSpending)}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-[#6B7B6E]">Multiplier:</span>
                                  <span className="font-semibold">{(d.multiplier * 100).toFixed(0)}%</span>
                                </div>
                              </div>
                            </div>
                          );
                        }}
                      />
                      <ReferenceLine x={retirementAge + 10} stroke="#E0D8CC" strokeDasharray="3 3" />
                      <ReferenceLine x={retirementAge + 20} stroke="#E0D8CC" strokeDasharray="3 3" />
                      <Area
                        type="monotone"
                        dataKey="realSpending"
                        stroke="#4A7C59"
                        strokeWidth={2.5}
                        fill="url(#yourSmileGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-5 border border-[#E0D8CC]">
                  <div className="text-[11px] uppercase tracking-wider text-[#9CA89E] mb-1">
                    Total Lifetime Spending
                  </div>
                  <div className="font-serif text-2xl font-bold text-[#2C3E2D]">
                    {formatCurrency(result.summary.totalRealSpending, true)}
                  </div>
                  <div className="text-xs text-[#6B7B6E] mt-1">
                    in today&apos;s dollars
                  </div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-[#E0D8CC]">
                  <div className="text-[11px] uppercase tracking-wider text-[#9CA89E] mb-1">
                    Average Annual
                  </div>
                  <div className="font-serif text-2xl font-bold text-[#2C3E2D]">
                    {formatCurrency(result.summary.averageAnnualReal, true)}
                  </div>
                  <div className="text-xs text-[#6B7B6E] mt-1">
                    per year
                  </div>
                </div>
              </div>

              {/* Comparison */}
              <div className="bg-[#E8F0EA] rounded-2xl p-6 border border-[#4A7C59]/20">
                <h4 className="font-serif font-bold text-[#2C3E2D] mb-4">
                  Smile vs. Flat Comparison
                </h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-[#9CA89E] mb-1">
                      Flat Assumption
                    </div>
                    <div className="font-serif text-xl font-bold text-[#C45B4A]">
                      {formatCurrency(result.comparison.flatTotalSpending, true)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-[#9CA89E] mb-1">
                      Smile Model
                    </div>
                    <div className="font-serif text-xl font-bold text-[#4A7C59]">
                      {formatCurrency(result.comparison.smileTotalSpending, true)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-[#9CA89E] mb-1">
                      Difference
                    </div>
                    <div className="font-serif text-xl font-bold text-[#D4A853]">
                      {result.comparison.percentDifference > 0 ? "-" : "+"}
                      {Math.abs(result.comparison.percentDifference).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-[#2C3E2D] rounded-2xl p-6 text-center">
                <h4 className="font-serif text-xl font-bold text-white mb-2">
                  Ready to run the full simulation?
                </h4>
                <p className="text-[#9CA89E] text-sm mb-4">
                  See how the spending smile affects your retirement success probability.
                </p>
                <Button asChild className="bg-[#D4A853] hover:bg-[#C4984A] text-white">
                  <Link href="/retirement">
                    Run Monte Carlo Simulation <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E0D8CC] py-8 bg-[#F2ECE0]">
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
