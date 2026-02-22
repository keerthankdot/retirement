"use client";

import { formatCurrency } from "@/lib/calculations/monte-carlo/simulator";

interface SpendingSmileChartProps {
  retirementAge: number;
  annualSpending: number;
}

const phases = [
  { name: "Go-Go Years", years: 10, multiplier: 1.05, description: "Active travel & hobbies", emoji: "✈️" },
  { name: "Slow-Go Years", years: 10, multiplier: 0.80, description: "Settling into retirement", emoji: "🌿" },
  { name: "No-Go Years", years: 10, multiplier: 1.05, description: "Healthcare costs rise", emoji: "🏥" },
];

export function SpendingSmileChart({ retirementAge, annualSpending }: SpendingSmileChartProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E0D8CC]">
      <h3 className="font-serif text-xl font-bold text-[#2C3E2D] mb-1">
        The Retirement Spending Smile
      </h3>
      <p className="text-sm text-[#6B7B6E] mb-6">
        Spending isn&apos;t flat in retirement — it follows a smile-shaped curve across three distinct phases.
      </p>

      {/* SVG Smile Curve */}
      <svg viewBox="0 0 400 120" className="w-full h-[120px] mb-5">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={0} y1={20 + i * 25}
            x2={400} y2={20 + i * 25}
            stroke="#E0D8CC"
            strokeWidth={0.5}
            strokeDasharray="4,4"
          />
        ))}
        {/* The smile curve */}
        <path
          d="M 20,35 C 60,35 80,38 120,50 C 160,62 180,85 200,90 C 220,85 240,62 280,50 C 320,38 340,35 380,32"
          fill="none"
          stroke="#D4A853"
          strokeWidth={3}
          strokeLinecap="round"
        />
        {/* Area fill */}
        <path
          d="M 20,35 C 60,35 80,38 120,50 C 160,62 180,85 200,90 C 220,85 240,62 280,50 C 320,38 340,35 380,32 L 380,110 L 20,110 Z"
          fill="rgba(212, 168, 83, 0.1)"
        />
        {/* Phase labels */}
        <text x={70} y={112} textAnchor="middle" fill="#9CA89E" fontSize="10">
          Go-Go
        </text>
        <text x={200} y={112} textAnchor="middle" fill="#9CA89E" fontSize="10">
          Slow-Go
        </text>
        <text x={330} y={112} textAnchor="middle" fill="#9CA89E" fontSize="10">
          No-Go
        </text>
        {/* Phase dividers */}
        <line x1={133} y1={15} x2={133} y2={105} stroke="#E0D8CC" strokeWidth={1} strokeDasharray="3,3" />
        <line x1={267} y1={15} x2={267} y2={105} stroke="#E0D8CC" strokeWidth={1} strokeDasharray="3,3" />
      </svg>

      {/* Phase cards */}
      <div className="grid grid-cols-3 gap-3">
        {phases.map((phase, i) => {
          const startAge = retirementAge + i * 10;
          const endAge = startAge + 10;
          const spending = Math.round(annualSpending * phase.multiplier);
          const colorClass = i === 0
            ? "border-[#D4A853]/30 bg-[#D4A853]/5"
            : i === 1
            ? "border-[#4A7C59]/30 bg-[#4A7C59]/5"
            : "border-[#C45B4A]/30 bg-[#C45B4A]/5";
          const textColor = i === 0 ? "text-[#D4A853]" : i === 1 ? "text-[#4A7C59]" : "text-[#C45B4A]";

          return (
            <div key={i} className={`rounded-xl p-4 border-2 ${colorClass}`}>
              <div className="text-xl mb-1">{phase.emoji}</div>
              <div className={`text-[11px] font-semibold uppercase tracking-wide mb-0.5 ${textColor}`}>
                {phase.name}
              </div>
              <div className="text-xs text-[#9CA89E] mb-2">
                Ages {startAge}–{endAge}
              </div>
              <div className="font-serif text-lg font-bold text-[#2C3E2D]">
                {formatCurrency(spending)}
                <span className="text-xs font-normal text-[#6B7B6E]">/yr</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
