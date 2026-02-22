"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  calculateHealthyWeeks,
  formatNumber,
  HEALTHY_WEEKS_QUOTES,
  AZUL_PILLARS,
  type DotData,
} from "@/lib/calculations/healthy-weeks";
import { ChevronDown, ArrowRight, Calculator, TrendingUp } from "lucide-react";

// ============================================================================
// MOVEMENT 1: THE NUMBER (The Reveal)
// ============================================================================

function TheNumberMovement({ onScrollDown }: { onScrollDown: () => void }) {
  const [count, setCount] = useState(0);
  const [showSubtext, setShowSubtext] = useState(false);
  const [showFinalText, setShowFinalText] = useState(false);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    // Delay before starting
    const startDelay = setTimeout(() => {
      const duration = 2500;
      const startTime = Date.now();
      const targetValue = 1000;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out curve
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(targetValue * easeOut));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Show subtext after counter finishes
          setTimeout(() => setShowSubtext(true), 500);
          setTimeout(() => setShowFinalText(true), 1500);
          setTimeout(() => setShowArrow(true), 2500);
        }
      };

      requestAnimationFrame(animate);
    }, 800);

    return () => clearTimeout(startDelay);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dark gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #1a2b1c 0%, #2C3E2D 50%, #3A5240 100%)",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 30% 70%, rgba(212,168,83,0.08), transparent 60%)",
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-3xl">
        <p className="text-[#FAF6F1]/70 text-xl md:text-2xl font-light mb-4">
          At 60, most of us have fewer than
        </p>

        <div
          className="font-serif text-[72px] md:text-[120px] font-extrabold leading-none mb-4"
          style={{
            color: "#D4A853",
            textShadow: `0 0 ${20 + count / 25}px rgba(212,168,83,0.3)`,
          }}
        >
          {formatNumber(count)}
        </div>

        <p
          className={`text-[#FAF6F1]/80 text-lg md:text-xl font-light transition-opacity duration-700 ${
            showSubtext ? "opacity-100" : "opacity-0"
          }`}
        >
          healthy, active weeks remaining.
        </p>

        <p
          className={`text-[#D4A853]/90 text-base md:text-lg mt-8 transition-opacity duration-700 ${
            showFinalText ? "opacity-100" : "opacity-0"
          }`}
        >
          That&apos;s it. Not years. Weeks.
        </p>

        {/* Scroll indicator */}
        <button
          onClick={onScrollDown}
          className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-opacity duration-700 ${
            showArrow ? "opacity-100" : "opacity-0"
          }`}
        >
          <ChevronDown className="h-8 w-8 text-[#D4A853]/60 animate-bounce" />
        </button>
      </div>
    </section>
  );
}

// ============================================================================
// MOVEMENT 2: YOUR NUMBER (Personalization + Dot Matrix)
// ============================================================================

interface DotMatrixProps {
  dots: DotData[];
  animationPhase: number;
  onDotHover: (dot: DotData | null) => void;
}

function DotMatrix({ dots, animationPhase, onDotHover }: DotMatrixProps) {
  // Group dots by age for row display
  const rows = useMemo(() => {
    const grouped: Record<number, DotData[]> = {};
    dots.forEach((dot) => {
      if (!grouped[dot.age]) grouped[dot.age] = [];
      grouped[dot.age].push(dot);
    });
    return Object.entries(grouped)
      .map(([age, weekDots]) => ({ age: parseInt(age), dots: weekDots }))
      .sort((a, b) => a.age - b.age);
  }, [dots]);

  const getStatusColor = (status: DotData["status"], phase: number): string => {
    // Phase 0: all faint
    // Phase 1: lived dots fill in
    // Phase 2: pause
    // Phase 3: remaining dots fill gold

    if (phase === 0) {
      return "rgba(224, 216, 204, 0.15)";
    }

    switch (status) {
      case "lived":
        return phase >= 1 ? "rgba(44, 62, 45, 0.7)" : "rgba(224, 216, 204, 0.15)";
      case "working":
        return phase >= 3 ? "rgba(232, 220, 200, 0.5)" : "rgba(224, 216, 204, 0.15)";
      case "go-go":
        return phase >= 3 ? "#D4A853" : "rgba(224, 216, 204, 0.15)";
      case "slow-go":
        return phase >= 3 ? "rgba(212, 168, 83, 0.6)" : "rgba(224, 216, 204, 0.15)";
      case "no-go":
        return phase >= 3 ? "rgba(139, 111, 71, 0.4)" : "rgba(224, 216, 204, 0.15)";
      case "post-healthy":
        return "rgba(224, 216, 204, 0.1)";
      default:
        return "rgba(224, 216, 204, 0.15)";
    }
  };

  return (
    <div className="overflow-x-auto py-4">
      <div className="min-w-[600px] md:min-w-0">
        {rows.map((row) => (
          <div key={row.age} className="flex items-center gap-1 mb-1">
            {/* Year label every 5 years */}
            <div className="w-8 text-right pr-2 flex-shrink-0">
              {row.age % 5 === 0 && (
                <span className="text-[10px] text-[#9CA89E]">{row.age}</span>
              )}
            </div>

            {/* Dots */}
            <div className="flex gap-[2px]">
              {row.dots.map((dot) => (
                <div
                  key={`${dot.age}-${dot.week}`}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    dot.isCurrent ? "ring-2 ring-[#D4A853] ring-offset-1 animate-pulse" : ""
                  }`}
                  style={{
                    backgroundColor: getStatusColor(dot.status, animationPhase),
                    transitionDelay: `${(dot.age - 20) * 20 + dot.week}ms`,
                  }}
                  onMouseEnter={() => onDotHover(dot)}
                  onMouseLeave={() => onDotHover(null)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function YourNumberMovement({
  currentAge,
  onAgeChange,
}: {
  currentAge: number;
  onAgeChange: (age: number) => void;
}) {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [hoveredDot, setHoveredDot] = useState<DotData | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const result = useMemo(
    () => calculateHealthyWeeks({ currentAge, healthyEndAge: 85 }),
    [currentAge]
  );

  // Intersection observer for animation trigger
  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true);
          // Animation sequence
          setTimeout(() => setAnimationPhase(1), 200); // Show outline
          setTimeout(() => setAnimationPhase(2), 1700); // Fill lived
          setTimeout(() => setAnimationPhase(3), 2200); // Pause
          // Phase 3 fills remaining
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className="min-h-screen py-20 bg-gradient-to-b from-[#2C3E2D] to-[#FAF6F1]">
      <div className="container max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            How many do you have left?
          </h2>
          <p className="text-[#FAF6F1]/70 text-lg">
            Enter your age. We&apos;ll do the math.
          </p>
        </div>

        {/* Age Input */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-8 mb-8 max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <Label className="text-[#FAF6F1]/80 text-lg">Your Age</Label>
            <span className="font-serif text-4xl font-bold text-[#D4A853]">{currentAge}</span>
          </div>
          <Slider
            value={[currentAge]}
            onValueChange={([v]) => onAgeChange(v)}
            min={40}
            max={80}
            step={1}
            className="[&_[role=slider]]:bg-[#D4A853] [&_[role=slider]]:border-[#D4A853]"
          />
        </div>

        {/* Weeks Remaining Display */}
        <div className="text-center mb-8">
          <div className="text-[#FAF6F1]/60 text-sm uppercase tracking-wider mb-2">
            Your Healthy Weeks Remaining
          </div>
          <div className="font-serif text-5xl md:text-7xl font-bold text-[#D4A853] mb-2">
            {formatNumber(result.weeksRemaining)}
          </div>
          <p className="text-[#FAF6F1]/50 text-sm">
            {85 - currentAge} years x 52 weeks = {formatNumber(result.weeksRemaining)} weeks until 85
          </p>
          <p className="text-[#FAF6F1]/40 text-xs mt-1">
            You&apos;ve already used {formatNumber(result.weeksLived)} of your ~{formatNumber(result.totalAdultWeeks)} adult weeks.
          </p>
        </div>

        {/* Dot Matrix */}
        <div className="bg-white rounded-2xl p-6 border border-[#E0D8CC] mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2C3E2D]">
                Your Life in Weeks
              </h3>
              <p className="text-sm text-[#6B7B6E]">
                Each dot is one week. Ages 20 to 90.
              </p>
            </div>
            {hoveredDot && (
              <div className="bg-[#2C3E2D] text-white px-3 py-2 rounded-lg text-sm">
                Week {hoveredDot.week} of age {hoveredDot.age}
                <span className="ml-2 text-[#D4A853]">({hoveredDot.status})</span>
              </div>
            )}
          </div>

          <DotMatrix
            dots={result.dotMatrix}
            animationPhase={animationPhase}
            onDotHover={setHoveredDot}
          />

          {/* Legend */}
          <div className="flex flex-wrap gap-4 justify-center mt-4 text-xs text-[#6B7B6E]">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#2C3E2D]/70" />
              <span>Lived</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#D4A853]" />
              <span>Go-Go (Active)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#D4A853]/60" />
              <span>Slow-Go</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#8B6F47]/40" />
              <span>No-Go</span>
            </div>
          </div>
        </div>

        {/* Azul Quote */}
        <div className="bg-[#D4A853]/10 rounded-2xl p-6 border border-[#D4A853]/20 max-w-2xl mx-auto">
          <p className="font-serif text-lg text-[#2C3E2D] italic text-center">
            &ldquo;{HEALTHY_WEEKS_QUOTES.time}&rdquo;
          </p>
          <p className="text-center mt-2 text-[#D4A853] font-semibold">— Azul</p>
        </div>

        <p className="text-center text-[#6B7B6E] mt-8">
          But here&apos;s the real question...
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// MOVEMENT 3: THE COST OF WAITING
// ============================================================================

function CostOfWaitingMovement({
  currentAge,
  earlyRetireAge,
  lateRetireAge,
  onEarlyAgeChange,
  onLateAgeChange,
}: {
  currentAge: number;
  earlyRetireAge: number;
  lateRetireAge: number;
  onEarlyAgeChange: (age: number) => void;
  onLateAgeChange: (age: number) => void;
}) {
  const earlyResult = useMemo(
    () => calculateHealthyWeeks({ currentAge, retireAge: earlyRetireAge, healthyEndAge: 85 }),
    [currentAge, earlyRetireAge]
  );

  const lateResult = useMemo(
    () => calculateHealthyWeeks({ currentAge, retireAge: lateRetireAge, healthyEndAge: 85 }),
    [currentAge, lateRetireAge]
  );

  const weeksLost = (lateRetireAge - earlyRetireAge) * 52;

  return (
    <section className="min-h-screen py-20 bg-[#FAF6F1]">
      <div className="container max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2C3E2D] mb-4">
            What Does &ldquo;One More Year&rdquo; Actually Cost?
          </h2>
          <p className="text-[#6B7B6E] text-lg max-w-2xl mx-auto">
            Every year you delay retirement, you trade 52 healthy weeks for money you might not need.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Early Retirement */}
          <div className="bg-white rounded-2xl p-6 border-2 border-[#4A7C59]/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-xl font-bold text-[#2C3E2D]">
                Retire at {earlyRetireAge}
              </h3>
              <span className="text-[#4A7C59] text-sm font-medium">Earlier</span>
            </div>
            <Slider
              value={[earlyRetireAge]}
              onValueChange={([v]) => onEarlyAgeChange(Math.min(v, lateRetireAge - 1))}
              min={Math.max(currentAge, 50)}
              max={75}
              step={1}
              className="mb-6 [&_[role=slider]]:bg-[#4A7C59]"
            />
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#6B7B6E]">Healthy retirement weeks:</span>
                <span className="font-bold text-[#4A7C59]">
                  {formatNumber(earlyResult.retirement?.healthyRetirementWeeks || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7B6E]">Go-Go weeks:</span>
                <span className="font-semibold text-[#D4A853]">
                  {formatNumber(earlyResult.retirement?.goGoWeeks || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7B6E]">Slow-Go weeks:</span>
                <span className="text-[#8B6F47]">
                  {formatNumber(earlyResult.retirement?.slowGoWeeks || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Late Retirement */}
          <div className="bg-white rounded-2xl p-6 border-2 border-[#C45B4A]/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-xl font-bold text-[#2C3E2D]">
                Retire at {lateRetireAge}
              </h3>
              <span className="text-[#C45B4A] text-sm font-medium">Later</span>
            </div>
            <Slider
              value={[lateRetireAge]}
              onValueChange={([v]) => onLateAgeChange(Math.max(v, earlyRetireAge + 1))}
              min={Math.max(currentAge, 50)}
              max={75}
              step={1}
              className="mb-6 [&_[role=slider]]:bg-[#C45B4A]"
            />
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#6B7B6E]">Healthy retirement weeks:</span>
                <span className="font-bold text-[#C45B4A]">
                  {formatNumber(lateResult.retirement?.healthyRetirementWeeks || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7B6E]">Go-Go weeks:</span>
                <span className="font-semibold text-[#D4A853]">
                  {formatNumber(lateResult.retirement?.goGoWeeks || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7B6E]">Slow-Go weeks:</span>
                <span className="text-[#8B6F47]">
                  {formatNumber(lateResult.retirement?.slowGoWeeks || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* The Punch - Weeks Lost */}
        <div className="bg-[#C45B4A]/10 rounded-2xl p-8 text-center border border-[#C45B4A]/20 mb-12">
          <p className="text-[#8B6F47] mb-2">
            By waiting {lateRetireAge - earlyRetireAge} years, you lose:
          </p>
          <div className="font-serif text-5xl md:text-6xl font-bold text-[#C45B4A] mb-4">
            {formatNumber(weeksLost)}
          </div>
          <p className="text-[#6B7B6E] text-lg">weeks</p>

          <div className="mt-6 space-y-1 text-[#6B7B6E]">
            <p>That&apos;s {formatNumber(weeksLost)} Saturdays.</p>
            <p>{formatNumber(weeksLost)} mornings waking up without an alarm.</p>
            <p>{formatNumber(weeksLost)} weeks of The Youth of Your Senior Years.</p>
          </div>

          {/* Lost weeks mini-grid */}
          <div className="mt-6 flex flex-wrap justify-center gap-[2px] max-w-md mx-auto">
            {Array.from({ length: Math.min(weeksLost, 260) }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-[#C45B4A]/60"
                style={{ animationDelay: `${i * 10}ms` }}
              />
            ))}
          </div>
          {weeksLost > 260 && (
            <p className="text-xs text-[#9CA89E] mt-2">
              (showing 260 of {formatNumber(weeksLost)} weeks)
            </p>
          )}
        </div>

        {/* Pillar Cards */}
        <div className="mb-12">
          <h3 className="font-serif text-xl font-bold text-[#2C3E2D] text-center mb-6">
            What would you do with {formatNumber(weeksLost)} extra weeks?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {AZUL_PILLARS.map((pillar) => (
              <div
                key={pillar.name}
                className="bg-white rounded-xl p-4 border border-[#E0D8CC] text-center"
              >
                <div className="text-2xl mb-2">{pillar.icon}</div>
                <div className="font-semibold text-[#2C3E2D] text-sm mb-1">{pillar.name}</div>
                <p className="text-xs text-[#6B7B6E] leading-relaxed">
                  {pillar.description(weeksLost)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Azul Quote */}
        <div className="bg-[#2C3E2D] rounded-2xl p-8 text-center">
          <p className="font-serif text-lg text-[#FAF6F1]/90 italic max-w-xl mx-auto">
            &ldquo;{HEALTHY_WEEKS_QUOTES.waiting}&rdquo;
          </p>
          <p className="text-[#D4A853] font-semibold mt-4">— Azul</p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MOVEMENT 4: YOUR COUNTDOWN
// ============================================================================

function YourCountdownMovement({
  currentAge,
  targetRetireAge,
  onTargetAgeChange,
}: {
  currentAge: number;
  targetRetireAge: number;
  onTargetAgeChange: (age: number) => void;
}) {
  const [countdownNumber, setCountdownNumber] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const result = useMemo(
    () => calculateHealthyWeeks({ currentAge, retireAge: targetRetireAge, healthyEndAge: 85 }),
    [currentAge, targetRetireAge]
  );

  const weeksUntil = result.retirement?.weeksUntilRetirement || 0;
  const healthyWeeks = result.retirement?.healthyRetirementWeeks || 0;

  // Animate countdown number
  useEffect(() => {
    if (!hasAnimated) return;

    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCountdownNumber(Math.round(weeksUntil * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [hasAnimated, weeksUntil]);

  // Intersection observer
  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "azul-healthy-weeks",
        JSON.stringify({
          currentAge,
          targetRetirementAge: targetRetireAge,
          healthyWeeksRemaining: result.weeksRemaining,
          timestamp: Date.now(),
        })
      );
    }
  }, [currentAge, targetRetireAge, result.weeksRemaining]);

  return (
    <section ref={sectionRef} className="min-h-screen py-20 bg-[#FAF6F1]">
      <div className="container max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2C3E2D] mb-4">
            Your Weekly Countdown Starts Now
          </h2>
        </div>

        {/* Target Age Input */}
        <div className="bg-white rounded-2xl p-8 border border-[#E0D8CC] mb-8 max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <Label className="text-[#6B7B6E] text-lg">Target Retirement Age</Label>
            <span className="font-serif text-3xl font-bold text-[#4A7C59]">{targetRetireAge}</span>
          </div>
          <Slider
            value={[targetRetireAge]}
            onValueChange={([v]) => onTargetAgeChange(v)}
            min={Math.max(currentAge, 50)}
            max={75}
            step={1}
            className="[&_[role=slider]]:bg-[#4A7C59]"
          />
        </div>

        {/* Countdown Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-8 border border-[#E0D8CC] text-center">
            <div className="text-[11px] uppercase tracking-wider text-[#9CA89E] mb-2">
              Weeks Until Retirement
            </div>
            <div className="font-serif text-5xl font-bold text-[#D4A853]">
              {formatNumber(countdownNumber)}
            </div>
            <p className="text-sm text-[#6B7B6E] mt-2">
              {result.countdown?.yearsUntil} years, {result.countdown?.monthsUntil && result.countdown.monthsUntil % 12} months
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-[#E0D8CC] text-center">
            <div className="text-[11px] uppercase tracking-wider text-[#9CA89E] mb-2">
              Healthy Weeks of Retirement
            </div>
            <div className="font-serif text-5xl font-bold text-[#4A7C59]">
              {formatNumber(healthyWeeks)}
            </div>
            <p className="text-sm text-[#6B7B6E] mt-2">
              {85 - targetRetireAge} years of healthy, active time
            </p>
          </div>
        </div>

        {/* Milestones */}
        {result.countdown && (
          <div className="bg-white rounded-2xl p-6 border border-[#E0D8CC] mb-8">
            <h3 className="font-serif font-bold text-[#2C3E2D] mb-4">Your Milestones</h3>
            <div className="space-y-3">
              {result.countdown.milestones.map((milestone, i) => (
                <div
                  key={milestone.label}
                  className="flex items-center justify-between py-2 border-b border-[#E0D8CC] last:border-0"
                  style={{ animationDelay: `${i * 200}ms` }}
                >
                  <div>
                    <div className="font-medium text-[#2C3E2D]">{milestone.label}</div>
                    <div className="text-sm text-[#6B7B6E]">{milestone.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-serif font-bold text-[#D4A853]">
                      {formatNumber(milestone.weeksFromNow)}
                    </div>
                    <div className="text-xs text-[#9CA89E]">weeks</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* This Week Panel */}
        <div
          className="rounded-2xl p-8 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1a2b1c, #2C3E2D, #3A5240)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(212,168,83,0.1), transparent 70%)",
            }}
          />
          <div className="relative z-10">
            <p className="text-[#FAF6F1]/60 text-sm mb-1">
              This is week {formatNumber(result.currentWeekNumber)} of your life.
            </p>
            <p className="text-[#FAF6F1]/80 text-lg mb-1">
              You have <span className="text-[#D4A853] font-bold">{formatNumber(result.weeksRemaining)}</span> healthy weeks left.
            </p>
            <p className="text-[#FAF6F1]/60 text-sm mb-4">
              Next week, that number will be {formatNumber(result.weeksRemaining - 1)}.
            </p>
            <p className="font-serif text-xl text-[#D4A853] italic">
              Make this one count.
            </p>
          </div>
        </div>

        {/* Azul Quote */}
        <div className="mt-8 text-center">
          <p className="font-serif text-lg text-[#8B6F47] italic">
            &ldquo;{HEALTHY_WEEKS_QUOTES.countdown}&rdquo;
          </p>
          <p className="text-[#D4A853] font-semibold mt-2">— Azul</p>
        </div>

        {/* CTAs */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-[#4A7C59] hover:bg-[#3A6B49]">
            <Link href="/retirement">
              <Calculator className="mr-2 h-4 w-4" />
              Can I afford to retire? Run a simulation
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-[#D4A853] text-[#D4A853]">
            <Link href="/spending-smile">
              <TrendingUp className="mr-2 h-4 w-4" />
              See my Spending Smile
            </Link>
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-[#9CA89E] mt-12 max-w-xl mx-auto">
          Life expectancy estimates are based on general averages. Individual health outcomes vary.
          We use age 85 as the end of your healthy, active years — not because life ends,
          but because these are the years you&apos;re most likely to be active, independent, and free.
          This tool is for educational purposes only.
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function HealthyWeeksPage() {
  const [currentAge, setCurrentAge] = useState(55);
  const [earlyRetireAge, setEarlyRetireAge] = useState(60);
  const [lateRetireAge, setLateRetireAge] = useState(65);
  const [targetRetireAge, setTargetRetireAge] = useState(62);
  const [showNav, setShowNav] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const movement2Ref = useRef<HTMLDivElement>(null);

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("azul-healthy-weeks");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.currentAge) setCurrentAge(parsed.currentAge);
          if (parsed.targetRetirementAge) setTargetRetireAge(parsed.targetRetirementAge);
        } catch (e) {
          // Ignore
        }
      }
    }
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);

      // Show nav after scrolling past first section
      setShowNav(scrollTop > window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToMovement2 = useCallback(() => {
    movement2Ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Keep retire ages in sync with current age
  useEffect(() => {
    if (earlyRetireAge <= currentAge) {
      setEarlyRetireAge(currentAge + 1);
    }
    if (lateRetireAge <= earlyRetireAge) {
      setLateRetireAge(earlyRetireAge + 1);
    }
    if (targetRetireAge <= currentAge) {
      setTargetRetireAge(currentAge + 1);
    }
  }, [currentAge, earlyRetireAge, lateRetireAge, targetRetireAge]);

  return (
    <div className="min-h-screen bg-[#FAF6F1]">
      {/* Progress Bar */}
      <div
        className={`fixed top-0 left-0 h-1 bg-[#D4A853] z-50 transition-opacity duration-300 ${
          showNav ? "opacity-100" : "opacity-0"
        }`}
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Nav Bar (appears after Movement 1) */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          showNav ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
        }`}
      >
        <div className="bg-[#FAF6F1]/95 backdrop-blur border-b border-[#E0D8CC]">
          <div className="container flex h-14 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-lg bg-[#2C3E2D] flex items-center justify-center">
                <span className="text-sm font-bold text-[#D4A853]">A</span>
              </div>
              <span className="text-lg font-serif font-bold text-[#2C3E2D]">Azul Wells</span>
            </Link>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Movement 1: The Number */}
      <TheNumberMovement onScrollDown={scrollToMovement2} />

      {/* Movement 2: Your Number */}
      <div ref={movement2Ref}>
        <YourNumberMovement currentAge={currentAge} onAgeChange={setCurrentAge} />
      </div>

      {/* Movement 3: Cost of Waiting */}
      <CostOfWaitingMovement
        currentAge={currentAge}
        earlyRetireAge={earlyRetireAge}
        lateRetireAge={lateRetireAge}
        onEarlyAgeChange={setEarlyRetireAge}
        onLateAgeChange={setLateRetireAge}
      />

      {/* Movement 4: Your Countdown */}
      <YourCountdownMovement
        currentAge={currentAge}
        targetRetireAge={targetRetireAge}
        onTargetAgeChange={setTargetRetireAge}
      />

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
              Do NOT waste the Youth of Your Senior Years.
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
