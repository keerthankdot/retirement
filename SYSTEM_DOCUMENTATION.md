# Azul Wells Retirement Roadmap

## System Documentation

---

## Overview

Azul Wells Retirement Roadmap is a comprehensive financial planning web application that helps users plan their retirement with confidence. Built on Azul Wells' fee-only philosophy, it provides educational tools including Monte Carlo simulations, the Spending Smile framework, and the 1,000 Healthy Weeks countdown.

**Live URL:** http://localhost:3000

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | shadcn/ui (Radix primitives) |
| **Database** | PostgreSQL |
| **ORM** | Prisma 5 |
| **Authentication** | NextAuth.js v5 (Auth.js) |
| **Fonts** | Playfair Display (headings), Source Sans 3 (body) |

---

## Project Structure

```
financial-planner/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── (auth)/                   # Auth routes (login, register)
│   │   ├── (dashboard)/              # Protected dashboard (future)
│   │   ├── about/                    # Fee-Only Philosophy page
│   │   ├── plan/                     # Financial overview page
│   │   ├── retirement/               # Monte Carlo calculator
│   │   ├── api/                      # API routes
│   │   │   ├── auth/                 # NextAuth + registration
│   │   │   └── plans/                # Financial plan CRUD
│   │   ├── layout.tsx                # Root layout with fonts
│   │   ├── page.tsx                  # Landing page
│   │   └── globals.css               # Tailwind + design tokens
│   │
│   ├── components/
│   │   ├── layouts/                  # Sidebar, Header
│   │   ├── retirement/               # Calculator components
│   │   │   ├── RetirementCalculator.tsx
│   │   │   ├── MonteCarloChart.tsx
│   │   │   ├── SpendingSmileChart.tsx
│   │   │   └── WeeksCountdown.tsx
│   │   └── ui/                       # shadcn/ui components
│   │
│   └── lib/
│       ├── auth/                     # NextAuth configuration
│       ├── calculations/
│       │   └── monte-carlo/
│       │       └── simulator.ts      # Monte Carlo engine
│       └── db/
│           └── prisma.ts             # Prisma client singleton
│
├── prisma/
│   └── schema.prisma                 # Database schema
│
├── .env                              # Environment variables
└── package.json
```

---

## Core Features

### 1. Monte Carlo Retirement Simulator

**Location:** `/src/lib/calculations/monte-carlo/simulator.ts`

The heart of the application. Runs 1,000 simulated market scenarios to determine retirement success probability.

**Inputs:**
- Current age, retirement age, life expectancy
- Total savings and monthly contributions
- Annual spending in retirement
- Social Security claiming age and benefit amount
- Inflation rate assumption

**Outputs:**
- Success rate (% of simulations where money lasts)
- Portfolio projections by percentile (10th, 25th, 50th, 75th, 90th)
- Worst-case scenario at age 85

**Algorithm:**
- Uses Box-Muller transform for Gaussian random number generation
- Models market returns with mean 7% and standard deviation 15%
- Applies the Spending Smile adjustment (Go-Go, Slow-Go, No-Go phases)
- Accounts for inflation-adjusted withdrawals

### 2. The Spending Smile

**Location:** `/src/components/retirement/SpendingSmileChart.tsx`

Visualizes Azul's signature framework showing how retirement spending changes over time:

| Phase | Years | Spending Multiplier | Description |
|-------|-------|---------------------|-------------|
| Go-Go | 62-72 | 105% | Active travel and hobbies |
| Slow-Go | 72-82 | 80% | Settling into retirement |
| No-Go | 82-92 | 105% | Healthcare costs rise |

### 3. 1,000 Healthy Weeks Countdown

**Location:** `/src/components/retirement/WeeksCountdown.tsx`

An emotional visualization showing how many healthy, active weeks remain until age 85. Features:
- 25x25 dot matrix grid
- Golden gradient fill based on remaining weeks
- Dark forest green panel with radial glow
- Azul quote: "Time is the one resource you can never get back."

### 4. Retire Now vs. Later Comparison

Built into the retirement calculator results. Compares:
- Retiring at user's chosen age ("Azul's pick")
- Retiring 5 years later ("The safe choice")

Shows success rate and median portfolio at 85 for both scenarios.

---

## Design System

### Brand Identity

Based on Azul Wells' philosophy: warm, approachable, and trust-building. Inspired by golden hour light on a countryside walk.

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `parchment` | `#FAF6F1` | Page background |
| `forest` | `#2C3E2D` | Primary text, dark panels |
| `forest-light` | `#3A5240` | Dark panel gradients |
| `gold` | `#D4A853` | Accent, Azul's voice, highlights |
| `gold-light` | `#E8D5A0` | Hover states |
| `sage` | `#4A7C59` | Success, buttons, positive states |
| `sage-light` | `#E8F0EA` | Light green backgrounds |
| `terracotta` | `#C45B4A` | Warnings, low success rates |
| `sand` | `#E8DCC8` | Disclaimers, dividers |
| `warm` | `#8B6F47` | Quote text |
| `border` | `#E0D8CC` | All borders |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Page titles | Playfair Display | 32-36px | 800 |
| Section headings | Playfair Display | 26-28px | 700 |
| Card headings | Playfair Display | 20-22px | 700 |
| Large stats | Playfair Display | 48-56px | 700 |
| Body text | Source Sans 3 | 14-15px | 400 |
| Labels | Source Sans 3 | 11-12px | 600 |

### Component Patterns

**Cards:**
```css
background: #FFFFFF
border: 1px solid #E0D8CC
border-radius: 16px
padding: 28px 24px
```

**Dark Panels:**
```css
background: linear-gradient(135deg, #2C3E2D, #3A5240)
/* With radial glow in corner */
```

**Buttons (Primary):**
```css
background: #4A7C59
color: #FFFFFF
border-radius: 10px
padding: 12px 32px
```

---

## Database Schema

**Key Models:**

```prisma
User
├── id, email, password, name
├── subscriptionTier (FREE, PLUS, ADVISORY)
└── FinancialPlan[]

FinancialPlan
├── retirementAge, lifeExpectancy
├── stateOfResidence, inflationAssumption
├── Income[], Expense[], Asset[], Debt[]
├── RealEstate[], SocialSecurityBenefit[]
├── Pension[], Annuity[], Insurance[]
├── Scenario[], MonteCarloResult[]

MonteCarloResult
├── successRate, medianAt85, worstCaseAt85
├── percentileData (JSON)
└── assumptions (JSON)
```

---

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/[...nextauth]` | * | NextAuth handlers |
| `/api/auth/register` | POST | User registration |
| `/api/plans` | GET, POST | List/create plans |
| `/api/plans/[planId]` | GET, PATCH, DELETE | Single plan CRUD |
| `/api/plans/[planId]/income` | GET, POST | Income entries |
| `/api/plans/[planId]/expenses` | GET, POST | Expense entries |
| `/api/plans/[planId]/assets` | GET, POST | Asset entries |
| `/api/plans/[planId]/debts` | GET, POST | Debt entries |

---

## Pages

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Landing page with hero, features, pricing | No |
| `/retirement` | Monte Carlo calculator | No |
| `/plan` | Financial overview dashboard | No |
| `/about` | Fee-Only Philosophy page | No |
| `/login` | Sign in page | No |
| `/register` | Sign up page | No |

---

## Key Files

### Monte Carlo Simulator
`/src/lib/calculations/monte-carlo/simulator.ts`

Exports:
- `runMonteCarloSimulation(inputs)` - Main simulation function
- `calculateWeeksRemaining(age, endAge)` - Weeks countdown
- `formatCurrency(value, abbreviated?)` - Currency formatting
- `MonteCarloInputs` - Input type
- `MonteCarloResult` - Output type

### Retirement Calculator Component
`/src/components/retirement/RetirementCalculator.tsx`

A 4-step wizard:
1. **About You** - Age, retirement age, life expectancy
2. **Savings** - Total savings, monthly contributions
3. **Retirement** - Annual spending, Social Security
4. **Your Roadmap** - Results with all visualizations

### Global Styles
`/src/app/globals.css`

Contains:
- Tailwind CSS v4 imports
- CSS custom properties for all colors
- Light and dark mode tokens
- Container centering styles
- `.dark-panel` utility class

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
AUTH_SECRET="..."
AUTH_URL="http://localhost:3000"

# OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

---

## Running the Application

```bash
# Install dependencies
npm install

# Set up database
npx prisma db push

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Regulatory Approach

Following Boldin's model:
- **Core product:** Educational calculators (minimal regulation)
- **No personalized investment advice** in the app
- **Advisory tier:** Partners with licensed CFPs
- **Disclaimers:** Present on all results screens

Sample disclaimer text:
> "This calculator provides general estimates for educational purposes only. It does not constitute financial advice. Consult a qualified fee-only financial advisor for personalized planning."

---

## Future Enhancements

1. **Social Security Optimizer** - Calculate optimal claiming age
2. **Tax Engine** - Federal + 50 state tax calculations
3. **What-If Scenarios** - Compare multiple retirement scenarios
4. **Roth Conversion Analyzer** - Tax-efficient conversion strategies
5. **Real Estate Modeling** - Property appreciation and rental income
6. **Stripe Integration** - Subscription payments for premium tiers

---

## Brand Voice Guidelines

**Azul sounds like:** A warm, experienced friend who genuinely wants you to enjoy your life.

**Tone rules:**
- Use contractions ("you'll", "don't")
- Prefer active voice
- Short sentences
- No financial jargon
- Never fear-inducing

**Words Azul uses:** retire early, healthy weeks, spend intentionally, fee-only, go-go years, slow-go years, no-go years, spending smile, one more year syndrome

**Words to avoid:** optimize, maximize returns, wealth accumulation, aggressive strategy, portfolio rebalancing, leverage, synergy

---

*Built with Next.js, TypeScript, and Tailwind CSS*
