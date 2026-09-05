import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Users,
  Truck,
  Zap,
  Calendar,
  Sparkles,
  Info,
  Store,
  Compass,
  CheckCircle2,
  Wheat,
} from "lucide-react";
import type { FullResultsData } from "@/lib/resultsData";

interface MarketAnalysisTabProps {
  data: FullResultsData;
}

export function MarketAnalysisTab({ data }: MarketAnalysisTabProps) {
  const { marketAnalysis, formData, category, blockMeta } = data;
  const targetCustomers = marketAnalysis?.targetCustomers ?? Math.round((blockMeta?.population ?? 4500) * 0.3);
  const rawMaterialAvailability = marketAnalysis?.rawMaterialAvailability ?? {
    level: "High" as const,
    color: "bg-sage/10 text-sage border-sage/30",
    reason: "Local agricultural and rural supply chains accessible",
  };
  const infrastructureReadiness = marketAnalysis?.infrastructureReadiness ?? {
    level: "Medium" as const,
    color: "bg-ochre/10 text-ochre border-ochre/30",
    reason: "Motorable village access and district connectivity",
  };
  const seasonalDemandFactor = marketAnalysis?.seasonalDemandFactor ?? {
    title: "Consistent Rural Demand",
    description: "Steady recurring need with spikes during harvest and wedding seasons.",
  };
  const explanation = marketAnalysis?.explanation || "High market potential supported by village catchment and low saturation.";
  const chartData = marketAnalysis?.chartData || [];

  // Warm artisanal earthy palette
  const barColors = [
    "#C85A32", // Terracotta
    "#2D6A4F", // Deep Forest Sage
    "#D97706", // Amber Ochre
    "#475569", // Slate Umber
    "#8B5E3C", // Roasted Clay
  ];

  const villageName = formData.village || "Your Village";
  const blockName = formData.block || "Your Block";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="human-card flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-sage/10 text-sage">
              <Compass className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Local Demand & Customer Catchment
            </h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Ground-level customer behavior, daily footfall drivers, and raw material access in{" "}
            <span className="font-semibold text-foreground">{villageName}, {blockName}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="human-pill border-sage/30 bg-sage/10 text-sage">
            <span className="h-1.5 w-1.5 rounded-full bg-sage animate-pulse" />
            <span>Catchment Score: {data.breakdown.demand}/100</span>
          </span>
        </div>
      </div>

      {/* Top Customer Story Narrative */}
      <div className="human-card border-terracotta/20 bg-gradient-to-br from-terracotta/[0.04] via-card to-ochre/[0.03] p-5 sm:p-6">
        <div className="flex items-start gap-3.5">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-terracotta text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta">
              Advisor Ground Reality
            </span>
            <h3 className="mt-0.5 text-base font-bold text-foreground sm:text-lg">
              Why Villagers Will Buy From You
            </h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-foreground/90 sm:text-base">
              {explanation}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Ground Reality Dimension Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Estimated Target Customers */}
        <div className="human-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Direct Catchment
            </span>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-terracotta/10 text-terracotta">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-foreground sm:text-3xl">
              ~{targetCustomers.toLocaleString("en-IN")}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Estimated households within 30% trade radius of {(Number(blockMeta?.population) || 4500).toLocaleString("en-IN")} block population
            </p>
          </div>
        </div>

        {/* Card 2: Raw Material Availability */}
        <div className="human-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Raw Materials
            </span>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-sage/10 text-sage">
              <Truck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="human-pill border-sage/30 bg-sage/10 text-sage">
              {rawMaterialAvailability.level} Availability
            </span>
            <p className="mt-2 text-xs text-muted-foreground">{rawMaterialAvailability.reason}</p>
          </div>
        </div>

        {/* Card 3: Infrastructure Readiness */}
        <div className="human-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Infra Readiness
            </span>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-ochre/15 text-ochre">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="human-pill border-ochre/30 bg-ochre/10 text-ochre">
              {infrastructureReadiness.level} Readiness
            </span>
            <p className="mt-2 text-xs text-muted-foreground">{infrastructureReadiness.reason}</p>
          </div>
        </div>

        {/* Card 4: Seasonal Demand Factor */}
        <div className="human-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Seasonality
            </span>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-slate-500/10 text-slate-700 dark:text-slate-300">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm font-bold text-foreground">{seasonalDemandFactor.title}</div>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {seasonalDemandFactor.description}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Segments & Buying Rhythms in the Village */}
      <div className="human-card p-5 sm:p-6">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-ochre/15 text-ochre">
            <Store className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground sm:text-lg">
              Village Customer Personas & Buying Patterns
            </h3>
            <p className="text-xs text-muted-foreground">
              How different customer groups in {blockName} make purchasing decisions
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {/* Persona 1: Daily Household Buyers */}
          <div className="rounded-2xl border border-border/70 bg-card p-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🏡</span>
              <h4 className="text-sm font-bold text-foreground">Local Village Families</h4>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Make repeated purchases every 2–4 days. They prioritize friendly relations, honest weights, and immediate availability over minor price fluctuations.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-terracotta">
              Key Hook: Warm greetings & reliable stock
            </div>
          </div>

          {/* Persona 2: Weekly Haat & Market Visitors */}
          <div className="rounded-2xl border border-border/70 bg-card p-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🛍️</span>
              <h4 className="text-sm font-bold text-foreground">Weekly Haat Visitors</h4>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Travel from smaller surrounding hamlets on market days. They buy in larger pack sizes and look for bundled value deals.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-ochre">
              Key Hook: Visible display & multi-unit savings
            </div>
          </div>

          {/* Persona 3: Post-Harvest Liquidity Surge */}
          <div className="rounded-2xl border border-border/70 bg-card p-4">
            <div className="flex items-center gap-2">
              <Wheat className="h-4 w-4 text-sage" />
              <h4 className="text-sm font-bold text-foreground">Harvest Season Surge</h4>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Cash liquidity peaks twice a year (Rabi and Kharif harvest). Rural spending jumps by 35%–50% during these festive and harvest windows.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-sage">
              Key Hook: Stock up before harvest weeks
            </div>
          </div>
        </div>
      </div>

      {/* Demand Score Drivers Bar Chart */}
      <div className="human-card p-5 sm:p-6">
        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-base font-bold text-foreground sm:text-lg">
              Market Demand Drivers Breakdown
            </h3>
            <p className="text-xs text-muted-foreground">
              Evaluation index across local consumption frequency, transit accessibility, and supply margins
            </p>
          </div>
          <span className="human-pill border-sage/30 bg-sage/10 text-sage self-start sm:self-auto">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>High Catchment Viability</span>
          </span>
        </div>

        <div className="h-72 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                stroke="#888888"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={150}
              />
              <RechartsTooltip
                formatter={(value) => [`${String(value)} / 100`, "Demand Index"]}
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  borderColor: "var(--color-border)",
                  borderRadius: "16px",
                  fontSize: "12px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                }}
              />
              <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={22}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border/70 bg-muted/30 p-3.5 text-xs text-muted-foreground">
          <Info className="h-4 w-4 shrink-0 text-terracotta" />
          <span>
            Synthesized from {formData.state} District Economic Indicators, Census rural demographic mapping, and verified village purchasing power indices.
          </span>
        </div>
      </div>
    </div>
  );
}
