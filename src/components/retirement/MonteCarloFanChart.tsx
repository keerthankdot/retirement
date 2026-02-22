"use client";

import { useMemo, useState } from "react";
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
import type { PercentileData } from "@/lib/calculations/monte-carlo/simulator";
import { formatCurrency } from "@/lib/calculations/monte-carlo/simulator";

interface MonteCarloFanChartProps {
  data: PercentileData[];
  retirementAge: number;
  currentAge: number;
}

export function MonteCarloFanChart({ data, retirementAge, currentAge }: MonteCarloFanChartProps) {
  const [hoveredAge, setHoveredAge] = useState<number | null>(null);

  // Transform data for stacked areas
  const chartData = useMemo(() => {
    return data.map((d) => ({
      age: d.age,
      // For stacked areas, we need the differences
      p10: d.p10,
      p10_25: d.p25 - d.p10,
      p25_50: d.p50 - d.p25,
      p50_75: d.p75 - d.p50,
      p75_90: d.p90 - d.p75,
      // Keep originals for tooltip
      _p10: d.p10,
      _p25: d.p25,
      _p50: d.p50,
      _p75: d.p75,
      _p90: d.p90,
    }));
  }, [data]);

  // Format Y axis
  const formatYAxis = (value: number) => {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(0)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
    return `$${value}`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ payload: Record<string, number> }>; label?: number }) => {
    if (!active || !payload || !payload.length) return null;

    const d = payload[0].payload;

    return (
      <div className="bg-white border border-[#E0D8CC] rounded-xl p-4 shadow-lg">
        <div className="font-serif text-lg font-bold text-[#2C3E2D] mb-2">
          Age {label}
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-[#6B7B6E]">Best case (90th):</span>
            <span className="font-semibold text-[#4A7C59]">{formatCurrency(d._p90, true)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#6B7B6E]">Good case (75th):</span>
            <span className="font-semibold text-[#4A7C59]">{formatCurrency(d._p75, true)}</span>
          </div>
          <div className="flex justify-between gap-4 bg-[#D4A853]/10 -mx-2 px-2 py-1 rounded">
            <span className="text-[#8B6F47] font-medium">Median (50th):</span>
            <span className="font-bold text-[#D4A853]">{formatCurrency(d._p50, true)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#6B7B6E]">Low case (25th):</span>
            <span className="font-semibold text-[#6B7B6E]">{formatCurrency(d._p25, true)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#6B7B6E]">Worst case (10th):</span>
            <span className="font-semibold text-[#C45B4A]">{formatCurrency(d._p10, true)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E0D8CC]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#2C3E2D]">
            Portfolio Projection
          </h3>
          <p className="text-sm text-[#6B7B6E]">
            1,000 simulated market scenarios
          </p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-[#4A7C59]/30" />
            <span className="text-[#6B7B6E]">Likely range</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-[#D4A853]" />
            <span className="text-[#6B7B6E]">Median</span>
          </div>
        </div>
      </div>

      <div className="h-[300px] md:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            onMouseMove={(e) => {
              if (e.activeLabel) setHoveredAge(e.activeLabel as number);
            }}
            onMouseLeave={() => setHoveredAge(null)}
          >
            <defs>
              <linearGradient id="sageGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4A7C59" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#4A7C59" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#E0D8CC"
              vertical={false}
            />

            <XAxis
              dataKey="age"
              stroke="#9CA89E"
              tick={{ fill: "#9CA89E", fontSize: 11 }}
              axisLine={{ stroke: "#E0D8CC" }}
              tickLine={false}
              tickFormatter={(age) => (age % 5 === 0 ? age : "")}
            />

            <YAxis
              stroke="#9CA89E"
              tick={{ fill: "#9CA89E", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatYAxis}
              width={55}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Retirement age line */}
            <ReferenceLine
              x={retirementAge}
              stroke="#D4A853"
              strokeDasharray="6 4"
              strokeWidth={1.5}
              label={{
                value: `Retire at ${retirementAge}`,
                position: "top",
                fill: "#D4A853",
                fontSize: 10,
                fontWeight: 600,
              }}
            />

            {/* P10-P90 band (outermost) */}
            <Area
              type="monotone"
              dataKey="p10"
              stackId="1"
              stroke="none"
              fill="transparent"
            />
            <Area
              type="monotone"
              dataKey="p10_25"
              stackId="1"
              stroke="none"
              fill="#4A7C59"
              fillOpacity={0.1}
            />
            <Area
              type="monotone"
              dataKey="p25_50"
              stackId="1"
              stroke="none"
              fill="#4A7C59"
              fillOpacity={0.2}
            />
            <Area
              type="monotone"
              dataKey="p50_75"
              stackId="1"
              stroke="none"
              fill="#4A7C59"
              fillOpacity={0.2}
            />
            <Area
              type="monotone"
              dataKey="p75_90"
              stackId="1"
              stroke="none"
              fill="#4A7C59"
              fillOpacity={0.1}
            />

            {/* Median line overlay */}
            <Area
              type="monotone"
              dataKey="_p50"
              stroke="#D4A853"
              strokeWidth={2.5}
              fill="none"
              dot={false}
            />

            {/* P10 dashed line (worst case) */}
            <Area
              type="monotone"
              dataKey="_p10"
              stroke="#C45B4A"
              strokeWidth={0.8}
              strokeDasharray="4 3"
              fill="none"
              dot={false}
              opacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center mt-4 text-xs text-[#6B7B6E]">
        <div className="flex items-center gap-1">
          <div className="w-4 h-0.5 bg-[#D4A853] rounded" />
          <span>Median outcome</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-2.5 bg-[#4A7C59]/30 rounded-sm" />
          <span>25th–75th percentile</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-0 border-t-2 border-dashed border-[#C45B4A]/60" />
          <span>10th percentile (unlucky)</span>
        </div>
      </div>
    </div>
  );
}
