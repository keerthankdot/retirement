import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FinancialPlan, Income, Expense, Asset, Debt } from "@/types";

interface PlanState {
  // Current active plan
  currentPlan: FinancialPlan | null;

  // Financial data
  incomes: Income[];
  expenses: Expense[];
  assets: Asset[];
  debts: Debt[];

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentPlan: (plan: FinancialPlan | null) => void;
  setIncomes: (incomes: Income[]) => void;
  setExpenses: (expenses: Expense[]) => void;
  setAssets: (assets: Asset[]) => void;
  setDebts: (debts: Debt[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed values
  getTotalAssets: () => number;
  getTotalDebts: () => number;
  getNetWorth: () => number;
  getMonthlyIncome: () => number;
  getMonthlyExpenses: () => number;

  // Reset
  reset: () => void;
}

const initialState = {
  currentPlan: null,
  incomes: [],
  expenses: [],
  assets: [],
  debts: [],
  isLoading: false,
  error: null,
};

export const usePlanStore = create<PlanState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentPlan: (plan) => set({ currentPlan: plan }),
      setIncomes: (incomes) => set({ incomes }),
      setExpenses: (expenses) => set({ expenses }),
      setAssets: (assets) => set({ assets }),
      setDebts: (debts) => set({ debts }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      getTotalAssets: () => {
        const { assets } = get();
        return assets.reduce(
          (total, asset) => total + Number(asset.currentValue),
          0
        );
      },

      getTotalDebts: () => {
        const { debts } = get();
        return debts.reduce(
          (total, debt) => total + Number(debt.principalBalance),
          0
        );
      },

      getNetWorth: () => {
        const { getTotalAssets, getTotalDebts } = get();
        return getTotalAssets() - getTotalDebts();
      },

      getMonthlyIncome: () => {
        const { incomes } = get();
        return incomes.reduce((total, income) => {
          const amount = Number(income.amount);
          switch (income.frequency) {
            case "WEEKLY":
              return total + amount * 4.33;
            case "BI_WEEKLY":
              return total + amount * 2.17;
            case "SEMI_MONTHLY":
              return total + amount * 2;
            case "MONTHLY":
              return total + amount;
            case "QUARTERLY":
              return total + amount / 3;
            case "SEMI_ANNUALLY":
              return total + amount / 6;
            case "ANNUALLY":
              return total + amount / 12;
            default:
              return total;
          }
        }, 0);
      },

      getMonthlyExpenses: () => {
        const { expenses } = get();
        return expenses.reduce((total, expense) => {
          const amount = Number(expense.amount);
          switch (expense.frequency) {
            case "WEEKLY":
              return total + amount * 4.33;
            case "BI_WEEKLY":
              return total + amount * 2.17;
            case "SEMI_MONTHLY":
              return total + amount * 2;
            case "MONTHLY":
              return total + amount;
            case "QUARTERLY":
              return total + amount / 3;
            case "SEMI_ANNUALLY":
              return total + amount / 6;
            case "ANNUALLY":
              return total + amount / 12;
            default:
              return total;
          }
        }, 0);
      },

      reset: () => set(initialState),
    }),
    {
      name: "financial-plan-storage",
      partialize: (state) => ({
        currentPlan: state.currentPlan,
      }),
    }
  )
);
