"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, ChevronRight, Check, TrendingUp, Calendar, DollarSign, PiggyBank, Loader2 } from "lucide-react";
import {
  runMonteCarloSimulation,
  formatCurrency,
  calculateWeeksRemaining,
  getRiskProfile,
  type MonteCarloInputs,
  type MonteCarloResult,
} from "@/lib/calculations/monte-carlo/simulator";
import { MonteCarloFanChart } from "./MonteCarloFanChart";
import { SpendingSmileChart } from "./SpendingSmileChart";
import { WeeksCountdown } from "./WeeksCountdown";
import { SuccessRateHero } from "./SuccessRateHero";
import { AzulQuote, getAzulQuote, AZUL_QUOTES } from "./AzulQuote";

const steps = [
  { title: "Let's Start With You", icon: Calendar },
  { title: "What You've Built", icon: PiggyBank },
  { title: "Your Retirement Life", icon: DollarSign },
  { title: "Your Retirement Roadmap", icon: TrendingUp },
];

interface SliderInputProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  format?: (value: number) => string;
}

function SliderInput({ label, hint, value, onChange, min, max, step = 1, format }: SliderInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-baseline">
        <Label className="text-sm font-semibold text-[#2C3E2D]">{label}</Label>
        <span className="font-serif text-2xl font-bold text-[#4A7C59]">
          {format ? format(value) : value}
        </span>
      </div>
      {hint && <p className="text-xs text-[#6B7B6E]">{hint}</p>}
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-[#9CA89E]">
        <span>{format ? format(min) : min}</span>
        <span>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}

export function RetirementCalculator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [inputs, setInputs] = useState<MonteCarloInputs>({
    currentAge: 55,
    retirementAge: 62,
    lifeExpectancy: 92,
    totalSavings: 800000,
    monthlyContribution: 2000,
    stocksPercent: 60,
    bondsPercent: 30,
    cashPercent: 10,
    annualSpending: 72000,
    spendingSmile: true,
    socialSecurityAge: 67,
    socialSecurityMonthly: 2800,
    otherMonthlyIncome: 0,
    inflationRate: 0.03,
    numSimulations: 1000,
  });

  const [result, setResult] = useState<MonteCarloResult | null>(null);

  const updateInput = useCallback(<K extends keyof MonteCarloInputs>(key: K) => (value: MonteCarloInputs[K]) => {
    setInputs((prev) => {
      const newInputs = { ...prev, [key]: value };

      // When current age changes, ensure retirement age stays valid
      if (key === "currentAge") {
        const newCurrentAge = value as number;
        const minRetirementAge = Math.max(newCurrentAge + 1, 50);
        if (newInputs.retirementAge < minRetirementAge) {
          newInputs.retirementAge = minRetirementAge;
        }
        if (newInputs.lifeExpectancy <= newInputs.retirementAge) {
          newInputs.lifeExpectancy = Math.max(newInputs.retirementAge + 10, 80);
        }
      }

      // When retirement age changes, ensure life expectancy stays valid
      if (key === "retirementAge") {
        const newRetirementAge = value as number;
        if (newInputs.lifeExpectancy <= newRetirementAge) {
          newInputs.lifeExpectancy = Math.max(newRetirementAge + 10, 80);
        }
      }

      // When allocation changes, adjust to keep total at 100
      if (key === "stocksPercent" || key === "bondsPercent") {
        const stocks = key === "stocksPercent" ? (value as number) : newInputs.stocksPercent;
        const bonds = key === "bondsPercent" ? (value as number) : newInputs.bondsPercent;
        const remaining = 100 - stocks - bonds;
        newInputs.cashPercent = Math.max(0, remaining);

        // If cash would go negative, reduce bonds
        if (remaining < 0) {
          newInputs.bondsPercent = Math.max(0, 100 - stocks);
          newInputs.cashPercent = 0;
        }
      }

      return newInputs;
    });
  }, []);

  // Run simulation when moving to results step
  const runSimulation = useCallback(async () => {
    setIsCalculating(true);

    // Use setTimeout to not block UI
    await new Promise(resolve => setTimeout(resolve, 100));

    const simulationResult = runMonteCarloSimulation(inputs);
    setResult(simulationResult);
    setIsCalculating(false);
  }, [inputs]);

  const handleNext = useCallback(async () => {
    if (currentStep === 2) {
      // Moving to results - run simulation
      await runSimulation();
    }
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  }, [currentStep, runSimulation]);

  const canGoBack = currentStep > 0;
  const canGoForward = currentStep < steps.length - 1;

  const weeksRemaining = calculateWeeksRemaining(inputs.currentAge);
  const riskProfile = getRiskProfile(inputs.stocksPercent);

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-0 mb-8">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;

          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => i < currentStep && setCurrentStep(i)}
                disabled={i > currentStep}
                className={`
                  w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all
                  ${isCompleted ? "bg-[#4A7C59] border-[#4A7C59] text-white cursor-pointer hover:scale-105" : ""}
                  ${isCurrent ? "bg-[#E8F0EA] border-[#4A7C59] text-[#4A7C59]" : ""}
                  ${!isCompleted && !isCurrent ? "border-[#E0D8CC] text-[#9CA89E] cursor-not-allowed" : ""}
                `}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </button>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${i < currentStep ? "bg-[#4A7C59]" : "bg-[#E0D8CC]"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card className="border-[#E0D8CC] rounded-2xl">
        <CardHeader>
          <CardTitle className="font-serif text-2xl text-[#2C3E2D]">{steps[currentStep].title}</CardTitle>
          <CardDescription className="text-[#6B7B6E]">
            {currentStep === 0 && "Let's start with some basic information about you."}
            {currentStep === 1 && "Tell us about your current savings and how you invest."}
            {currentStep === 2 && "Plan your retirement spending and income sources."}
            {currentStep === 3 && "Your personalized retirement projection based on 1,000 market scenarios."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Step 0: About You */}
          {currentStep === 0 && (
            <>
              <SliderInput
                label="Your current age"
                value={inputs.currentAge}
                onChange={updateInput("currentAge")}
                min={30}
                max={75}
              />
              <SliderInput
                label="Target retirement age"
                hint="When do you want to stop working?"
                value={inputs.retirementAge}
                onChange={updateInput("retirementAge")}
                min={Math.max(inputs.currentAge + 1, 50)}
                max={75}
              />
              <SliderInput
                label="Plan through age"
                hint="How long should we plan for? Most people underestimate longevity."
                value={inputs.lifeExpectancy}
                onChange={updateInput("lifeExpectancy")}
                min={80}
                max={100}
              />

              <AzulQuote variant="highlight">
                {getAzulQuote('intro', { age: inputs.currentAge, weeks: weeksRemaining })}
              </AzulQuote>
            </>
          )}

          {/* Step 1: Savings */}
          {currentStep === 1 && (
            <>
              <SliderInput
                label="Total retirement savings"
                hint="All accounts combined: 401(k), IRA, Roth, brokerage, savings."
                value={inputs.totalSavings}
                onChange={updateInput("totalSavings")}
                min={0}
                max={5000000}
                step={25000}
                format={(v) => formatCurrency(v, true)}
              />
              <SliderInput
                label="Monthly contributions"
                hint="How much are you adding each month until retirement?"
                value={inputs.monthlyContribution}
                onChange={updateInput("monthlyContribution")}
                min={0}
                max={10000}
                step={100}
                format={(v) => formatCurrency(v)}
              />

              <Separator className="bg-[#E0D8CC]" />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-semibold text-[#2C3E2D]">Asset Allocation</Label>
                  <Badge variant="outline" className="border-[#4A7C59] text-[#4A7C59]">
                    {riskProfile}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#6B7B6E]">Stocks</span>
                      <span className="font-semibold text-[#2C3E2D]">{inputs.stocksPercent}%</span>
                    </div>
                    <Slider
                      value={[inputs.stocksPercent]}
                      onValueChange={([v]) => updateInput("stocksPercent")(v)}
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#6B7B6E]">Bonds</span>
                      <span className="font-semibold text-[#2C3E2D]">{inputs.bondsPercent}%</span>
                    </div>
                    <Slider
                      value={[inputs.bondsPercent]}
                      onValueChange={([v]) => updateInput("bondsPercent")(v)}
                      min={0}
                      max={100 - inputs.stocksPercent}
                      step={5}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#6B7B6E]">Cash</span>
                      <span className="font-semibold text-[#2C3E2D]">{inputs.cashPercent}%</span>
                    </div>
                    <div className="h-2 bg-[#E8F0EA] rounded-full">
                      <div
                        className="h-full bg-[#9CA89E] rounded-full"
                        style={{ width: `${inputs.cashPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <AzulQuote variant="default">
                {getAzulQuote('savings', { savings: inputs.totalSavings })}
              </AzulQuote>
            </>
          )}

          {/* Step 2: Retirement Life */}
          {currentStep === 2 && (
            <>
              <SliderInput
                label="Annual spending in retirement"
                hint="A common starting point is 70-80% of your current income."
                value={inputs.annualSpending}
                onChange={updateInput("annualSpending")}
                min={30000}
                max={200000}
                step={1000}
                format={(v) => formatCurrency(v)}
              />

              <div className="flex items-center justify-between p-4 bg-[#F2ECE0] rounded-xl border border-[#E8DCC8]">
                <div>
                  <Label className="text-sm font-semibold text-[#2C3E2D]">Use Spending Smile</Label>
                  <p className="text-xs text-[#6B7B6E] mt-1">
                    Azul&apos;s framework: Go-Go, Slow-Go, No-Go years
                  </p>
                </div>
                <Switch
                  checked={inputs.spendingSmile}
                  onCheckedChange={(checked) => updateInput("spendingSmile")(checked)}
                />
              </div>

              <Separator className="bg-[#E0D8CC]" />

              <SliderInput
                label="Social Security claiming age"
                hint="62 (reduced), 67 (full), or 70 (max benefit). Delaying increases your check."
                value={inputs.socialSecurityAge}
                onChange={updateInput("socialSecurityAge")}
                min={62}
                max={70}
              />
              <SliderInput
                label="Expected monthly Social Security"
                hint="Check ssa.gov/myaccount for your estimate."
                value={inputs.socialSecurityMonthly}
                onChange={updateInput("socialSecurityMonthly")}
                min={0}
                max={5000}
                step={50}
                format={(v) => formatCurrency(v)}
              />
              <SliderInput
                label="Other monthly income"
                hint="Pension, rental income, part-time work, etc."
                value={inputs.otherMonthlyIncome}
                onChange={updateInput("otherMonthlyIncome")}
                min={0}
                max={10000}
                step={100}
                format={(v) => formatCurrency(v)}
              />

              <AzulQuote variant="highlight">
                {inputs.spendingSmile ? AZUL_QUOTES.spendingSmileExplain : AZUL_QUOTES.flatSpending}
              </AzulQuote>
            </>
          )}

          {/* Step 3: Results */}
          {currentStep === 3 && (
            <>
              {isCalculating ? (
                <div className="py-20 text-center">
                  <Loader2 className="w-12 h-12 mx-auto text-[#4A7C59] animate-spin mb-4" />
                  <p className="text-lg text-[#6B7B6E] italic">{AZUL_QUOTES.loading}</p>
                </div>
              ) : result ? (
                <div className="space-y-6 -mx-6 -mb-6">
                  {/* Disclaimer */}
                  <div className="mx-6 bg-[#F2ECE0] rounded-xl p-4 border border-[#E8DCC8]">
                    <div className="flex gap-3">
                      <span className="text-base flex-shrink-0">📋</span>
                      <p className="text-[11px] text-[#8B6F47] leading-relaxed">
                        <strong>Educational Tool:</strong> This calculator provides general estimates for educational purposes only.
                        It does not constitute financial advice. Consult a qualified fee-only financial advisor for personalized planning.
                      </p>
                    </div>
                  </div>

                  {/* Success Rate Hero */}
                  <div className="px-6">
                    <SuccessRateHero successRate={result.successRate} />
                  </div>

                  {/* Azul Quote for Results */}
                  <div className="px-6">
                    <AzulQuote variant="highlight">
                      {getAzulQuote('results', { successRate: result.successRate })}
                    </AzulQuote>
                  </div>

                  {/* Weeks Countdown */}
                  <div className="px-6">
                    <WeeksCountdown currentAge={inputs.currentAge} />
                  </div>

                  {/* Fan Chart */}
                  <div className="px-6">
                    <MonteCarloFanChart
                      data={result.percentiles}
                      retirementAge={inputs.retirementAge}
                      currentAge={inputs.currentAge}
                    />
                  </div>

                  {/* Spending Smile */}
                  {inputs.spendingSmile && (
                    <div className="px-6">
                      <SpendingSmileChart
                        retirementAge={inputs.retirementAge}
                        annualSpending={inputs.annualSpending}
                      />
                    </div>
                  )}

                  {/* Retire Now vs Later Comparison */}
                  <div className="px-6">
                    <Card className="border-[#E0D8CC] rounded-2xl">
                      <CardHeader>
                        <CardTitle className="font-serif text-xl text-[#2C3E2D]">
                          Retire at {inputs.retirementAge} vs. {inputs.retirementAge + result.comparison.delayYears}
                        </CardTitle>
                        <CardDescription className="text-[#6B7B6E]">
                          What does waiting {result.comparison.delayYears} more years buy you?
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-xl p-5 bg-[#D4A853]/10 border-2 border-[#D4A853]/30">
                            <Badge className="bg-[#D4A853] text-[#2C3E2D] mb-2">Azul&apos;s pick ☀️</Badge>
                            <div className="font-serif text-lg font-semibold text-[#2C3E2D] mb-4">
                              Retire at {inputs.retirementAge}
                            </div>
                            <div className="space-y-3">
                              <div>
                                <div className="text-[11px] text-[#9CA89E] uppercase tracking-wide">Success Rate</div>
                                <div className={`font-serif text-3xl font-bold ${result.comparison.current.successRate >= 80 ? "text-[#4A7C59]" : result.comparison.current.successRate >= 60 ? "text-[#D4A853]" : "text-[#C45B4A]"}`}>
                                  {Math.round(result.comparison.current.successRate)}%
                                </div>
                              </div>
                              <div>
                                <div className="text-[11px] text-[#9CA89E] uppercase tracking-wide">Portfolio at 85</div>
                                <div className="font-serif text-xl font-bold text-[#2C3E2D]">
                                  {formatCurrency(result.comparison.current.medianAt85, true)}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-xl p-5 bg-[#4A7C59]/10 border-2 border-[#4A7C59]/30">
                            <Badge variant="secondary" className="bg-[#E8F0EA] text-[#4A7C59] mb-2">
                              The safe choice
                            </Badge>
                            <div className="font-serif text-lg font-semibold text-[#2C3E2D] mb-4">
                              Retire at {inputs.retirementAge + result.comparison.delayYears}
                            </div>
                            <div className="space-y-3">
                              <div>
                                <div className="text-[11px] text-[#9CA89E] uppercase tracking-wide">Success Rate</div>
                                <div className={`font-serif text-3xl font-bold ${result.comparison.delayed.successRate >= 80 ? "text-[#4A7C59]" : result.comparison.delayed.successRate >= 60 ? "text-[#D4A853]" : "text-[#C45B4A]"}`}>
                                  {Math.round(result.comparison.delayed.successRate)}%
                                </div>
                              </div>
                              <div>
                                <div className="text-[11px] text-[#9CA89E] uppercase tracking-wide">Portfolio at 85</div>
                                <div className="font-serif text-xl font-bold text-[#2C3E2D]">
                                  {formatCurrency(result.comparison.delayed.medianAt85, true)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <AzulQuote variant="highlight">
                            {AZUL_QUOTES.retireNow}
                          </AzulQuote>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Summary Stats */}
                  <div className="px-6 grid grid-cols-3 gap-4">
                    {[
                      { label: "Median at 85", value: formatCurrency(result.medianAt85, true), sub: "50th percentile" },
                      { label: "Worst Case at 85", value: formatCurrency(result.worstCaseAt85, true), sub: "10th percentile" },
                      { label: "Monthly Budget", value: formatCurrency(Math.round(inputs.annualSpending / 12)), sub: `${formatCurrency(inputs.annualSpending)}/year` },
                    ].map((stat, i) => (
                      <Card key={i} className="border-[#E0D8CC] rounded-xl">
                        <CardContent className="pt-6 text-center">
                          <div className="text-[11px] text-[#9CA89E] uppercase tracking-wide mb-2">{stat.label}</div>
                          <div className="font-serif text-2xl font-bold text-[#2C3E2D] mb-1">{stat.value}</div>
                          <div className="text-xs text-[#6B7B6E]">{stat.sub}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Separator className="mx-6 bg-[#E0D8CC]" />
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((s) => s - 1)}
          disabled={!canGoBack}
          className="border-[#4A7C59] text-[#4A7C59] hover:bg-[#E8F0EA]"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        {canGoForward && (
          <Button
            onClick={handleNext}
            disabled={isCalculating}
            className="bg-[#4A7C59] hover:bg-[#3A6B49]"
          >
            {isCalculating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                {currentStep === 2 ? "See My Roadmap" : "Continue"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        )}
        {currentStep === 3 && result && (
          <Button
            onClick={() => setCurrentStep(0)}
            className="bg-[#D4A853] hover:bg-[#B8912E] text-[#2C3E2D]"
          >
            Adjust Your Plan
          </Button>
        )}
      </div>
    </div>
  );
}
