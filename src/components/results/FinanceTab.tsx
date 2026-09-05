import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Coins,
  PartyPopper,
  PiggyBank,
  SunMedium,
  ShoppingBag,
  Store,
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import type { FullResultsData } from "@/lib/resultsData";

interface FinanceTabProps {
  data: FullResultsData;
}

// Warm, humanised, artisanal palette
const PIE_COLORS = [
  "#C85A32", // Equipment & Machinery (Warm Terracotta)
  "#2D6A4F", // Working Capital (Deep Forest Sage)
  "#D97706", // Licenses & Registration (Warm Amber Ochre)
  "#475569", // Marketing & Setup (Slate Umber)
  "#A8A29E", // Emergency Reserve (Warm Clay Stone)
];

export function FinanceTab({ data }: FinanceTabProps) {
  const { financials, category, formData } = data;
  const {
    avgInvestment,
    marginPercent,
    breakevenMonths,
    estimatedMonthlyRevenue,
    estimatedMonthlyProfit,
  } = financials;

  // Investment Breakdown calculations
  const totalInvestment = Number(avgInvestment) || 100000;
  const availableCapital = Number(formData?.capital) || 0;
  const fundingNeeded = Math.max(0, totalInvestment - availableCapital);
  const isCapitalSufficient = availableCapital >= totalInvestment;

  // Profitability calculations
  const monthlyRevenue = Number(estimatedMonthlyRevenue) || 0;
  const monthlyProfit = Number(estimatedMonthlyProfit) || 0;
  const monthlyExpenses = Math.max(0, monthlyRevenue - monthlyProfit);

  // Daily Business Reality calculations
  const dailySalesTarget = Math.round(monthlyRevenue / 30);
  const dailyOperatingCost = Math.round(monthlyExpenses / 30);
  const dailyNetSavings = Math.max(0, dailySalesTarget - dailyOperatingCost);
  const breakevenDayInMonth =
    monthlyRevenue > 0
      ? Math.min(27, Math.max(1, Math.round((monthlyExpenses / monthlyRevenue) * 30)))
      : 20;

  // 5 Pie Chart Slices with warm palette
  const pieData = [
    {
      name: "Equipment & Machinery",
      percent: 40,
      value: Math.round(totalInvestment * 0.4),
      color: PIE_COLORS[0],
      description: "Core processing machines, durable tools & electrical setup",
    },
    {
      name: "Working Capital",
      percent: 25,
      value: Math.round(totalInvestment * 0.25),
      color: PIE_COLORS[1],
      description: "First 30–45 days raw material inventory & operating buffer",
    },
    {
      name: "Licenses & Registration",
      percent: 5,
      value: Math.round(totalInvestment * 0.05),
      color: PIE_COLORS[2],
      description: "Free Udyam MSME, trade permits, FSSAI & power sanction",
    },
    {
      name: "Marketing & Setup",
      percent: 10,
      value: Math.round(totalInvestment * 0.1),
      color: PIE_COLORS[3],
      description: "Shopfront awning, clean painting, lighting & village launch notices",
    },
    {
      name: "Emergency Reserve",
      percent: 20,
      value: Math.round(totalInvestment * 0.2),
      color: PIE_COLORS[4],
      description: "Safe rainy-day cushion for monsoon lull or sudden machine repair",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="human-card flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-terracotta/10 text-terracotta">
              <Coins className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Financial Blueprint & Real Cashflow
            </h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Realistic startup capital, daily operating targets, and net family profit for{" "}
            <span className="font-semibold text-foreground">{category.name}</span> in{" "}
            <span className="font-medium text-foreground">{formData.village || formData.block || "your village"}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="human-pill border-sage/30 bg-sage/10 text-sage">
            <span className="h-1.5 w-1.5 rounded-full bg-sage animate-pulse" />
            <span>Operating Margin: ~{marginPercent}%</span>
          </span>
        </div>
      </div>

      {/* DAILY BUSINESS REALITY - The Humanized Advisory View */}
      <div className="human-card border-terracotta/20 bg-gradient-to-br from-terracotta/[0.04] via-card to-sage/[0.03] p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-terracotta/10 text-terracotta">
              <SunMedium className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta">
                Day-To-Day Entrepreneur Reality
              </span>
              <h3 className="text-lg font-bold text-foreground sm:text-xl">
                What This Means When Your Shutters Open Every Morning
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-background px-3 py-1 text-xs font-semibold text-muted-foreground border border-border/80 sm:self-auto">
            <Store className="h-3.5 w-3.5 text-terracotta" />
            <span>30-Day Monthly Rhythm</span>
          </span>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          Instead of looking at intimidating monthly lakhs, here is how your business functions on an
          ordinary Tuesday. Hit your daily target to keep your unit healthy and debt-free:
        </p>

        {/* 3 Daily Reality Pillars */}
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {/* Pillar 1: Daily Gross Sales Target */}
          <div className="rounded-2xl border border-border/80 bg-card/80 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Daily Sales Target
              </span>
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-ochre/15 text-ochre">
                <ShoppingBag className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-foreground">
              ₹{dailySalesTarget.toLocaleString("en-IN")}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Counter billing needed per day across local families & visitors.
            </p>
          </div>

          {/* Pillar 2: Daily Cost to Run */}
          <div className="rounded-2xl border border-border/80 bg-card/80 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Daily Operating Cost
              </span>
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-slate-500/15 text-slate-600 dark:text-slate-300">
                <Coins className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-foreground/80">
              ₹{dailyOperatingCost.toLocaleString("en-IN")}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Replenishing raw stock, helper wages, electricity & fuel.
            </p>
          </div>

          {/* Pillar 3: Daily Family Take-Home */}
          <div className="rounded-2xl border border-sage/40 bg-sage/5 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sage font-bold">
                Daily Family Take-Home
              </span>
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-sage/20 text-sage">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-sage">
              ₹{dailyNetSavings.toLocaleString("en-IN")}
            </div>
            <p className="mt-1 text-[11px] text-sage/80 font-medium">
              Pure surplus going directly to your home after all expenses.
            </p>
          </div>
        </div>

        {/* The Monthly Breakeven Calendar Milestone */}
        <div className="mt-5 rounded-2xl border border-border/70 bg-card/90 p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5">
              <CalendarDays className="h-4 w-4 text-terracotta" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground sm:text-sm">
                Monthly Breakeven Day: Day {breakevenDayInMonth} of every month
              </h4>
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {30 - breakevenDayInMonth} days of pure family profit
            </span>
          </div>

          {/* 30-Day Progress Representation */}
          <div className="mt-3">
            <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-muted/60 p-0.5 border border-border/60">
              <div
                className="h-full rounded-l-full bg-slate-400/80 dark:bg-slate-600 transition-all"
                style={{ width: `${(breakevenDayInMonth / 30) * 100}%` }}
                title={`Days 1 to ${breakevenDayInMonth}: Covering Fixed & Variable Business Costs`}
              />
              <div
                className="h-full rounded-r-full bg-sage transition-all"
                style={{ width: `${((30 - breakevenDayInMonth) / 30) * 100}%` }}
                title={`Days ${breakevenDayInMonth + 1} to 30: 100% Pure Surplus for You`}
              />
            </div>

            <div className="mt-2.5 flex flex-col justify-between gap-1 text-[11px] sm:flex-row sm:items-center">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-600" />
                <span>
                  <strong>Days 1 – {breakevenDayInMonth}:</strong> Recovering inventory cost, rent & utilities
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-sage">
                <span className="h-2 w-2 rounded-full bg-sage" />
                <span>
                  <strong>Days {breakevenDayInMonth + 1} – 30:</strong> Every rupee earned is pure family savings!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INVESTMENT BREAKDOWN SECTION */}
      <div className="human-card p-5 sm:p-6">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-terracotta/10 text-terracotta">
            <Coins className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground sm:text-lg">
              Startup Capital Requirements
            </h3>
            <p className="text-xs text-muted-foreground">
              Total capital required vs. your own savings in hand
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {/* Card 1: Total Estimated Investment */}
          <div className="rounded-2xl border border-border/70 bg-card p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Estimated Investment
            </span>
            <div className="mt-2 text-2xl font-black text-foreground">
              ₹{totalInvestment.toLocaleString("en-IN")}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Realistic launch cost for a standard {category.name} unit
            </p>
          </div>

          {/* Card 2: Your Available Capital */}
          <div className="rounded-2xl border border-border/70 bg-card p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Your Available Capital
            </span>
            <div className="mt-2 text-2xl font-black text-terracotta">
              ₹{availableCapital.toLocaleString("en-IN")}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {Math.min(100, Math.round((availableCapital / totalInvestment) * 100))}% of total required capital
            </p>
          </div>

          {/* Card 3: Additional Funding Needed */}
          <div
            className={`rounded-2xl border p-4 ${
              isCapitalSufficient
                ? "border-sage/30 bg-sage/5"
                : "border-ochre/30 bg-ochre/5"
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Additional Funding Needed
            </span>
            <div
              className={`mt-2 text-2xl font-black ${
                isCapitalSufficient ? "text-sage" : "text-ochre"
              }`}
            >
              ₹{fundingNeeded.toLocaleString("en-IN")}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {isCapitalSufficient
                ? "Zero external debt required"
                : "Eligible for PMEGP / Mudra government subsidy"}
            </p>
          </div>
        </div>

        {/* Capital Sufficiency Banner */}
        {isCapitalSufficient ? (
          <div className="mt-5 flex items-center gap-3.5 rounded-2xl border border-sage/40 bg-sage/10 p-4 text-foreground">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sage/20 text-sage">
              <PartyPopper className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground sm:text-base">
                You have sufficient capital to start debt-free! 🎉
              </h4>
              <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Your available funds of ₹{availableCapital.toLocaleString("en-IN")} comfortably cover the estimated setup cost of ₹{totalInvestment.toLocaleString("en-IN")}. You can launch without bank interest pressure and retain 100% of your earnings.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-5 flex items-center gap-3.5 rounded-2xl border border-ochre/30 bg-ochre/5 p-4 text-foreground">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ochre/20 text-ochre">
              <PiggyBank className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">
                Government Subsidies Can Cover ₹{fundingNeeded.toLocaleString("en-IN")}
              </h4>
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                Under central schemes like PMEGP and PMFME, rural enterprises can unlock up to 25%–35% direct government grant support on project costs, substantially cutting down your bank loan liability.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* INVESTMENT BREAKDOWN PIE CHART */}
      <div className="human-card p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-base font-bold text-foreground sm:text-lg">
              Capital Expenditure Allocation (₹{totalInvestment.toLocaleString("en-IN")})
            </h3>
            <p className="text-xs text-muted-foreground">
              Balanced allocation to ensure you do not run out of working capital after setting up
            </p>
          </div>
        </div>

        <div className="mt-6 grid items-center gap-6 lg:grid-cols-12">
          {/* Recharts PieChart (5 cols on lg) */}
          <div className="h-64 sm:h-72 w-full lg:col-span-5 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length && payload[0]?.payload) {
                      const item = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-border bg-card p-3 shadow-lg text-xs">
                          <p className="font-bold text-foreground">{item.name}</p>
                          <p className="mt-1 font-extrabold text-terracotta">
                            ₹{item.value.toLocaleString("en-IN")} ({item.percent}%)
                          </p>
                          <p className="mt-0.5 text-muted-foreground">{item.description}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown Slices List (7 cols on lg) */}
          <div className="space-y-3 lg:col-span-7">
            {pieData.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-card p-3 text-xs transition hover:border-terracotta/40 hover:bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3.5 w-3.5 shrink-0 rounded-md shadow-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <span className="font-bold text-foreground text-xs sm:text-sm">
                      {item.name}
                    </span>
                    <p className="text-[11px] text-muted-foreground hidden sm:block">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-foreground text-xs sm:text-sm">
                    ₹{item.value.toLocaleString("en-IN")}
                  </span>
                  <span className="block text-[11px] font-bold text-muted-foreground">
                    {item.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROFITABILITY ESTIMATE SECTION */}
      <div className="human-card p-5 sm:p-6">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-sage/10 text-sage">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground sm:text-lg">
              Profitability & Unit Economics
            </h3>
            <p className="text-xs text-muted-foreground">
              Expected monthly operating cash flows and breakeven horizon
            </p>
          </div>
        </div>

        {/* 5 Key Profitability Metric Cards */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* 1. Expected Monthly Revenue */}
          <div className="rounded-2xl border border-border/70 bg-card p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Expected Revenue
            </span>
            <div className="mt-2 text-xl font-black text-foreground sm:text-2xl">
              ₹{monthlyRevenue.toLocaleString("en-IN")}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              At steady 65% capacity
            </p>
          </div>

          {/* 2. Expected Monthly Expenses */}
          <div className="rounded-2xl border border-border/70 bg-card p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Monthly Expenses
            </span>
            <div className="mt-2 text-xl font-black text-rose-600 dark:text-rose-400 sm:text-2xl">
              ₹{monthlyExpenses.toLocaleString("en-IN")}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Stock, electricity & labor
            </p>
          </div>

          {/* 3. Expected Monthly Profit */}
          <div className="rounded-2xl border border-sage/30 bg-sage/5 p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-sage">
              Net Monthly Profit
            </span>
            <div className="mt-2 text-xl font-black text-sage sm:text-2xl">
              ₹{monthlyProfit.toLocaleString("en-IN")}
            </div>
            <p className="mt-1 text-[11px] text-sage font-medium">
              Net take-home cash flow
            </p>
          </div>

          {/* 4. Breakeven Timeline */}
          <div className="rounded-2xl border border-border/70 bg-card p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Full Breakeven
            </span>
            <div className="mt-2 text-xl font-black text-foreground sm:text-2xl">
              {breakevenMonths} Months
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              To recover 100% startup cost
            </p>
          </div>

          {/* 5. Typical Profit Margin */}
          <div className="rounded-2xl border border-border/70 bg-card p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Profit Margin
            </span>
            <div className="mt-2 text-xl font-black text-sage sm:text-2xl">
              {marginPercent}%
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Operating EBITDA margin
            </p>
          </div>
        </div>

        {/* Visual Monthly Flow Bar */}
        <div className="mt-6 rounded-2xl border border-border/60 bg-muted/20 p-4">
          <div className="flex justify-between text-xs font-semibold text-foreground">
            <span>Monthly Revenue Breakdown</span>
            <span>Total: ₹{monthlyRevenue.toLocaleString("en-IN")}</span>
          </div>
          <div className="mt-2 flex h-3.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="bg-rose-500/80 transition-all"
              style={{
                width: `${monthlyRevenue > 0 ? (monthlyExpenses / monthlyRevenue) * 100 : 75}%`,
              }}
              title={`Expenses: ₹${monthlyExpenses.toLocaleString("en-IN")}`}
            />
            <div
              className="bg-sage transition-all"
              style={{
                width: `${monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 25}%`,
              }}
              title={`Net Profit: ₹${monthlyProfit.toLocaleString("en-IN")}`}
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              Operating Expenses ({monthlyRevenue > 0 ? Math.round((monthlyExpenses / monthlyRevenue) * 100) : 75}%)
            </span>
            <span className="flex items-center gap-1.5 font-bold text-sage">
              <span className="h-2.5 w-2.5 rounded-full bg-sage" />
              Net Monthly Profit ({monthlyRevenue > 0 ? Math.round((monthlyProfit / monthlyRevenue) * 100) : 25}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
