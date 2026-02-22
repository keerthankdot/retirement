/**
 * Monte Carlo Retirement Simulation Engine
 * Runs 1,000 market scenarios with correlated asset class returns
 * Built for Azul Wells Retirement Roadmap
 */

export interface MonteCarloInputs {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  totalSavings: number;
  monthlyContribution: number;

  // Asset allocation (must sum to 100)
  stocksPercent: number;
  bondsPercent: number;
  cashPercent: number;

  annualSpending: number;
  spendingSmile: boolean;

  socialSecurityAge: number;
  socialSecurityMonthly: number;
  otherMonthlyIncome: number;

  inflationRate: number;
  numSimulations?: number;
}

export interface PercentileData {
  age: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
}

export interface ComparisonResult {
  successRate: number;
  medianAt85: number;
}

export interface MonteCarloResult {
  percentiles: PercentileData[];
  successRate: number;
  medianEndingWealth: number;
  worstCaseAt85: number;
  bestCaseAt85: number;
  medianAt85: number;
  comparison: {
    current: ComparisonResult;
    delayed: ComparisonResult;
    delayYears: number;
  };
  simulationCount: number;
  timestamp: string;
}

// Asset class return parameters (nominal)
const ASSET_PARAMS = {
  stocks: { mean: 0.10, std: 0.18 },  // S&P 500 long-term
  bonds: { mean: 0.05, std: 0.06 },   // Intermediate govt bonds
  cash: { mean: 0.03, std: 0.01 },    // Money market
};

// Correlation matrix (stocks-bonds have negative correlation)
const CORRELATION = {
  stocksBonds: -0.2,
  stocksCash: 0.0,
  bondsCash: 0.3,
};

/**
 * Box-Muller transform for generating normally distributed random numbers
 */
function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Generate correlated random returns using Cholesky decomposition
 * Returns [stockReturn, bondReturn, cashReturn]
 */
function generateCorrelatedReturns(): [number, number, number] {
  // Independent standard normal random variables
  const z1 = gaussianRandom();
  const z2 = gaussianRandom();
  const z3 = gaussianRandom();

  // Cholesky decomposition for 3x3 correlation matrix
  // L * L^T = correlation matrix
  const rho12 = CORRELATION.stocksBonds;
  const rho13 = CORRELATION.stocksCash;
  const rho23 = CORRELATION.bondsCash;

  // Cholesky factors
  const l11 = 1;
  const l21 = rho12;
  const l22 = Math.sqrt(1 - rho12 * rho12);
  const l31 = rho13;
  const l32 = (rho23 - rho12 * rho13) / l22;
  const l33 = Math.sqrt(Math.max(0, 1 - l31 * l31 - l32 * l32));

  // Correlated standard normal variables
  const e1 = l11 * z1;
  const e2 = l21 * z1 + l22 * z2;
  const e3 = l31 * z1 + l32 * z2 + l33 * z3;

  // Convert to returns
  const stockReturn = ASSET_PARAMS.stocks.mean + ASSET_PARAMS.stocks.std * e1;
  const bondReturn = ASSET_PARAMS.bonds.mean + ASSET_PARAMS.bonds.std * e2;
  const cashReturn = ASSET_PARAMS.cash.mean + ASSET_PARAMS.cash.std * e3;

  return [stockReturn, bondReturn, cashReturn];
}

/**
 * Get spending smile multiplier based on years retired
 */
function getSpendingSmileMultiplier(yearsRetired: number): number {
  if (yearsRetired <= 10) {
    // Go-Go years: 105% spending (active travel, hobbies)
    return 1.05;
  } else if (yearsRetired <= 20) {
    // Slow-Go years: 80% spending (settling down)
    return 0.80;
  } else {
    // No-Go years: 105% spending (healthcare costs rise)
    return 1.05;
  }
}

/**
 * Get spending phase name
 */
export function getSpendingPhase(yearsRetired: number): 'go-go' | 'slow-go' | 'no-go' {
  if (yearsRetired <= 10) return 'go-go';
  if (yearsRetired <= 20) return 'slow-go';
  return 'no-go';
}

/**
 * Run a single simulation
 */
function runSingleSimulation(
  inputs: MonteCarloInputs,
  years: number
): { balances: number[]; success: boolean } {
  const {
    currentAge,
    retirementAge,
    totalSavings,
    monthlyContribution,
    stocksPercent,
    bondsPercent,
    cashPercent,
    annualSpending,
    spendingSmile,
    socialSecurityAge,
    socialSecurityMonthly,
    otherMonthlyIncome,
    inflationRate,
  } = inputs;

  let balance = totalSavings;
  const balances: number[] = [balance];
  let success = true;

  // Normalize allocation percentages
  const stocksWeight = stocksPercent / 100;
  const bondsWeight = bondsPercent / 100;
  const cashWeight = cashPercent / 100;

  for (let y = 1; y <= years; y++) {
    const age = currentAge + y;
    const isRetired = age > retirementAge;

    // Generate correlated returns
    const [stockReturn, bondReturn, cashReturn] = generateCorrelatedReturns();

    // Portfolio return (weighted average)
    const portfolioReturn =
      stocksWeight * stockReturn +
      bondsWeight * bondReturn +
      cashWeight * cashReturn;

    // Pre-retirement: add contributions
    if (!isRetired) {
      balance += monthlyContribution * 12;
    }

    // Apply investment returns
    balance *= 1 + portfolioReturn;

    // Post-retirement: withdrawals and income
    if (isRetired) {
      const yearsRetired = age - retirementAge;

      // Calculate spending
      let spending = annualSpending * Math.pow(1 + inflationRate, y);
      if (spendingSmile) {
        spending *= getSpendingSmileMultiplier(yearsRetired);
      }

      // Calculate income
      let income = otherMonthlyIncome * 12 * Math.pow(1 + inflationRate, y);

      // Social Security with 1.5% COLA
      if (age >= socialSecurityAge) {
        const ssYears = age - socialSecurityAge;
        income += socialSecurityMonthly * 12 * Math.pow(1.015, ssYears);
      }

      // Net withdrawal
      const netWithdrawal = spending - income;
      balance -= netWithdrawal;

      // Check for failure (ran out of money)
      if (balance <= 0) {
        success = false;
        balance = 0;
      }
    }

    balances.push(Math.max(balance, 0));
  }

  return { balances, success };
}

/**
 * Run Monte Carlo simulation for retirement planning
 */
export function runMonteCarloSimulation(inputs: MonteCarloInputs): MonteCarloResult {
  const numSimulations = inputs.numSimulations || 1000;
  const years = inputs.lifeExpectancy - inputs.currentAge;

  const allBalances: number[][] = [];
  let successCount = 0;

  // Run simulations
  for (let sim = 0; sim < numSimulations; sim++) {
    const result = runSingleSimulation(inputs, years);
    allBalances.push(result.balances);
    if (result.success) successCount++;
  }

  // Calculate percentiles for each year
  const percentiles: PercentileData[] = [];
  for (let y = 0; y <= years; y++) {
    const vals = allBalances.map((r) => r[y]).sort((a, b) => a - b);
    percentiles.push({
      age: inputs.currentAge + y,
      p10: vals[Math.floor(numSimulations * 0.1)] || 0,
      p25: vals[Math.floor(numSimulations * 0.25)] || 0,
      p50: vals[Math.floor(numSimulations * 0.5)] || 0,
      p75: vals[Math.floor(numSimulations * 0.75)] || 0,
      p90: vals[Math.floor(numSimulations * 0.9)] || 0,
    });
  }

  // Get values at age 85 if available
  const at85Index = percentiles.findIndex(p => p.age === 85);
  const at85 = at85Index >= 0 ? percentiles[at85Index] : percentiles[percentiles.length - 1];

  // Run comparison simulation (retire 5 years later)
  const delayYears = Math.min(5, 70 - inputs.retirementAge);
  const delayedInputs = { ...inputs, retirementAge: inputs.retirementAge + delayYears };

  let delayedSuccessCount = 0;
  const delayedBalances: number[][] = [];

  for (let sim = 0; sim < numSimulations; sim++) {
    const result = runSingleSimulation(delayedInputs, years);
    delayedBalances.push(result.balances);
    if (result.success) delayedSuccessCount++;
  }

  // Get delayed median at 85
  const delayedAt85Index = Math.min(85 - inputs.currentAge, delayedBalances[0]?.length - 1 || 0);
  const delayedVals = delayedBalances.map(r => r[delayedAt85Index] || 0).sort((a, b) => a - b);
  const delayedMedianAt85 = delayedVals[Math.floor(numSimulations * 0.5)] || 0;

  return {
    percentiles,
    successRate: (successCount / numSimulations) * 100,
    medianEndingWealth: percentiles[percentiles.length - 1].p50,
    worstCaseAt85: at85.p10,
    bestCaseAt85: at85.p90,
    medianAt85: at85.p50,
    comparison: {
      current: {
        successRate: (successCount / numSimulations) * 100,
        medianAt85: at85.p50,
      },
      delayed: {
        successRate: (delayedSuccessCount / numSimulations) * 100,
        medianAt85: delayedMedianAt85,
      },
      delayYears,
    },
    simulationCount: numSimulations,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Simplified simulation for backwards compatibility
 */
export function runSimpleMonteCarloSimulation(inputs: {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  totalSavings: number;
  monthlyContribution: number;
  annualSpending: number;
  socialSecurityAge: number;
  socialSecurityMonthly: number;
  inflationRate: number;
  numSimulations?: number;
  spendingSmile?: boolean;
}): MonteCarloResult {
  return runMonteCarloSimulation({
    ...inputs,
    stocksPercent: 60,
    bondsPercent: 30,
    cashPercent: 10,
    otherMonthlyIncome: 0,
    spendingSmile: inputs.spendingSmile ?? true,
  });
}

/**
 * Format currency for display
 */
export function formatCurrency(n: number, compact = false): string {
  if (compact) {
    if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  }
  return `$${Math.round(n).toLocaleString()}`;
}

/**
 * Calculate weeks remaining (for 1,000 Healthy Weeks visualization)
 */
export function calculateWeeksRemaining(currentAge: number, healthyLifeEnd = 85): number {
  return Math.max(0, Math.round((healthyLifeEnd - currentAge) * 52));
}

/**
 * Get risk profile label based on stock allocation
 */
export function getRiskProfile(stocksPercent: number): string {
  if (stocksPercent >= 80) return 'Aggressive';
  if (stocksPercent >= 60) return 'Growth';
  if (stocksPercent >= 40) return 'Moderate';
  if (stocksPercent >= 20) return 'Conservative';
  return 'Very Conservative';
}
