"use client";

import { calculateWeeksRemaining } from "@/lib/calculations/monte-carlo/simulator";

interface WeeksCountdownProps {
  currentAge: number;
}

export function WeeksCountdown({ currentAge }: WeeksCountdownProps) {
  const healthyLifeEnd = 85;
  const weeksRemaining = calculateWeeksRemaining(currentAge, healthyLifeEnd);
  const gridSize = 25;
  const totalDots = gridSize * gridSize;
  const filledDots = Math.min(totalDots, Math.round((weeksRemaining / (healthyLifeEnd - 30) / 52) * totalDots));

  return (
    <div className="dark-panel rounded-2xl p-8 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212, 168, 83, 0.15), transparent 70%)" }}
      />

      <h3 className="font-serif text-xl font-bold text-[#D4A853] mb-1 relative z-10">
        Your Healthy Weeks Ahead
      </h3>
      <p className="text-sm text-[#FAF6F1]/70 mb-5 leading-relaxed relative z-10">
        At {currentAge}, you have roughly {weeksRemaining.toLocaleString()} healthy active weeks
        remaining before {healthyLifeEnd}. Make them count.
      </p>

      <div className="flex items-center gap-8 relative z-10">
        {/* Dot grid */}
        <div
          className="grid gap-[3px] w-[200px] flex-shrink-0"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {Array.from({ length: totalDots }).map((_, i) => {
            const isActive = i < filledDots;
            return (
              <div
                key={i}
                className="w-full pb-[100%] rounded-full transition-colors"
                style={{
                  backgroundColor: isActive
                    ? `rgba(212, 168, 83, ${0.4 + 0.6 * (i / totalDots)})`
                    : "rgba(61, 79, 62, 0.6)",
                }}
              />
            );
          })}
        </div>

        {/* Stats */}
        <div>
          <div className="font-serif text-5xl font-bold text-white leading-none mb-1">
            {weeksRemaining.toLocaleString()}
          </div>
          <div className="text-sm font-semibold text-[#D4A853] uppercase tracking-wider">
            weeks remaining
          </div>
          <p className="text-sm text-[#FAF6F1]/60 mt-4 italic leading-relaxed">
            &quot;Time is the one resource you can never get back. Spend it wisely.&quot;
          </p>
          <p className="text-sm font-semibold text-[#FAF6F1]/80 mt-2">— Azul Wells</p>
        </div>
      </div>
    </div>
  );
}
