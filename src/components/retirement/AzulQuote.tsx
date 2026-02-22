"use client";

interface AzulQuoteProps {
  children: React.ReactNode;
  variant?: "default" | "highlight" | "subtle";
  className?: string;
}

export function AzulQuote({ children, variant = "default", className = "" }: AzulQuoteProps) {
  const variants = {
    default: "bg-transparent border-l-[3px] border-[#D4A853] pl-4",
    highlight: "bg-[#D4A853]/10 border border-[#D4A853]/25 rounded-xl p-4",
    subtle: "bg-[#E8F0EA] border-l-[3px] border-[#4A7C59] pl-4",
  };

  return (
    <aside className={`${variants[variant]} ${className}`}>
      <p className="text-sm italic text-[#8B6F47] leading-relaxed">
        {children}
      </p>
      <p className="mt-2 text-sm font-serif font-semibold text-[#D4A853]">
        — Azul
      </p>
    </aside>
  );
}

// Pre-defined quotes for different contexts
export const AZUL_QUOTES = {
  // Step 1: About You
  intro: "Most of us have fewer than 1,000 healthy weeks after 60. Let's make a plan to enjoy every one of them.",
  ageWarning: "At {age}, you have roughly {weeks} healthy weeks remaining. Make them count.",

  // Step 2: Savings
  lowSavings: "Don't let the number discourage you. The best time to start was yesterday — the second best time is right now.",
  moderateSavings: "You're building something real. Every dollar saved is a dollar that works for your future self.",
  highSavings: "You've done the hard part. Now let's see how this works for your future self.",

  // Step 3: Spending
  spendingSmileExplain: "Most people spend more in their 60s, less in their 70s, and more again in their 80s — that's your Spending Smile.",
  flatSpending: "Flat spending is simpler to plan, but it doesn't match how most people actually live in retirement.",

  // Step 4: Results
  highSuccess: "Your future looks bright. Now the question isn't whether you can retire — it's whether you should wait.",
  moderateSuccess: "You're in a solid position. A few small adjustments could make all the difference.",
  lowSuccess: "This isn't a red flag — it's a roadmap. Let's figure out what moves the needle for you.",

  // Comparison
  retireNow: "Don't fall for the 'one more year' trap. The math might say wait — but your healthy weeks are counting down.",

  // General
  timeValue: "Time is the one resource you can never get back. Spend it wisely.",
  feeOnly: "I'm a fee-only advisor. That means I don't sell products — I just give you honest math.",
  loading: "Running 1,000 possible futures for you...",
};

export function getAzulQuote(
  context: 'intro' | 'savings' | 'spending' | 'results',
  params?: { age?: number; weeks?: number; savings?: number; successRate?: number }
): string {
  switch (context) {
    case 'intro':
      if (params?.age && params?.weeks) {
        return AZUL_QUOTES.ageWarning
          .replace('{age}', params.age.toString())
          .replace('{weeks}', params.weeks.toLocaleString());
      }
      return AZUL_QUOTES.intro;

    case 'savings':
      if (params?.savings) {
        if (params.savings < 200000) return AZUL_QUOTES.lowSavings;
        if (params.savings < 1000000) return AZUL_QUOTES.moderateSavings;
        return AZUL_QUOTES.highSavings;
      }
      return AZUL_QUOTES.moderateSavings;

    case 'spending':
      return AZUL_QUOTES.spendingSmileExplain;

    case 'results':
      if (params?.successRate) {
        if (params.successRate >= 90) return AZUL_QUOTES.highSuccess;
        if (params.successRate >= 70) return AZUL_QUOTES.moderateSuccess;
        return AZUL_QUOTES.lowSuccess;
      }
      return AZUL_QUOTES.moderateSuccess;

    default:
      return AZUL_QUOTES.intro;
  }
}
