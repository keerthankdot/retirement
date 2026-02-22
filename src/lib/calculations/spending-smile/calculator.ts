/**
 * Spending Smile Calculator
 *
 * Models the empirically-observed spending pattern in retirement:
 * - Go-Go years (65-74): Active travel, dining, hobbies - higher spending
 * - Slow-Go years (75-84): Gradually decreasing activity - lower spending
 * - No-Go years (85+): Healthcare costs rise - spending increases again
 *
 * Based on research by David Blanchett ("Estimating the True Cost of Retirement")
 */

export interface SpendingSmileInputs {
  retirementAge: number;
  lifeExpectancy: number;
  initialAnnualSpending: number;
  inflationRate: number; // as decimal, e.g., 0.03 for 3%
}

export interface SpendingPhase {
  name: "Go-Go" | "Slow-Go" | "No-Go";
  startAge: number;
  endAge: number;
  description: string;
  averageMultiplier: number;
  color: string;
  icon: string;
}

export interface YearlySpending {
  age: number;
  year: number;
  phase: "Go-Go" | "Slow-Go" | "No-Go";
  nominalSpending: number;
  realSpending: number;
  multiplier: number;
  cumulativeNominal: number;
  cumulativeReal: number;
}

export interface SpendingSmileResult {
  phases: SpendingPhase[];
  yearlySpending: YearlySpending[];
  summary: {
    totalNominalSpending: number;
    totalRealSpending: number;
    averageAnnualNominal: number;
    averageAnnualReal: number;
    peakSpendingAge: number;
    lowestSpendingAge: number;
    goGoTotal: number;
    slowGoTotal: number;
    noGoTotal: number;
  };
  comparison: {
    flatTotalSpending: number;
    smileTotalSpending: number;
    difference: number;
    percentDifference: number;
  };
}

/**
 * Calculate the spending multiplier for a given age using smooth curve interpolation.
 * This creates the characteristic "smile" shape.
 */
export function getSpendingMultiplier(age: number, retirementAge: number): number {
  const yearsRetired = age - retirementAge;

  // Phase boundaries (years into retirement)
  const goGoEnd = 10;      // First 10 years
  const slowGoEnd = 20;    // Years 11-20
  // No-Go: 21+ years

  // Base multipliers for each phase center
  const goGoMultiplier = 1.05;     // 5% higher in active years
  const slowGoMultiplier = 0.80;   // 20% lower in slow years
  const noGoMultiplier = 1.05;     // Back up due to healthcare

  // Smooth curve using cosine interpolation
  if (yearsRetired < 0) {
    return 1.0; // Pre-retirement
  } else if (yearsRetired <= goGoEnd) {
    // Go-Go phase: slight decline from 1.05 towards transition
    const t = yearsRetired / goGoEnd;
    // Start high, gradually ease down
    const easeOut = 1 - Math.pow(t, 2);
    return goGoMultiplier - (goGoMultiplier - 0.95) * (1 - easeOut);
  } else if (yearsRetired <= slowGoEnd) {
    // Slow-Go phase: U-shaped bottom of the smile
    const t = (yearsRetired - goGoEnd) / (slowGoEnd - goGoEnd);
    // Parabolic curve - lowest at the middle of slow-go
    const parabola = 4 * t * (1 - t); // Peaks at 0.5
    const midpoint = (goGoMultiplier + slowGoMultiplier) / 2;
    return midpoint - parabola * (midpoint - slowGoMultiplier);
  } else {
    // No-Go phase: gradual rise due to healthcare costs
    const yearsInNoGo = yearsRetired - slowGoEnd;
    const maxYears = 15; // Cap the rise
    const t = Math.min(yearsInNoGo / maxYears, 1);
    // Ease into higher spending
    const easeIn = 1 - Math.pow(1 - t, 2);
    return slowGoMultiplier + (noGoMultiplier - slowGoMultiplier) * easeIn;
  }
}

/**
 * Get the phase name for a given age
 */
export function getPhase(age: number, retirementAge: number): "Go-Go" | "Slow-Go" | "No-Go" {
  const yearsRetired = age - retirementAge;
  if (yearsRetired < 10) return "Go-Go";
  if (yearsRetired < 20) return "Slow-Go";
  return "No-Go";
}

/**
 * Define the three retirement phases
 */
export function getPhases(retirementAge: number, lifeExpectancy: number): SpendingPhase[] {
  const goGoEnd = Math.min(retirementAge + 9, lifeExpectancy);
  const slowGoEnd = Math.min(retirementAge + 19, lifeExpectancy);

  return [
    {
      name: "Go-Go",
      startAge: retirementAge,
      endAge: goGoEnd,
      description: "Active years filled with travel, hobbies, and new experiences. You have the health and energy to check items off your bucket list.",
      averageMultiplier: 1.05,
      color: "#4A7C59", // sage
      icon: "✈️",
    },
    {
      name: "Slow-Go",
      startAge: goGoEnd + 1,
      endAge: slowGoEnd,
      description: "A natural slowing down. Less travel, more time at home with family. Spending decreases as activity levels moderate.",
      averageMultiplier: 0.80,
      color: "#D4A853", // gold
      icon: "🏡",
    },
    {
      name: "No-Go",
      startAge: slowGoEnd + 1,
      endAge: lifeExpectancy,
      description: "Healthcare becomes the priority. While activity decreases, medical expenses and potential long-term care costs push spending back up.",
      averageMultiplier: 1.05,
      color: "#C45B4A", // terracotta
      icon: "🏥",
    },
  ];
}

/**
 * Run the full spending smile calculation
 */
export function calculateSpendingSmile(inputs: SpendingSmileInputs): SpendingSmileResult {
  const { retirementAge, lifeExpectancy, initialAnnualSpending, inflationRate } = inputs;

  const phases = getPhases(retirementAge, lifeExpectancy);
  const yearlySpending: YearlySpending[] = [];

  let cumulativeNominal = 0;
  let cumulativeReal = 0;
  let goGoTotal = 0;
  let slowGoTotal = 0;
  let noGoTotal = 0;
  let peakSpendingAge = retirementAge;
  let peakSpending = 0;
  let lowestSpendingAge = retirementAge;
  let lowestSpending = Infinity;

  const retirementYears = lifeExpectancy - retirementAge + 1;

  for (let i = 0; i < retirementYears; i++) {
    const age = retirementAge + i;
    const year = i + 1;
    const phase = getPhase(age, retirementAge);
    const multiplier = getSpendingMultiplier(age, retirementAge);

    // Real spending = base spending * smile multiplier (constant purchasing power)
    const realSpending = initialAnnualSpending * multiplier;

    // Nominal spending = real spending adjusted for inflation
    const inflationFactor = Math.pow(1 + inflationRate, i);
    const nominalSpending = realSpending * inflationFactor;

    cumulativeNominal += nominalSpending;
    cumulativeReal += realSpending;

    // Track phase totals (in real terms)
    if (phase === "Go-Go") goGoTotal += realSpending;
    else if (phase === "Slow-Go") slowGoTotal += realSpending;
    else noGoTotal += realSpending;

    // Track peak and lowest
    if (realSpending > peakSpending) {
      peakSpending = realSpending;
      peakSpendingAge = age;
    }
    if (realSpending < lowestSpending) {
      lowestSpending = realSpending;
      lowestSpendingAge = age;
    }

    yearlySpending.push({
      age,
      year,
      phase,
      nominalSpending,
      realSpending,
      multiplier,
      cumulativeNominal,
      cumulativeReal,
    });
  }

  // Calculate comparison with flat spending assumption
  const flatTotalSpending = initialAnnualSpending * retirementYears;
  const smileTotalSpending = cumulativeReal;

  return {
    phases,
    yearlySpending,
    summary: {
      totalNominalSpending: cumulativeNominal,
      totalRealSpending: cumulativeReal,
      averageAnnualNominal: cumulativeNominal / retirementYears,
      averageAnnualReal: cumulativeReal / retirementYears,
      peakSpendingAge,
      lowestSpendingAge,
      goGoTotal,
      slowGoTotal,
      noGoTotal,
    },
    comparison: {
      flatTotalSpending,
      smileTotalSpending,
      difference: flatTotalSpending - smileTotalSpending,
      percentDifference: ((flatTotalSpending - smileTotalSpending) / flatTotalSpending) * 100,
    },
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 1_000_000) {
      return `$${(amount / 1_000_000).toFixed(1)}M`;
    }
    if (amount >= 1_000) {
      return `$${(amount / 1_000).toFixed(0)}K`;
    }
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Educational quotes about spending in retirement
 */
export const SPENDING_SMILE_QUOTES = [
  {
    quote: "The spending smile isn't about spending less—it's about spending right. Your money should match your life stage.",
    context: "intro",
  },
  {
    quote: "Most retirees don't need a constant budget. They need a budget that breathes with their changing life.",
    context: "phases",
  },
  {
    quote: "The Go-Go years are when your bucket list meets your nest egg. This is what you saved for.",
    context: "go-go",
  },
  {
    quote: "Slow-Go doesn't mean less joy—it means different joy. Your spending naturally follows your energy.",
    context: "slow-go",
  },
  {
    quote: "Healthcare costs in the No-Go years are real, but planning for them removes the fear.",
    context: "no-go",
  },
  {
    quote: "Understanding the smile lets you enjoy retirement without the guilt of 'spending too much' early on.",
    context: "results",
  },
];

export function getSpendingSmileQuote(context: string): typeof SPENDING_SMILE_QUOTES[0] | undefined {
  return SPENDING_SMILE_QUOTES.find(q => q.context === context);
}
