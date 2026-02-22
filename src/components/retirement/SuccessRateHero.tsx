"use client";

import { useEffect, useState } from "react";

interface SuccessRateHeroProps {
  successRate: number;
  animated?: boolean;
}

export function SuccessRateHero({ successRate, animated = true }: SuccessRateHeroProps) {
  const [displayRate, setDisplayRate] = useState(animated ? 0 : successRate);

  useEffect(() => {
    if (!animated) {
      setDisplayRate(successRate);
      return;
    }

    // Animate from 0 to successRate over 1 second
    const duration = 1000;
    const startTime = Date.now();
    const startValue = 0;
    const endValue = successRate;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out curve
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOut;

      setDisplayRate(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [successRate, animated]);

  // Determine color based on success rate
  const getColorClass = () => {
    if (successRate >= 90) return "text-[#4A7C59]"; // sage - confident
    if (successRate >= 70) return "text-[#D4A853]"; // gold - cautious
    return "text-[#C45B4A]"; // terracotta - needs work
  };

  const getBgClass = () => {
    if (successRate >= 90) return "bg-[#E8F0EA] border-[#4A7C59]";
    if (successRate >= 70) return "bg-[#D4A853]/10 border-[#D4A853]";
    return "bg-[#F5E0DC] border-[#C45B4A]";
  };

  const getLabel = () => {
    if (successRate >= 90) return "Excellent";
    if (successRate >= 80) return "Strong";
    if (successRate >= 70) return "Good";
    if (successRate >= 60) return "Fair";
    return "Needs Work";
  };

  return (
    <div className={`${getBgClass()} border-2 rounded-2xl p-8 text-center`}>
      <div className="text-[11px] text-[#9CA89E] uppercase tracking-wider font-semibold mb-2">
        Success Rate
      </div>
      <div className={`font-serif text-6xl md:text-7xl font-bold ${getColorClass()} leading-none`}>
        {Math.round(displayRate)}%
      </div>
      <div className={`text-sm font-semibold mt-2 ${getColorClass()}`}>
        {getLabel()}
      </div>
      <p className="text-xs text-[#6B7B6E] mt-3 max-w-xs mx-auto">
        Based on 1,000 simulated market scenarios through age {95}
      </p>
    </div>
  );
}
