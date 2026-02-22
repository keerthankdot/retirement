"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  PiggyBank,
  CreditCard,
  Home,
  Shield,
  Briefcase,
  Heart,
  ChevronDown,
  Check,
  ExternalLink,
} from "lucide-react";
import {
  type FinancialProfile as ProfileType,
  getDefaultProfile,
  calculateComputed,
  calculateCompletionPercent,
  formatCurrency,
  parseCurrencyInput,
  SECTION_TIPS,
} from "@/lib/calculations/profile";

// ============================================================================
// DOLLAR INPUT COMPONENT
// ============================================================================

interface DollarInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  placeholder?: string;
}

function DollarInput({ value, onChange, label, placeholder = "0" }: DollarInputProps) {
  const [displayValue, setDisplayValue] = useState(value > 0 ? formatCurrency(value).replace("$", "") : "");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused && value > 0) {
      setDisplayValue(formatCurrency(value).replace("$", ""));
    } else if (!isFocused && value === 0) {
      setDisplayValue("");
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    setDisplayValue(value > 0 ? value.toString() : "");
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseCurrencyInput(displayValue);
    onChange(parsed);
    setDisplayValue(parsed > 0 ? formatCurrency(parsed).replace("$", "") : "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    setDisplayValue(raw);
  };

  return (
    <div>
      <Label className="text-[11px] uppercase tracking-wider text-[#9CA89E] font-semibold mb-2 block">
        {label}
      </Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B6F47]">$</span>
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full pl-7 pr-4 py-3 border border-[#E0D8CC] rounded-xl bg-white text-[#2C3E2D] text-right font-medium focus:outline-none focus:border-[#4A7C59] focus:ring-1 focus:ring-[#4A7C59]/20 transition-colors"
          aria-label={`${label} in dollars`}
        />
      </div>
    </div>
  );
}

// ============================================================================
// AZUL TIP COMPONENT
// ============================================================================

function AzulTip({ tip }: { tip: string }) {
  return (
    <div className="mt-4 p-4 bg-[#D4A853]/10 rounded-xl border-l-3 border-[#D4A853]">
      <p className="text-sm text-[#8B6F47] italic leading-relaxed">
        &ldquo;{tip}&rdquo;
      </p>
      <p className="text-xs text-[#D4A853] font-semibold mt-1">— Azul</p>
    </div>
  );
}

// ============================================================================
// SECTION HEADER COMPONENT
// ============================================================================

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  value: string;
  isComplete: boolean;
  isOpen: boolean;
  onClick: () => void;
  color: string;
  bgColor: string;
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  value,
  isComplete,
  isOpen,
  onClick,
  color,
  bgColor,
}: SectionHeaderProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 hover:bg-[#F2ECE0]/50 transition-colors ${
        isOpen ? "bg-[#F2ECE0]/30" : ""
      }`}
      aria-expanded={isOpen}
    >
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-xl ${bgColor} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-[#2C3E2D]">{title}</span>
            {isComplete && (
              <div className="h-2 w-2 rounded-full bg-[#4A7C59]" />
            )}
          </div>
          <span className="text-sm text-[#9CA89E]">{subtitle}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`font-serif text-lg font-bold ${isComplete ? "text-[#4A7C59]" : "text-[#9CA89E]"}`}>
          {value}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-[#9CA89E] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>
    </button>
  );
}

// ============================================================================
// SECTION WRAPPER
// ============================================================================

interface SectionProps {
  isOpen: boolean;
  children: React.ReactNode;
}

function SectionBody({ isOpen, children }: SectionProps) {
  if (!isOpen) return null;

  return (
    <div className="px-4 pb-4 pt-2 border-t border-[#E0D8CC] bg-white">
      {children}
    </div>
  );
}

// ============================================================================
// MAIN FINANCIAL PROFILE COMPONENT
// ============================================================================

export function FinancialProfile() {
  const [profile, setProfile] = useState<ProfileType>(() => getDefaultProfile());
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const profileRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("azul-financial-profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile({ ...getDefaultProfile(), ...parsed });
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  // Auto-save on profile changes (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSaveStatus("saving");
      const computed = calculateComputed(profile);
      const completionPercent = calculateCompletionPercent(profile);
      const withComputed = {
        ...profile,
        computed,
        completionPercent,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem("azul-financial-profile", JSON.stringify(withComputed));
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 1500);
    }, 500);
    return () => clearTimeout(timeout);
  }, [profile]);

  // Computed values
  const computed = useMemo(() => calculateComputed(profile), [profile]);
  const completionPercent = useMemo(() => calculateCompletionPercent(profile), [profile]);

  // Update helpers
  const updateIncome = useCallback((data: Partial<ProfileType["income"]>) => {
    setProfile((prev) => ({ ...prev, income: { ...prev.income, ...data } }));
  }, []);

  const updateExpenses = useCallback((data: Partial<ProfileType["expenses"]>) => {
    setProfile((prev) => ({ ...prev, expenses: { ...prev.expenses, ...data } }));
  }, []);

  const updateAssets = useCallback((data: Partial<ProfileType["assets"]>) => {
    setProfile((prev) => ({ ...prev, assets: { ...prev.assets, ...data } }));
  }, []);

  const updateDebts = useCallback((data: Partial<ProfileType["debts"]>) => {
    setProfile((prev) => ({ ...prev, debts: { ...prev.debts, ...data } }));
  }, []);

  const updateSocialSecurity = useCallback((data: Partial<ProfileType["socialSecurity"]>) => {
    setProfile((prev) => ({ ...prev, socialSecurity: { ...prev.socialSecurity, ...data } }));
  }, []);

  const updatePensions = useCallback((data: Partial<ProfileType["pensions"]>) => {
    setProfile((prev) => ({ ...prev, pensions: { ...prev.pensions, ...data } }));
  }, []);

  const updateRealEstate = useCallback((data: Partial<ProfileType["realEstate"]>) => {
    setProfile((prev) => ({ ...prev, realEstate: { ...prev.realEstate, ...data } }));
  }, []);

  const updateInsurance = useCallback((data: Partial<ProfileType["insurance"]>) => {
    setProfile((prev) => ({ ...prev, insurance: { ...prev.insurance, ...data } }));
  }, []);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  // Auto-calculate retirement expenses
  useEffect(() => {
    if (profile.expenses.monthlyExpenses > 0 && profile.expenses.retirementMonthlyExpenses === 0) {
      updateExpenses({ retirementMonthlyExpenses: Math.round(profile.expenses.monthlyExpenses * 0.8) });
    }
  }, [profile.expenses.monthlyExpenses, profile.expenses.retirementMonthlyExpenses, updateExpenses]);

  // Section completion checks
  const isIncomeComplete = profile.income.annualSalary > 0;
  const isExpensesComplete = profile.expenses.monthlyExpenses > 0;
  const isAssetsComplete = computed.totalSavings > 0;
  const isDebtsComplete = true; // Always "complete" since $0 is valid
  const isSocialSecurityComplete = profile.socialSecurity.monthlyBenefit > 0;
  const isPensionsComplete = true;
  const isRealEstateComplete = true;
  const isInsuranceComplete = true;

  return (
    <div ref={profileRef} id="financial-profile" className="mb-8">
      {/* Summary Bar */}
      <div className="bg-white rounded-2xl border border-[#E0D8CC] p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold text-[#2C3E2D]">Your Complete Picture</h2>
          <div className="flex items-center gap-2">
            {saveStatus === "saved" && (
              <span className="text-xs text-[#4A7C59] flex items-center gap-1">
                <Check className="h-3 w-3" /> Saved
              </span>
            )}
          </div>
        </div>

        {/* Completion Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-[#6B7B6E]">
              Your picture: {completionPercent}% complete
            </span>
            <span className="text-[#9CA89E]">
              {Math.round(completionPercent / 25)} of 4 core sections
            </span>
          </div>
          <div className="h-2 bg-[#E8DCC8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4A7C59] rounded-full transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          {completionPercent < 50 && (
            <p className="text-xs text-[#8B6F47] mt-2 italic">
              The more complete your picture, the more accurate your tools will be.
            </p>
          )}
        </div>

        {/* Summary Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center p-3 bg-[#F2ECE0] rounded-xl">
            <div className="text-[10px] text-[#9CA89E] uppercase tracking-wider mb-1">Net Worth</div>
            <div className={`font-serif text-xl font-bold ${computed.netWorth >= 0 ? "text-[#4A7C59]" : "text-[#C45B4A]"}`}>
              {formatCurrency(computed.netWorth, true)}
            </div>
          </div>
          <div className="text-center p-3 bg-[#F2ECE0] rounded-xl">
            <div className="text-[10px] text-[#9CA89E] uppercase tracking-wider mb-1">Monthly Income</div>
            <div className="font-serif text-xl font-bold text-[#2C3E2D]">
              {formatCurrency(computed.monthlyIncome, true)}
            </div>
          </div>
          <div className="text-center p-3 bg-[#F2ECE0] rounded-xl">
            <div className="text-[10px] text-[#9CA89E] uppercase tracking-wider mb-1">Monthly Expenses</div>
            <div className="font-serif text-xl font-bold text-[#D4A853]">
              {formatCurrency(profile.expenses.monthlyExpenses, true)}
            </div>
          </div>
          <div className="text-center p-3 bg-[#F2ECE0] rounded-xl">
            <div className="text-[10px] text-[#9CA89E] uppercase tracking-wider mb-1">Total Savings</div>
            <div className="font-serif text-xl font-bold text-[#4A7C59]">
              {formatCurrency(computed.totalSavings, true)}
            </div>
          </div>
          <div className="text-center p-3 bg-[#F2ECE0] rounded-xl">
            <div className="text-[10px] text-[#9CA89E] uppercase tracking-wider mb-1">Monthly Gap</div>
            <div className={`font-serif text-xl font-bold ${computed.monthlySurplus >= 0 ? "text-[#4A7C59]" : "text-[#C45B4A]"}`}>
              {computed.monthlySurplus >= 0 ? "+" : ""}{formatCurrency(computed.monthlySurplus, true)}
            </div>
          </div>
          <div className="text-center p-3 bg-[#F2ECE0] rounded-xl">
            <div className="text-[10px] text-[#9CA89E] uppercase tracking-wider mb-1">Ready Score</div>
            <div className="flex items-center justify-center gap-1">
              <div
                className={`h-2 w-2 rounded-full ${
                  computed.retirementReadyScore >= 80
                    ? "bg-[#4A7C59]"
                    : computed.retirementReadyScore >= 50
                    ? "bg-[#D4A853]"
                    : "bg-[#C45B4A]"
                }`}
              />
              <span className="font-serif text-xl font-bold text-[#2C3E2D]">
                {computed.retirementReadyScore}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State / Welcome */}
      {completionPercent === 0 && (
        <div className="bg-[#D4A853]/10 rounded-2xl p-6 mb-4 border border-[#D4A853]/20">
          <p className="font-serif text-lg text-[#2C3E2D] italic text-center">
            &ldquo;Before we can map your retirement, we need to know where you stand today.
            Think of this as a friendly snapshot — not a tax return.&rdquo;
          </p>
          <p className="text-center mt-2 text-[#D4A853] font-semibold">— Azul</p>
          <p className="text-center text-sm text-[#6B7B6E] mt-4">
            Start with what you know. You can always come back and add more later.
          </p>
        </div>
      )}

      {/* Accordion Sections */}
      <div className="bg-white rounded-2xl border border-[#E0D8CC] overflow-hidden divide-y divide-[#E0D8CC]">
        {/* 1. Income */}
        <div>
          <SectionHeader
            icon={DollarSign}
            title="Income"
            subtitle="Salary, side income, rental"
            value={computed.monthlyIncome > 0 ? `${formatCurrency(computed.monthlyIncome)}/mo` : "Add →"}
            isComplete={isIncomeComplete}
            isOpen={openSection === "income"}
            onClick={() => toggleSection("income")}
            color="text-[#4A7C59]"
            bgColor="bg-[#4A7C59]/10"
          />
          <SectionBody isOpen={openSection === "income"}>
            <div className="grid md:grid-cols-2 gap-4">
              <DollarInput
                label="Annual Salary (Pre-tax)"
                value={profile.income.annualSalary}
                onChange={(v) => updateIncome({ annualSalary: v })}
              />
              <DollarInput
                label="Other Monthly Income"
                value={profile.income.otherMonthlyIncome}
                onChange={(v) => updateIncome({ otherMonthlyIncome: v })}
              />
            </div>
            <div className="mt-4">
              <Label className="text-[11px] uppercase tracking-wider text-[#9CA89E] font-semibold mb-2 block">
                Expected Retirement Age
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[profile.income.expectedRetirementAge]}
                  onValueChange={([v]) => updateIncome({ expectedRetirementAge: v })}
                  min={50}
                  max={75}
                  step={1}
                  className="flex-1 [&_[role=slider]]:bg-[#4A7C59]"
                />
                <span className="font-serif text-2xl font-bold text-[#2C3E2D] w-12 text-right">
                  {profile.income.expectedRetirementAge}
                </span>
              </div>
            </div>
            <AzulTip tip={SECTION_TIPS.income} />
          </SectionBody>
        </div>

        {/* 2. Expenses */}
        <div>
          <SectionHeader
            icon={CreditCard}
            title="Expenses"
            subtitle="Monthly spending and budget"
            value={profile.expenses.monthlyExpenses > 0 ? `${formatCurrency(profile.expenses.monthlyExpenses)}/mo` : "Add →"}
            isComplete={isExpensesComplete}
            isOpen={openSection === "expenses"}
            onClick={() => toggleSection("expenses")}
            color="text-[#D4A853]"
            bgColor="bg-[#D4A853]/10"
          />
          <SectionBody isOpen={openSection === "expenses"}>
            <div className="grid md:grid-cols-2 gap-4">
              <DollarInput
                label="Current Monthly Expenses"
                value={profile.expenses.monthlyExpenses}
                onChange={(v) => updateExpenses({ monthlyExpenses: v })}
              />
              <div>
                <DollarInput
                  label="Retirement Monthly Expenses"
                  value={profile.expenses.retirementMonthlyExpenses}
                  onChange={(v) => updateExpenses({ retirementMonthlyExpenses: v })}
                />
                <p className="text-xs text-[#9CA89E] mt-1">
                  Default: 80% of current expenses
                </p>
              </div>
            </div>
            <AzulTip tip={SECTION_TIPS.expenses} />
          </SectionBody>
        </div>

        {/* 3. Assets */}
        <div>
          <SectionHeader
            icon={TrendingUp}
            title="Assets"
            subtitle="Retirement accounts and savings"
            value={computed.totalSavings > 0 ? formatCurrency(computed.totalSavings, true) : "Add →"}
            isComplete={isAssetsComplete}
            isOpen={openSection === "assets"}
            onClick={() => toggleSection("assets")}
            color="text-[#4A7C59]"
            bgColor="bg-[#4A7C59]/10"
          />
          <SectionBody isOpen={openSection === "assets"}>
            <div className="grid md:grid-cols-2 gap-4">
              <DollarInput
                label="401(k) / 403(b) Balance"
                value={profile.assets.traditional401k}
                onChange={(v) => updateAssets({ traditional401k: v })}
              />
              <DollarInput
                label="Traditional IRA Balance"
                value={profile.assets.traditionalIRA}
                onChange={(v) => updateAssets({ traditionalIRA: v })}
              />
              <DollarInput
                label="Roth IRA / Roth 401(k)"
                value={profile.assets.rothAccounts}
                onChange={(v) => updateAssets({ rothAccounts: v })}
              />
              <DollarInput
                label="Brokerage / Taxable Accounts"
                value={profile.assets.brokerageAccounts}
                onChange={(v) => updateAssets({ brokerageAccounts: v })}
              />
              <DollarInput
                label="Cash / Savings"
                value={profile.assets.cashSavings}
                onChange={(v) => updateAssets({ cashSavings: v })}
              />
              <DollarInput
                label="Monthly Contributions (Total)"
                value={profile.assets.monthlyContributions}
                onChange={(v) => updateAssets({ monthlyContributions: v })}
              />
            </div>
            <div className="mt-4 p-3 bg-[#E8F0EA] rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6B7B6E]">Total Savings</span>
                <span className="font-serif text-xl font-bold text-[#4A7C59]">
                  {formatCurrency(computed.totalSavings)}
                </span>
              </div>
            </div>
            <AzulTip tip={SECTION_TIPS.assets} />
          </SectionBody>
        </div>

        {/* 4. Debts */}
        <div>
          <SectionHeader
            icon={PiggyBank}
            title="Debts"
            subtitle="Mortgage, loans, credit cards"
            value={computed.totalDebt > 0 ? formatCurrency(computed.totalDebt, true) : "$0"}
            isComplete={isDebtsComplete}
            isOpen={openSection === "debts"}
            onClick={() => toggleSection("debts")}
            color="text-[#C45B4A]"
            bgColor="bg-[#C45B4A]/10"
          />
          <SectionBody isOpen={openSection === "debts"}>
            <div className="grid md:grid-cols-2 gap-4">
              <DollarInput
                label="Mortgage Balance"
                value={profile.debts.mortgageBalance}
                onChange={(v) => updateDebts({ mortgageBalance: v })}
              />
              <DollarInput
                label="Mortgage Monthly Payment"
                value={profile.debts.mortgageMonthlyPayment}
                onChange={(v) => updateDebts({ mortgageMonthlyPayment: v })}
              />
              <DollarInput
                label="Other Debt (Total)"
                value={profile.debts.otherDebtBalance}
                onChange={(v) => updateDebts({ otherDebtBalance: v })}
              />
              <DollarInput
                label="Other Debt Monthly Payment"
                value={profile.debts.otherDebtMonthlyPayment}
                onChange={(v) => updateDebts({ otherDebtMonthlyPayment: v })}
              />
            </div>
            <AzulTip tip={SECTION_TIPS.debts} />
          </SectionBody>
        </div>

        {/* 5. Social Security */}
        <div>
          <SectionHeader
            icon={Briefcase}
            title="Social Security"
            subtitle="Your estimated benefit"
            value={profile.socialSecurity.monthlyBenefit > 0 ? `${formatCurrency(profile.socialSecurity.monthlyBenefit)}/mo` : "Add →"}
            isComplete={isSocialSecurityComplete}
            isOpen={openSection === "socialSecurity"}
            onClick={() => toggleSection("socialSecurity")}
            color="text-[#4A7C59]"
            bgColor="bg-[#4A7C59]/10"
          />
          <SectionBody isOpen={openSection === "socialSecurity"}>
            <div className="grid md:grid-cols-2 gap-4">
              <DollarInput
                label="Your Monthly Benefit"
                value={profile.socialSecurity.monthlyBenefit}
                onChange={(v) => updateSocialSecurity({ monthlyBenefit: v })}
              />
              <div>
                <Label className="text-[11px] uppercase tracking-wider text-[#9CA89E] font-semibold mb-2 block">
                  Claiming Age
                </Label>
                <Select
                  value={profile.socialSecurity.claimingAge.toString()}
                  onValueChange={(v) => updateSocialSecurity({ claimingAge: parseInt(v) })}
                >
                  <SelectTrigger className="border-[#E0D8CC]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[62, 63, 64, 65, 66, 67, 68, 69, 70].map((age) => (
                      <SelectItem key={age} value={age.toString()}>
                        {age} {age === 67 ? "(Full Retirement Age)" : age === 70 ? "(Maximum Benefit)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {profile.socialSecurity.monthlyBenefit > 0 && (
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <DollarInput
                  label="Spouse's Monthly Benefit (Optional)"
                  value={profile.socialSecurity.spouseMonthlyBenefit}
                  onChange={(v) => updateSocialSecurity({ spouseMonthlyBenefit: v })}
                />
                {profile.socialSecurity.spouseMonthlyBenefit > 0 && (
                  <div>
                    <Label className="text-[11px] uppercase tracking-wider text-[#9CA89E] font-semibold mb-2 block">
                      Spouse&apos;s Claiming Age
                    </Label>
                    <Select
                      value={profile.socialSecurity.spouseClaimingAge.toString()}
                      onValueChange={(v) => updateSocialSecurity({ spouseClaimingAge: parseInt(v) })}
                    >
                      <SelectTrigger className="border-[#E0D8CC]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[62, 63, 64, 65, 66, 67, 68, 69, 70].map((age) => (
                          <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}
            <a
              href="https://www.ssa.gov/myaccount/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-[#4A7C59] hover:underline mt-4"
            >
              Don&apos;t know your benefit? Check my.ssa.gov
              <ExternalLink className="h-3 w-3" />
            </a>
            <AzulTip tip={SECTION_TIPS.socialSecurity} />
          </SectionBody>
        </div>

        {/* 6. Pensions & Annuities */}
        <div>
          <SectionHeader
            icon={Heart}
            title="Pensions & Annuities"
            subtitle="Guaranteed income streams"
            value={profile.pensions.monthlyBenefit > 0 ? `${formatCurrency(profile.pensions.monthlyBenefit)}/mo` : "None"}
            isComplete={isPensionsComplete}
            isOpen={openSection === "pensions"}
            onClick={() => toggleSection("pensions")}
            color="text-[#8B6F47]"
            bgColor="bg-[#8B6F47]/10"
          />
          <SectionBody isOpen={openSection === "pensions"}>
            <div className="grid md:grid-cols-2 gap-4">
              <DollarInput
                label="Pension Monthly Benefit"
                value={profile.pensions.monthlyBenefit}
                onChange={(v) => updatePensions({ monthlyBenefit: v })}
              />
              <div>
                <Label className="text-[11px] uppercase tracking-wider text-[#9CA89E] font-semibold mb-2 block">
                  Pension Start Age
                </Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[profile.pensions.startAge]}
                    onValueChange={([v]) => updatePensions({ startAge: v })}
                    min={55}
                    max={70}
                    step={1}
                    className="flex-1 [&_[role=slider]]:bg-[#8B6F47]"
                  />
                  <span className="font-serif text-xl font-bold text-[#2C3E2D] w-12 text-right">
                    {profile.pensions.startAge}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <Switch
                checked={profile.pensions.hasCOLA}
                onCheckedChange={(v) => updatePensions({ hasCOLA: v })}
              />
              <Label className="text-sm text-[#6B7B6E]">
                Pension has cost-of-living adjustment (COLA)
              </Label>
            </div>
            <div className="mt-4">
              <DollarInput
                label="Annuity Income (Monthly)"
                value={profile.pensions.annuityIncome}
                onChange={(v) => updatePensions({ annuityIncome: v })}
              />
            </div>
            <AzulTip tip={SECTION_TIPS.pensions} />
          </SectionBody>
        </div>

        {/* 7. Real Estate */}
        <div>
          <SectionHeader
            icon={Home}
            title="Real Estate"
            subtitle="Home equity and rental properties"
            value={profile.realEstate.homeValue > 0 ? formatCurrency(profile.realEstate.homeValue, true) : "$0"}
            isComplete={isRealEstateComplete}
            isOpen={openSection === "realEstate"}
            onClick={() => toggleSection("realEstate")}
            color="text-[#8B6F47]"
            bgColor="bg-[#8B6F47]/10"
          />
          <SectionBody isOpen={openSection === "realEstate"}>
            <div className="grid md:grid-cols-2 gap-4">
              <DollarInput
                label="Primary Home Value"
                value={profile.realEstate.homeValue}
                onChange={(v) => updateRealEstate({ homeValue: v })}
              />
              <DollarInput
                label="Rental Property Income (Monthly)"
                value={profile.realEstate.rentalIncome}
                onChange={(v) => updateRealEstate({ rentalIncome: v })}
              />
            </div>
            <div className="flex items-center gap-3 mt-4">
              <Switch
                checked={profile.realEstate.planToSell}
                onCheckedChange={(v) => updateRealEstate({ planToSell: v })}
              />
              <Label className="text-sm text-[#6B7B6E]">
                Plan to sell home in retirement
              </Label>
            </div>
            {profile.realEstate.planToSell && (
              <div className="mt-4">
                <Label className="text-[11px] uppercase tracking-wider text-[#9CA89E] font-semibold mb-2 block">
                  Estimated Sale Age
                </Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[profile.realEstate.saleAge]}
                    onValueChange={([v]) => updateRealEstate({ saleAge: v })}
                    min={60}
                    max={85}
                    step={1}
                    className="flex-1 [&_[role=slider]]:bg-[#8B6F47]"
                  />
                  <span className="font-serif text-xl font-bold text-[#2C3E2D] w-12 text-right">
                    {profile.realEstate.saleAge}
                  </span>
                </div>
              </div>
            )}
            <AzulTip tip={SECTION_TIPS.realEstate} />
          </SectionBody>
        </div>

        {/* 8. Insurance */}
        <div>
          <SectionHeader
            icon={Shield}
            title="Insurance"
            subtitle="Health, life, and long-term care"
            value="Active"
            isComplete={isInsuranceComplete}
            isOpen={openSection === "insurance"}
            onClick={() => toggleSection("insurance")}
            color="text-[#2C3E2D]"
            bgColor="bg-[#2C3E2D]/10"
          />
          <SectionBody isOpen={openSection === "insurance"}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-[11px] uppercase tracking-wider text-[#9CA89E] font-semibold mb-2 block">
                  Health Insurance Plan
                </Label>
                <Select
                  value={profile.insurance.healthPlan}
                  onValueChange={(v) => updateInsurance({ healthPlan: v as ProfileType["insurance"]["healthPlan"] })}
                >
                  <SelectTrigger className="border-[#E0D8CC]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employer">Employer-provided</SelectItem>
                    <SelectItem value="aca">ACA Marketplace</SelectItem>
                    <SelectItem value="medicare">Medicare</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DollarInput
                label="Monthly Premium (Post-Retirement)"
                value={profile.insurance.monthlyPremium}
                onChange={(v) => updateInsurance({ monthlyPremium: v })}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-3">
                <Switch
                  checked={profile.insurance.hasLongTermCare}
                  onCheckedChange={(v) => updateInsurance({ hasLongTermCare: v })}
                />
                <Label className="text-sm text-[#6B7B6E]">
                  Have long-term care insurance
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={profile.insurance.hasLifeInsurance}
                  onCheckedChange={(v) => updateInsurance({ hasLifeInsurance: v })}
                />
                <Label className="text-sm text-[#6B7B6E]">
                  Have life insurance
                </Label>
              </div>
            </div>
            <AzulTip tip={SECTION_TIPS.insurance} />
          </SectionBody>
        </div>
      </div>
    </div>
  );
}
