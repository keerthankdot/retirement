import type { User, FinancialPlan, Income, Expense, Asset, Debt } from "@prisma/client";

// Re-export Prisma types
export type { User, FinancialPlan, Income, Expense, Asset, Debt };

// Financial projection types
export interface FinancialYear {
  year: number;
  age: number;
  income: {
    salary: number;
    socialSecurity: number;
    pension: number;
    rental: number;
    investment: number;
    other: number;
    total: number;
  };
  expenses: {
    essential: number;
    discretionary: number;
    healthcare: number;
    taxes: number;
    total: number;
  };
  assets: {
    taxable: number;
    taxDeferred: number;
    taxFree: number;
    realEstate: number;
    total: number;
  };
  debts: {
    mortgage: number;
    other: number;
    total: number;
  };
  netWorth: number;
  cashFlow: number;
  withdrawals: number;
  portfolioReturn: number;
}

export interface ProjectionResult {
  years: FinancialYear[];
  successProbability?: number;
  runsOutOfMoneyYear?: number;
  peakNetWorth: { year: number; value: number };
  lowestNetWorth: { year: number; value: number };
}

// Monte Carlo types
export interface MonteCarloConfig {
  simulationCount: number;
  startYear: number;
  endYear: number;
  inflationMean: number;
  inflationStdDev: number;
  assetReturns: {
    stocks: { mean: number; stdDev: number };
    bonds: { mean: number; stdDev: number };
    cash: { mean: number; stdDev: number };
  };
  correlations: number[][];
  withdrawalStrategy: "fixed" | "percentage" | "guardrails" | "variable";
  withdrawalRate?: number;
}

export interface MonteCarloResultData {
  successRate: number;
  percentiles: {
    p10: number[];
    p25: number[];
    p50: number[];
    p75: number[];
    p90: number[];
  };
  medianEndingWealth: number;
  worstCase: number;
  bestCase: number;
  runsOutOfMoneyDistribution: (number | null)[];
}

// Scenario types
export type ModificationType =
  | "CHANGE_RETIREMENT_AGE"
  | "CHANGE_SOCIAL_SECURITY_CLAIMING_AGE"
  | "ROTH_CONVERSION"
  | "ADD_INCOME_SOURCE"
  | "REMOVE_INCOME_SOURCE"
  | "CHANGE_EXPENSE"
  | "SELL_REAL_ESTATE"
  | "PAY_OFF_DEBT"
  | "CHANGE_ALLOCATION"
  | "CHANGE_SAVINGS_RATE"
  | "ADD_PENSION"
  | "CHANGE_STATE_RESIDENCE";

export interface ScenarioModification {
  type: ModificationType;
  params: Record<string, unknown>;
  startYear?: number;
  endYear?: number;
}

export interface ScenarioData {
  id: string;
  name: string;
  baselineId?: string;
  modifications: ScenarioModification[];
}

// Tax types
export interface TaxInput {
  year: number;
  filingStatus: "SINGLE" | "MARRIED_FILING_JOINTLY" | "MARRIED_FILING_SEPARATELY" | "HEAD_OF_HOUSEHOLD" | "QUALIFYING_WIDOW";
  grossIncome: number;
  wages: number;
  selfEmploymentIncome: number;
  qualifiedDividends: number;
  longTermCapitalGains: number;
  shortTermCapitalGains: number;
  socialSecurityBenefits: number;
  pensionIncome: number;
  iraDistributions: number;
  itemizedDeductions?: number;
  charitableContributions?: number;
  mortgageInterest?: number;
  stateLocalTaxes?: number;
  medicalExpenses?: number;
  childTaxCreditEligibleChildren?: number;
  dependentCareExpenses?: number;
}

export interface TaxResult {
  federalIncomeTax: number;
  selfEmploymentTax: number;
  stateTax: number;
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  breakdown: {
    ordinaryIncomeTax: number;
    capitalGainsTax: number;
    nicaTax: number;
  };
}

// Form data types for creating/updating records
export interface IncomeFormData {
  name: string;
  type: string;
  amount: number;
  frequency: string;
  startDate?: Date;
  endDate?: Date;
  growthRate?: number;
  isTaxable?: boolean;
  taxCategory?: string;
  notes?: string;
}

export interface ExpenseFormData {
  name: string;
  category: string;
  amount: number;
  frequency: string;
  startDate?: Date;
  endDate?: Date;
  inflationAdjusted?: boolean;
  isEssential?: boolean;
  notes?: string;
}

export interface AssetFormData {
  name: string;
  type: string;
  currentValue: number;
  purchaseDate?: Date;
  costBasis?: number;
  expectedReturn?: number;
  volatility?: number;
  accountType?: string;
  contributions?: number;
  employerMatch?: number;
  stockAllocation?: number;
  bondAllocation?: number;
  cashAllocation?: number;
  notes?: string;
}

export interface DebtFormData {
  name: string;
  type: string;
  principalBalance: number;
  interestRate: number;
  minimumPayment: number;
  startDate?: Date;
  termMonths?: number;
  isInterestDeductible?: boolean;
  notes?: string;
}

// Dashboard summary types
export interface DashboardSummary {
  netWorth: number;
  totalAssets: number;
  totalDebts: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyCashFlow: number;
  retirementReadinessScore?: number;
  lastUpdated: Date;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
