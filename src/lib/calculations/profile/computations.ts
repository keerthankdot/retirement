/**
 * Financial Profile Computations
 *
 * Calculates derived values from the user's financial profile.
 * These computed values feed into Monte Carlo and other tools.
 */

export interface FinancialProfile {
  lastUpdated: string;
  completionPercent: number;

  income: {
    annualSalary: number;
    otherMonthlyIncome: number;
    expectedRetirementAge: number;
  };

  expenses: {
    monthlyExpenses: number;
    retirementMonthlyExpenses: number;
    majorExpenses: { description: string; amount: number; year: number }[];
  };

  assets: {
    traditional401k: number;
    traditionalIRA: number;
    rothAccounts: number;
    brokerageAccounts: number;
    cashSavings: number;
    monthlyContributions: number;
  };

  debts: {
    mortgageBalance: number;
    mortgageMonthlyPayment: number;
    otherDebtBalance: number;
    otherDebtMonthlyPayment: number;
  };

  socialSecurity: {
    monthlyBenefit: number;
    claimingAge: number;
    spouseMonthlyBenefit: number;
    spouseClaimingAge: number;
  };

  pensions: {
    monthlyBenefit: number;
    startAge: number;
    hasCOLA: boolean;
    annuityIncome: number;
  };

  realEstate: {
    homeValue: number;
    planToSell: boolean;
    saleAge: number;
    rentalIncome: number;
  };

  insurance: {
    healthPlan: "employer" | "aca" | "medicare" | "other";
    monthlyPremium: number;
    hasLongTermCare: boolean;
    hasLifeInsurance: boolean;
  };

  computed: {
    netWorth: number;
    totalSavings: number;
    monthlyIncome: number;
    monthlySurplus: number;
    totalDebt: number;
    retirementReadyScore: number;
  };
}

export function getDefaultProfile(): FinancialProfile {
  return {
    lastUpdated: new Date().toISOString(),
    completionPercent: 0,

    income: {
      annualSalary: 0,
      otherMonthlyIncome: 0,
      expectedRetirementAge: 62,
    },

    expenses: {
      monthlyExpenses: 0,
      retirementMonthlyExpenses: 0,
      majorExpenses: [],
    },

    assets: {
      traditional401k: 0,
      traditionalIRA: 0,
      rothAccounts: 0,
      brokerageAccounts: 0,
      cashSavings: 0,
      monthlyContributions: 0,
    },

    debts: {
      mortgageBalance: 0,
      mortgageMonthlyPayment: 0,
      otherDebtBalance: 0,
      otherDebtMonthlyPayment: 0,
    },

    socialSecurity: {
      monthlyBenefit: 0,
      claimingAge: 67,
      spouseMonthlyBenefit: 0,
      spouseClaimingAge: 67,
    },

    pensions: {
      monthlyBenefit: 0,
      startAge: 65,
      hasCOLA: false,
      annuityIncome: 0,
    },

    realEstate: {
      homeValue: 0,
      planToSell: false,
      saleAge: 70,
      rentalIncome: 0,
    },

    insurance: {
      healthPlan: "employer",
      monthlyPremium: 0,
      hasLongTermCare: false,
      hasLifeInsurance: false,
    },

    computed: {
      netWorth: 0,
      totalSavings: 0,
      monthlyIncome: 0,
      monthlySurplus: 0,
      totalDebt: 0,
      retirementReadyScore: 0,
    },
  };
}

export function calculateComputed(
  profile: Omit<FinancialProfile, "computed">
): FinancialProfile["computed"] {
  const { income, expenses, assets, debts, realEstate } = profile;

  // Total savings (all investment accounts)
  const totalSavings =
    assets.traditional401k +
    assets.traditionalIRA +
    assets.rothAccounts +
    assets.brokerageAccounts +
    assets.cashSavings;

  // Total debt
  const totalDebt = debts.mortgageBalance + debts.otherDebtBalance;

  // Net worth = assets + real estate - debts
  const netWorth = totalSavings + realEstate.homeValue - totalDebt;

  // Monthly income
  const monthlyIncome = income.annualSalary / 12 + income.otherMonthlyIncome;

  // Monthly surplus
  const monthlySurplus = monthlyIncome - expenses.monthlyExpenses;

  // Simple retirement readiness score (heuristic, not full Monte Carlo)
  // Based on savings rate and years to retirement
  let retirementReadyScore = 0;
  if (income.annualSalary > 0 && expenses.monthlyExpenses > 0) {
    const savingsRate = assets.monthlyContributions / monthlyIncome;
    const yearsToRetirement = Math.max(0, income.expectedRetirementAge - 55); // Assume ~55 avg user
    const targetSavings = expenses.monthlyExpenses * 12 * 25; // 25x annual expenses rule
    const savingsProgress = totalSavings / targetSavings;

    // Score components
    const savingsRateScore = Math.min(savingsRate * 100 * 2, 30); // Up to 30 points for 15%+ savings rate
    const progressScore = Math.min(savingsProgress * 50, 50); // Up to 50 points for reaching target
    const timeScore = yearsToRetirement > 5 ? 20 : yearsToRetirement * 4; // Up to 20 points

    retirementReadyScore = Math.round(savingsRateScore + progressScore + timeScore);
    retirementReadyScore = Math.max(0, Math.min(100, retirementReadyScore));
  }

  return {
    netWorth,
    totalSavings,
    monthlyIncome,
    monthlySurplus,
    totalDebt,
    retirementReadyScore,
  };
}

export function calculateCompletionPercent(profile: FinancialProfile): number {
  const sections = [
    // Income: has salary or other income
    profile.income.annualSalary > 0 || profile.income.otherMonthlyIncome > 0,
    // Expenses: has monthly expenses
    profile.expenses.monthlyExpenses > 0,
    // Assets: has any savings
    profile.assets.traditional401k > 0 ||
      profile.assets.traditionalIRA > 0 ||
      profile.assets.rothAccounts > 0 ||
      profile.assets.brokerageAccounts > 0 ||
      profile.assets.cashSavings > 0,
    // Debts: marked as complete (either has debt or explicitly $0)
    profile.debts.mortgageBalance >= 0, // Always true, but we check if user interacted
    // Social Security: has benefit entered
    profile.socialSecurity.monthlyBenefit > 0,
    // Pensions: has pension or marked N/A
    profile.pensions.monthlyBenefit >= 0, // Always true
    // Real Estate: has value or marked N/A
    profile.realEstate.homeValue >= 0, // Always true
    // Insurance: has plan selected
    true, // Default is "employer", so always complete
  ];

  // For MVP, we count sections with meaningful data
  const meaningfulSections = [
    profile.income.annualSalary > 0,
    profile.expenses.monthlyExpenses > 0,
    profile.assets.traditional401k +
      profile.assets.traditionalIRA +
      profile.assets.rothAccounts +
      profile.assets.brokerageAccounts +
      profile.assets.cashSavings >
      0,
    profile.socialSecurity.monthlyBenefit > 0,
  ];

  const completed = meaningfulSections.filter(Boolean).length;
  return Math.round((completed / 4) * 100); // Core 4 sections
}

export function formatCurrency(amount: number, compact = false): string {
  if (compact) {
    if (Math.abs(amount) >= 1_000_000) {
      return `$${(amount / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(amount) >= 1_000) {
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

export function parseCurrencyInput(value: string): number {
  // Remove all non-numeric characters except decimal point
  const cleaned = value.replace(/[^0-9.]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

// Azul tips for each section
export const SECTION_TIPS: Record<string, string> = {
  income:
    "Don't forget side income — rental, freelance, dividends. Every dollar shapes your picture.",
  expenses:
    "Most people spend about 80% of their working income in retirement. But your Go-Go years might be higher — that's what the Spending Smile is for.",
  assets:
    "This is the engine that powers your retirement. Every account matters, even the small ones.",
  debts:
    "Debt isn't a dealbreaker. Plenty of people retire with a mortgage. What matters is the monthly payment relative to your income.",
  socialSecurity:
    "Not sure about your benefit? Visit my.ssa.gov — it takes 5 minutes and it's the most important number on this page.",
  pensions:
    "If you have a pension, you're luckier than you think. This is guaranteed income — it changes everything.",
  realEstate:
    "Your home is an asset, but only if you plan to use it. If you're staying put, it's shelter — not retirement income.",
  insurance:
    "Healthcare is the wildcard in retirement. If you're retiring before 65, plan for the gap before Medicare.",
};
