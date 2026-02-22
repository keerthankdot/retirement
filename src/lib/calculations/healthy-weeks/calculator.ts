/**
 * Healthy Weeks Calculator
 *
 * Transforms abstract years into tangible, countable weeks.
 * Based on Azul Wells' framework: "At 60, most of us have fewer than 1,000
 * healthy, active weeks remaining."
 *
 * We use age 85 as the benchmark for "healthy, active" life - not life expectancy,
 * but the end of the Go-Go + Slow-Go phases. After 85, you're in No-Go territory.
 */

export interface HealthyWeeksInputs {
  currentAge: number;
  healthyEndAge?: number; // default 85
  retireAge?: number;
  retireAgeLater?: number;
  targetRetirementDate?: Date;
}

export type DotStatus = "lived" | "working" | "go-go" | "slow-go" | "no-go" | "post-healthy";

export interface DotData {
  age: number;
  week: number; // 1-52
  status: DotStatus;
  weekNumber: number; // absolute week number from birth
  isCurrent: boolean;
}

export interface RetirementWeeks {
  weeksUntilRetirement: number;
  healthyRetirementWeeks: number;
  goGoWeeks: number;
  slowGoWeeks: number;
  noGoWeeks: number;
}

export interface ComparisonResult {
  earlyRetireAge: number;
  lateRetireAge: number;
  weeksLost: number;
  goGoWeeksLost: number;
  equivalentSaturdays: number;
  equivalentMonths: number;
  equivalentYears: number;
}

export interface Milestone {
  label: string;
  date: string;
  weeksFromNow: number;
}

export interface CountdownData {
  targetDate: string;
  weeksUntil: number;
  monthsUntil: number;
  yearsUntil: number;
  milestones: Milestone[];
}

export interface HealthyWeeksResult {
  // Core numbers
  totalAdultWeeks: number;
  weeksLived: number;
  weeksRemaining: number;
  percentLived: number;

  // Current week
  currentWeekNumber: number;
  currentDate: string;

  // Retirement calculations
  retirement?: RetirementWeeks;

  // Cost of waiting comparison
  comparison?: ComparisonResult;

  // Dot matrix data
  dotMatrix: DotData[];

  // Countdown (if target set)
  countdown?: CountdownData;
}

const ADULT_START_AGE = 20;
const DEFAULT_HEALTHY_END = 85;
const MAX_DISPLAY_AGE = 90;
const WEEKS_PER_YEAR = 52;

/**
 * Calculate which week of the current year we're in
 */
function getCurrentWeekOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.ceil(diff / oneWeek);
}

/**
 * Get today's date formatted
 */
function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Add weeks to a date
 */
function addWeeks(date: Date, weeks: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + weeks * 7);
  return result;
}

/**
 * Format a date for display
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Generate the dot matrix data
 */
function generateDotMatrix(
  currentAge: number,
  retireAge: number | undefined,
  healthyEndAge: number
): DotData[] {
  const dots: DotData[] = [];
  const currentWeekOfYear = getCurrentWeekOfYear();
  const currentYear = Math.floor(currentAge);
  const currentWeekFraction = currentAge - currentYear;

  for (let age = ADULT_START_AGE; age <= MAX_DISPLAY_AGE; age++) {
    for (let week = 1; week <= WEEKS_PER_YEAR; week++) {
      const weekNumber = (age - ADULT_START_AGE) * WEEKS_PER_YEAR + week;
      const isCurrentWeek = age === currentYear && week === currentWeekOfYear;

      let status: DotStatus;

      if (age < currentAge || (age === currentYear && week < currentWeekOfYear)) {
        status = "lived";
      } else if (retireAge && age < retireAge) {
        status = "working";
      } else if (age > healthyEndAge) {
        status = "post-healthy";
      } else if (retireAge) {
        const yearsRetired = age - retireAge;
        if (yearsRetired < 10) {
          status = "go-go";
        } else if (yearsRetired < 20) {
          status = "slow-go";
        } else {
          status = "no-go";
        }
      } else {
        // No retire age set - everything remaining is potential healthy time
        if (age <= healthyEndAge) {
          status = "go-go"; // Default to go-go for remaining healthy weeks
        } else {
          status = "post-healthy";
        }
      }

      dots.push({
        age,
        week,
        status,
        weekNumber,
        isCurrent: isCurrentWeek,
      });
    }
  }

  return dots;
}

/**
 * Calculate retirement weeks breakdown
 */
function calculateRetirementWeeks(
  currentAge: number,
  retireAge: number,
  healthyEndAge: number
): RetirementWeeks {
  const weeksUntilRetirement = Math.max(0, (retireAge - currentAge) * WEEKS_PER_YEAR);
  const retirementYears = Math.max(0, healthyEndAge - retireAge);
  const healthyRetirementWeeks = retirementYears * WEEKS_PER_YEAR;

  // Go-Go: first 10 years, Slow-Go: years 10-20, No-Go: 20+
  const goGoYears = Math.min(10, retirementYears);
  const slowGoYears = Math.min(10, Math.max(0, retirementYears - 10));
  const noGoYears = Math.max(0, retirementYears - 20);

  return {
    weeksUntilRetirement,
    healthyRetirementWeeks,
    goGoWeeks: goGoYears * WEEKS_PER_YEAR,
    slowGoWeeks: slowGoYears * WEEKS_PER_YEAR,
    noGoWeeks: noGoYears * WEEKS_PER_YEAR,
  };
}

/**
 * Calculate the cost of waiting (comparison between two retirement ages)
 */
function calculateComparison(
  earlyAge: number,
  lateAge: number,
  healthyEndAge: number
): ComparisonResult {
  const yearsDiff = lateAge - earlyAge;
  const weeksLost = yearsDiff * WEEKS_PER_YEAR;

  // Go-Go weeks lost (first 10 years of retirement are most valuable)
  // If you delay, you lose Go-Go weeks from the BEGINNING of your retirement
  const goGoWeeksLost = Math.min(weeksLost, 10 * WEEKS_PER_YEAR);

  return {
    earlyRetireAge: earlyAge,
    lateRetireAge: lateAge,
    weeksLost,
    goGoWeeksLost,
    equivalentSaturdays: weeksLost, // 1 week = 1 Saturday
    equivalentMonths: Math.round(weeksLost / 4.33),
    equivalentYears: yearsDiff,
  };
}

/**
 * Calculate countdown milestones
 */
function calculateCountdown(
  currentAge: number,
  targetRetireAge: number,
  healthyEndAge: number
): CountdownData {
  const now = new Date();
  const weeksUntil = Math.round((targetRetireAge - currentAge) * WEEKS_PER_YEAR);
  const targetDate = addWeeks(now, weeksUntil);

  const milestones: Milestone[] = [];

  // 100 weeks from now
  if (weeksUntil > 100) {
    milestones.push({
      label: "100 weeks from now",
      date: formatDate(addWeeks(now, 100)),
      weeksFromNow: 100,
    });
  }

  // Halfway to retirement
  if (weeksUntil > 0) {
    const halfway = Math.round(weeksUntil / 2);
    milestones.push({
      label: "Halfway to retirement",
      date: formatDate(addWeeks(now, halfway)),
      weeksFromNow: halfway,
    });
  }

  // Retirement date
  milestones.push({
    label: "Your retirement week",
    date: formatDate(targetDate),
    weeksFromNow: weeksUntil,
  });

  // 500th week of retirement
  const week500 = weeksUntil + 500;
  milestones.push({
    label: "500th week of retirement",
    date: formatDate(addWeeks(now, week500)),
    weeksFromNow: week500,
  });

  // End of Go-Go years
  const goGoEnd = weeksUntil + 10 * WEEKS_PER_YEAR;
  milestones.push({
    label: "Go-Go years end",
    date: formatDate(addWeeks(now, goGoEnd)),
    weeksFromNow: goGoEnd,
  });

  return {
    targetDate: formatDate(targetDate),
    weeksUntil,
    monthsUntil: Math.round(weeksUntil / 4.33),
    yearsUntil: Math.round((weeksUntil / WEEKS_PER_YEAR) * 10) / 10,
    milestones,
  };
}

/**
 * Main calculation function
 */
export function calculateHealthyWeeks(inputs: HealthyWeeksInputs): HealthyWeeksResult {
  const {
    currentAge,
    healthyEndAge = DEFAULT_HEALTHY_END,
    retireAge,
    retireAgeLater,
  } = inputs;

  // Core calculations
  const totalAdultWeeks = (healthyEndAge - ADULT_START_AGE) * WEEKS_PER_YEAR;
  const weeksLived = Math.round((currentAge - ADULT_START_AGE) * WEEKS_PER_YEAR);
  const weeksRemaining = Math.max(0, (healthyEndAge - currentAge) * WEEKS_PER_YEAR);
  const percentLived = Math.round((weeksLived / totalAdultWeeks) * 100);

  // Current week info
  const currentWeekOfYear = getCurrentWeekOfYear();
  const currentWeekNumber = Math.round(currentAge * WEEKS_PER_YEAR) + currentWeekOfYear;

  // Generate dot matrix
  const dotMatrix = generateDotMatrix(currentAge, retireAge, healthyEndAge);

  // Build result
  const result: HealthyWeeksResult = {
    totalAdultWeeks,
    weeksLived,
    weeksRemaining: Math.round(weeksRemaining),
    percentLived,
    currentWeekNumber,
    currentDate: getFormattedDate(),
    dotMatrix,
  };

  // Add retirement breakdown if retire age provided
  if (retireAge) {
    result.retirement = calculateRetirementWeeks(currentAge, retireAge, healthyEndAge);
  }

  // Add comparison if both ages provided
  if (retireAge && retireAgeLater) {
    result.comparison = calculateComparison(retireAge, retireAgeLater, healthyEndAge);
  }

  // Add countdown if retire age provided
  if (retireAge) {
    result.countdown = calculateCountdown(currentAge, retireAge, healthyEndAge);
  }

  return result;
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Azul's quotes for this tool
 */
export const HEALTHY_WEEKS_QUOTES = {
  reveal: "At 60 years old, most of us have fewer than 1,000 weeks of healthy active time remaining.",
  time: "Time is the one resource you can never get back. Make every week count.",
  waiting: "Most people aren't short on money. They're short on permission. Give yourself permission to live.",
  countdown: "Don't count the years. Count the weeks. It changes everything.",
  youth: "My goal is to encourage people to take full advantage of The Youth of Their Senior Years.",
};

/**
 * Azul's 5 pillars for the cost of waiting section
 */
export const AZUL_PILLARS = [
  {
    icon: "❤️",
    name: "Health",
    description: (weeks: number) =>
      `${weeks} weeks of lower stress, better sleep, morning walks`,
  },
  {
    icon: "⏰",
    name: "Time",
    description: (weeks: number) => `${weeks} Saturdays that belong to you`,
  },
  {
    icon: "👥",
    name: "Relationships",
    description: (weeks: number) =>
      `${weeks} weeks of being present for the people you love`,
  },
  {
    icon: "🎨",
    name: "Passions",
    description: (weeks: number) =>
      `${weeks} weeks to finally learn that instrument, write that book, take that trip`,
  },
  {
    icon: "💰",
    name: "Financial",
    description: () => "You might be closer than you think. Let's check.",
  },
];
