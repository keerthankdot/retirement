import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  TrendingUp,
  Shield,
  PieChart,
  Target,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Calculator,
    title: "Monte Carlo Simulations",
    description:
      "1,000+ market scenarios to show you the real probability of your retirement success.",
    href: "/retirement",
  },
  {
    icon: TrendingUp,
    title: "The Spending Smile",
    description:
      "Azul's signature framework: Go-Go, Slow-Go, and No-Go years — because spending changes as you age.",
    href: "/spending-smile",
  },
  {
    icon: Clock,
    title: "1,000 Healthy Weeks",
    description:
      "See exactly how many healthy, active weeks you have left. Make them count.",
    href: "/healthy-weeks",
  },
  {
    icon: PieChart,
    title: "Your Complete Picture",
    description:
      "Income, expenses, assets, Social Security, pensions — all in one place, no spreadsheets needed.",
    href: "/plan",
  },
  {
    icon: Target,
    title: "Retire Sooner, Not Richer",
    description:
      "The math that shows whether you can retire now — or why waiting might not be worth it.",
    href: "/retirement",
  },
  {
    icon: Shield,
    title: "Fee-Only Philosophy",
    description:
      "Educational tools built on Azul's fee-only approach. No products to sell, just honest math.",
    href: "/about",
  },
];

const benefits = [
  "See your retirement success probability",
  "Understand the Spending Smile",
  "Count your healthy weeks ahead",
  "Model Social Security timing",
  "Compare retire-now vs. retire-later",
  "No jargon, just clarity",
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-[#2C3E2D] flex items-center justify-center">
              <span className="text-lg font-bold text-[#D4A853]">A</span>
            </div>
            <span className="text-xl font-serif font-bold text-[#2C3E2D]">Azul Wells</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
              Resources
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Start Planning</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold text-[#D4A853] uppercase tracking-wider mb-4">
                Retirement Roadmap
              </p>
              <h1 className="font-serif text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-[#2C3E2D]">
                Do NOT Waste the Youth of{" "}
                <span className="text-[#D4A853]">Your Senior Years</span>™
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl leading-relaxed">
                You have roughly 1,000 healthy weeks after 65. This tool shows you when you can
                retire — and why waiting another year might not be worth it.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="bg-[#4A7C59] hover:bg-[#3A6B49] text-white" asChild>
                  <Link href="/register">
                    Start Your Roadmap
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-[#4A7C59] text-[#4A7C59] hover:bg-[#E8F0EA]" asChild>
                  <Link href="#features">See How It Works</Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Free to explore. No credit card required.
              </p>
            </div>
          </div>
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#F2ECE0] to-background" />
        </section>

        {/* Azul Quote */}
        <section className="py-12">
          <div className="container">
            <div className="mx-auto max-w-2xl">
              <div className="rounded-2xl bg-[#D4A853]/10 border-2 border-[#D4A853]/25 p-8 text-center">
                <p className="text-lg italic text-[#8B6F47] leading-relaxed">
                  "I'm a big fan of retiring as soon as you can. The math usually works out
                  better than you think — and the time you gain is priceless."
                </p>
                <p className="mt-4 font-semibold text-[#2C3E2D]">— Azul Wells</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-[#F2ECE0]">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-[#2C3E2D]">
                Built on Azul's Framework
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Not another generic calculator. Every feature maps to Azul's retirement philosophy.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Link
                    key={feature.title}
                    href={feature.href}
                    className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-[#4A7C59]/30 hover:-translate-y-1"
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#4A7C59]/10 group-hover:bg-[#4A7C59]/20 transition-colors">
                      <Icon className="h-6 w-6 text-[#4A7C59]" />
                    </div>
                    <h3 className="mb-2 font-serif text-xl font-bold text-[#2C3E2D] group-hover:text-[#4A7C59] transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    <div className="mt-4 flex items-center text-sm font-medium text-[#4A7C59] opacity-0 group-hover:opacity-100 transition-opacity">
                      Try it now
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-[#2C3E2D]">
                  Clarity, Not Complexity
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  Most retirement tools overwhelm you with charts and jargon.
                  This one gives you the numbers that actually matter — and explains them in plain English.
                </p>
                <ul className="mt-8 space-y-4">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-[#4A7C59] flex-shrink-0" />
                      <span className="text-[#2C3E2D]">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button className="bg-[#4A7C59] hover:bg-[#3A6B49]" asChild>
                    <Link href="/register">
                      Build Your Roadmap
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="dark-panel rounded-2xl p-8 text-white overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-sm font-semibold text-[#D4A853] uppercase tracking-wider mb-2">
                      Your Healthy Weeks
                    </p>
                    <div className="text-6xl font-serif font-bold text-white leading-none mb-2">
                      1,040
                    </div>
                    <p className="text-[#FAF6F1]/70 text-sm">
                      weeks of healthy, active time remaining
                    </p>
                    <p className="mt-6 text-sm text-[#FAF6F1]/60 italic leading-relaxed">
                      "Time is the one resource you can never get back. Spend it wisely."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-[#F2ECE0]">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-[#2C3E2D]">
                Simple, Honest Pricing
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Start free. Upgrade when the math makes sense.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {/* Free Tier */}
              <div className="rounded-2xl border border-border bg-card p-8">
                <h3 className="font-serif text-xl font-bold text-[#2C3E2D]">Explorer</h3>
                <div className="mt-4">
                  <span className="font-serif text-4xl font-bold text-[#2C3E2D]">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Perfect for getting started
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4A7C59]" />
                    Basic retirement calculator
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4A7C59]" />
                    1,000 Weeks countdown
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4A7C59]" />
                    Spending Smile overview
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4A7C59]" />
                    1 financial scenario
                  </li>
                </ul>
                <Button className="mt-8 w-full border-[#4A7C59] text-[#4A7C59] hover:bg-[#E8F0EA]" variant="outline" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>

              {/* Plus Tier */}
              <div className="rounded-2xl border-2 border-[#4A7C59] bg-card p-8 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4A7C59] text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </div>
                <h3 className="font-serif text-xl font-bold text-[#2C3E2D]">Roadmap+</h3>
                <div className="mt-4">
                  <span className="font-serif text-4xl font-bold text-[#2C3E2D]">$12</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  For serious planners
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4A7C59]" />
                    Everything in Explorer
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4A7C59]" />
                    Full Monte Carlo analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4A7C59]" />
                    Retire-now vs. retire-later
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4A7C59]" />
                    Social Security optimizer
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4A7C59]" />
                    Unlimited scenarios
                  </li>
                </ul>
                <Button className="mt-8 w-full bg-[#4A7C59] hover:bg-[#3A6B49]" asChild>
                  <Link href="/register">Start Free Trial</Link>
                </Button>
              </div>

              {/* Advisory Tier */}
              <div className="rounded-2xl border border-border bg-card p-8">
                <h3 className="font-serif text-xl font-bold text-[#2C3E2D]">Advisory</h3>
                <div className="mt-4">
                  <span className="font-serif text-4xl font-bold text-[#2C3E2D]">$199</span>
                  <span className="text-muted-foreground">/session</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Expert guidance
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4A7C59]" />
                    Everything in Roadmap+
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4A7C59]" />
                    1:1 fee-only advisor call
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4A7C59]" />
                    Personalized plan review
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4A7C59]" />
                    Tax strategy session
                  </li>
                </ul>
                <Button className="mt-8 w-full border-[#4A7C59] text-[#4A7C59] hover:bg-[#E8F0EA]" variant="outline" asChild>
                  <Link href="/register">Book a Call</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container">
            <div className="dark-panel rounded-2xl p-12 text-center overflow-hidden">
              <div className="relative z-10 mx-auto max-w-2xl">
                <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-white">
                  Ready to See Your Roadmap?
                </h2>
                <p className="mt-4 text-lg text-[#FAF6F1]/80 leading-relaxed">
                  In 5 minutes, you'll know your retirement success probability
                  and how many healthy weeks you have to enjoy it.
                </p>
                <div className="mt-8">
                  <Button size="lg" className="bg-[#D4A853] hover:bg-[#B8912E] text-[#2C3E2D] font-semibold" asChild>
                    <Link href="/register">
                      Start Planning Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-[#F2ECE0]">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded bg-[#2C3E2D] flex items-center justify-center">
                <span className="text-xs font-bold text-[#D4A853]">A</span>
              </div>
              <span className="font-serif font-semibold text-[#2C3E2D]">Azul Wells</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Educational retirement planning tools. Not investment advice. Consult a qualified fee-only financial advisor.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
