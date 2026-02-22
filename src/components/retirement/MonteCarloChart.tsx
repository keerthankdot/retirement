"use client";

import { useMemo } from "react";
import type { MonteCarloResult } from "@/lib/calculations/monte-carlo/simulator";
import { formatCurrency } from "@/lib/calculations/monte-carlo/simulator";

interface MonteCarloChartProps {
  data: MonteCarloResult;
  retirementAge: number;
}

export function MonteCarloChart({ data, retirementAge }: MonteCarloChartProps) {
  if (!data || !data.percentiles || data.percentiles.length === 0) return null;

  const { percentiles, successRate } = data;

  const chartConfig = useMemo(() => {
    const svgW = 600;
    const svgH = 280;
    const padL = 55;
    const padR = 20;
    const padT = 20;
    const padB = 40;
    const chartW = svgW - padL - padR;
    const chartH = svgH - padT - padB;

    const maxVal = Math.max(...percentiles.map((p) => p.p90)) * 1.1;
    const minAge = percentiles[0].age;
    const maxAge = percentiles[percentiles.length - 1].age;

    const x = (age: number) => padL + ((age - minAge) / (maxAge - minAge)) * chartW;
    const y = (val: number) => padT + chartH - (Math.max(val, 0) / maxVal) * chartH;

    // Y-axis ticks
    const yTicks: number[] = [];
    const tickStep = maxVal > 5_000_000 ? 2_000_000 : maxVal > 2_000_000 ? 1_000_000 : maxVal > 500_000 ? 250_000 : 100_000;
    for (let v = 0; v <= maxVal; v += tickStep) {
      yTicks.push(v);
    }

    // X-axis ticks (every 5 years)
    const xTicks: number[] = [];
    for (let a = Math.ceil(minAge / 5) * 5; a <= maxAge; a += 5) {
      xTicks.push(a);
    }

    return { svgW, svgH, padL, padR, padT, padB, chartW, chartH, maxVal, minAge, maxAge, x, y, yTicks, xTicks };
  }, [percentiles]);

  const { svgW, svgH, padL, padR, padT, chartH, x, y, yTicks, xTicks } = chartConfig;

  const makePath = (key: keyof typeof percentiles[0]) =>
    percentiles.map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.age)},${y(p[key] as number)}`).join(" ");

  const makeArea = (keyTop: keyof typeof percentiles[0], keyBottom: keyof typeof percentiles[0]) => {
    const top = percentiles.map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.age)},${y(p[keyTop] as number)}`).join(" ");
    const bottom = [...percentiles].reverse().map((p) => `L ${x(p.age)},${y(p[keyBottom] as number)}`).join(" ");
    return `${top} ${bottom} Z`;
  };

  const getSuccessColor = () => {
    if (successRate >= 80) return { bg: "bg-[#E8F0EA]", border: "border-[#4A7C59]", text: "text-[#4A7C59]" };
    if (successRate >= 60) return { bg: "bg-[#D4A853]/10", border: "border-[#D4A853]", text: "text-[#B8912E]" };
    return { bg: "bg-[#F5E0DC]", border: "border-[#C45B4A]", text: "text-[#C45B4A]" };
  };

  const successColors = getSuccessColor();

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E0D8CC]">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#2C3E2D]">Portfolio Projection</h3>
          <p className="text-sm text-[#6B7B6E]">
            {percentiles.length > 0 ? "1,000 simulated market scenarios" : ""}
          </p>
        </div>
        <div className={`${successColors.bg} ${successColors.border} border-2 rounded-xl px-5 py-3 text-center`}>
          <div className={`font-serif text-3xl font-bold ${successColors.text}`}>
            {Math.round(successRate)}%
          </div>
          <div className={`text-[11px] font-semibold uppercase tracking-wide ${successColors.text}`}>
            Success Rate
          </div>
        </div>
      </div>

      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto">
        {/* Grid */}
        {yTicks.map((v, i) => (
          <g key={`y-${i}`}>
            <line
              x1={padL} y1={y(v)}
              x2={svgW - padR} y2={y(v)}
              stroke="#E0D8CC"
              strokeWidth={0.5}
              strokeDasharray="4,4"
            />
            <text
              x={padL - 8} y={y(v) + 4}
              textAnchor="end"
              fill="#9CA89E"
              fontSize="10"
            >
              {formatCurrency(v, true)}
            </text>
          </g>
        ))}
        {xTicks.map((a, i) => (
          <text
            key={`x-${i}`}
            x={x(a)} y={svgH - 10}
            textAnchor="middle"
            fill="#9CA89E"
            fontSize="10"
          >
            {a}
          </text>
        ))}

        {/* Retirement age line */}
        <line
          x1={x(retirementAge)} y1={padT}
          x2={x(retirementAge)} y2={padT + chartH}
          stroke="#D4A853"
          strokeWidth={1.5}
          strokeDasharray="6,4"
        />
        <text
          x={x(retirementAge)} y={padT - 6}
          textAnchor="middle"
          fill="#D4A853"
          fontSize="10"
          fontWeight="600"
        >
          Retire at {retirementAge}
        </text>

        {/* Probability bands */}
        <path d={makeArea("p90", "p10")} fill="rgba(74, 124, 89, 0.1)" />
        <path d={makeArea("p75", "p25")} fill="rgba(74, 124, 89, 0.2)" />

        {/* Median line */}
        <path
          d={makePath("p50")}
          fill="none"
          stroke="#4A7C59"
          strokeWidth={2.5}
          strokeLinecap="round"
        />

        {/* P10 and P90 lines */}
        <path
          d={makePath("p90")}
          fill="none"
          stroke="rgba(74, 124, 89, 0.4)"
          strokeWidth={0.8}
          strokeDasharray="4,3"
        />
        <path
          d={makePath("p10")}
          fill="none"
          stroke="rgba(196, 91, 74, 0.6)"
          strokeWidth={0.8}
          strokeDasharray="4,3"
        />

        {/* Zero line */}
        <line
          x1={padL} y1={y(0)}
          x2={svgW - padR} y2={y(0)}
          stroke="#9CA89E"
          strokeWidth={0.5}
          opacity={0.5}
        />

        {/* X axis label */}
        <text
          x={svgW / 2} y={svgH}
          textAnchor="middle"
          fill="#9CA89E"
          fontSize="11"
        >
          Age
        </text>
      </svg>

      {/* Legend */}
      <div className="flex gap-6 justify-center mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-[#4A7C59] rounded" />
          <span className="text-xs text-[#6B7B6E]">Median outcome</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-2.5 bg-[#4A7C59]/30 rounded-sm" />
          <span className="text-xs text-[#6B7B6E]">Likely range (25th–75th)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0 border-t-2 border-dashed border-[#C45B4A]/60" />
          <span className="text-xs text-[#6B7B6E]">Unlucky (10th percentile)</span>
        </div>
      </div>
    </div>
  );
}
