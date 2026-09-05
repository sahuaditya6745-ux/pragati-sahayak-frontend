import {
  Sparkles,
  MapPin,
  IndianRupee,
  Layers,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Award,
  Users,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { FullResultsData } from "@/lib/resultsData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ResultsTopSectionProps {
  data: FullResultsData;
}

export function ResultsTopSection({ data }: ResultsTopSectionProps) {
  const { t } = useTranslation();
  const {
    totalScore,
    scoreLabel,
    confidence,
    summary,
    breakdown,
    formData,
    category,
    marketAnalysis,
    competitorCount,
    threatsDetailed,
  } = data;

  // Milestone readiness stages based on score
  const readinessStages = [
    { label: "Concept Validated", done: true, desc: "Local demand aligns with village demographics" },
    { label: "Capital Fit", done: totalScore >= 45, desc: "Margin funds match machine requirements" },
    { label: "Govt Scheme Eligible", done: totalScore >= 60, desc: "Subsidy routes identified (PMEGP / Mudra)" },
    { label: "Execution Ready", done: totalScore >= 75, desc: "Clear launch runway and manageable competition" },
  ];

  const breakdownMetrics = [
    {
      label: "Customer Demand",
      score: breakdown?.demand ?? 70,
      weight: "30%",
      status: (breakdown?.demand ?? 70) >= 70 ? "High Catchment" : "Moderate Demand",
      color: "bg-secondary",
    },
    {
      label: "Market Gap",
      score: breakdown?.competition ?? 70,
      weight: "25%",
      status: (breakdown?.competition ?? 70) >= 70 ? "Low Saturation" : "Active Competitors",
      color: "bg-primary",
    },
    {
      label: "Margin Cushion",
      score: breakdown?.capital ?? 70,
      weight: "20%",
      status: (breakdown?.capital ?? 70) >= 70 ? "Comfortable Margin" : "Requires Debt Support",
      color: "bg-amber-600",
    },
    {
      label: "Connectivity",
      score: breakdown?.infrastructure ?? 70,
      weight: "15%",
      status: (breakdown?.infrastructure ?? 70) >= 70 ? "Smooth Transport" : "Fair Road Access",
      color: "bg-emerald-600",
    },
    {
      label: "Business Stability",
      score: breakdown?.risk ?? 70,
      weight: "10%",
      status: (breakdown?.risk ?? 70) >= 70 ? "Low Perishability" : "Monitor Seasonality",
      color: "bg-stone-600",
    },
  ];

  const topMitigation = threatsDetailed?.[0] || {
    name: "Customer Credit (Udhaar)",
    mitigation: "Limit informal store credit to ₹500 per family and accept QR payments.",
  };

  return (
    <section className="human-card p-6 sm:p-8 space-y-6">
      {/* 1. Context Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-5">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 font-bold text-primary">
            <Layers className="h-3.5 w-3.5" />
            {category?.name || "Business"} {category?.name_hi ? `(${category.name_hi})` : ""}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/80 px-3.5 py-1 font-medium text-foreground">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            {formData?.village || "Village"}, {formData?.block || "Block"}, {formData?.district || "District"}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/80 px-3.5 py-1 font-medium text-foreground">
            <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
            ₹{(Number(formData?.capital) || 0).toLocaleString("en-IN")} Own Margin
          </span>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline underline-offset-4"
        >
          <span>Edit Details</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 2. Executive Advisor Brief: Personalized Narrative */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-md text-xl">
            🧭
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                Executive Advisor Verdict
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-medium text-muted-foreground">
                Prepared for <strong className="text-foreground">{formData.fullName || "Entrepreneur"}</strong>
              </span>
            </div>
            <p className="text-base sm:text-lg font-semibold leading-relaxed text-foreground">
              {summary}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Feasibility Readiness Compass & Multi-Tier Score */}
      <div className="grid gap-6 lg:grid-cols-12 items-stretch">
        {/* Left Column: Humanised Score Card (5 cols) */}
        <div className="human-card p-6 flex flex-col justify-between items-center text-center bg-card lg:col-span-5 border-border/80">
          <div className="w-full flex items-center justify-between pb-3 border-b border-border/60">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("results.viability_score")}
            </span>
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${confidence.colorClass}`}
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>{confidence.level} Confidence</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">{confidence.tooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Visual Score Badge */}
          <div className="my-6 flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              {/* Outer decorative ring */}
              <div className="h-36 w-36 rounded-full border-4 border-dashed border-primary/20 flex items-center justify-center bg-primary/5">
                <div className="h-28 w-28 rounded-full bg-card shadow-sm border border-border flex flex-col items-center justify-center">
                  <span className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
                    {totalScore}
                  </span>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest -mt-1">
                    out of 100
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 text-lg font-black text-primary sm:text-xl">
                <Award className="h-5 w-5" />
                {scoreLabel}
              </span>
              <p className="text-xs text-muted-foreground mt-0.5">
                {totalScore >= 75
                  ? "Strong fundamentals. High probability of commercial success."
                  : totalScore >= 55
                    ? "Feasible with disciplined cost control and subsidy support."
                    : "Caution advised: Strengthen your margin or reconsider location."}
              </p>
            </div>
          </div>

          {/* 4-Step Readiness Journey Milestones */}
          <div className="w-full pt-4 border-t border-border/60 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-left mb-1.5">
              Launch Readiness Pathway
            </div>
            <div className="grid grid-cols-2 gap-2 text-left">
              {readinessStages.map((stage) => (
                <div
                  key={stage.label}
                  className={`rounded-xl p-2 border text-xs flex items-center gap-2 transition ${
                    stage.done
                      ? "border-secondary/30 bg-secondary/8 text-foreground"
                      : "border-border/60 bg-muted/30 text-muted-foreground opacity-60"
                  }`}
                >
                  <CheckCircle2
                    className={`h-4 w-4 shrink-0 ${stage.done ? "text-secondary" : "text-muted-foreground"}`}
                  />
                  <span className="font-semibold truncate">{stage.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Superpowers, Action Item & 5 Metric Dimensions (7 cols) */}
        <div className="space-y-4 lg:col-span-7 flex flex-col justify-between">
          {/* Pair of Highlight Cards: Superpower vs Top Caution */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Superpower Card */}
            <div className="rounded-2xl border border-secondary/25 bg-secondary/8 p-4.5">
              <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider mb-2">
                <TrendingUp className="h-4 w-4" />
                <span>Top Advantage</span>
              </div>
              <h4 className="font-bold text-foreground text-sm leading-snug">
                {(Number(marketAnalysis?.targetCustomers) || 0) > 0
                  ? `~${(Number(marketAnalysis?.targetCustomers) || 0).toLocaleString("en-IN")} Local Consumers in Catchment`
                  : "Favorable Local Market"}
              </h4>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                {(competitorCount ?? 0) <= 1
                  ? `Only ${competitorCount ?? 0} existing direct competitor nearby. You hold a powerful first-mover advantage.`
                  : `Active sector in ${formData?.block || "your area"}. Focus on transparent pricing and digital payments.`}
              </p>
            </div>

            {/* Practical Action Guardrail Card */}
            <div className="rounded-2xl border border-amber-600/25 bg-amber-600/8 p-4.5">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Primary Recommendation</span>
              </div>
              <h4 className="font-bold text-foreground text-sm leading-snug">
                {topMitigation?.name || "Credit Risk Management"}
              </h4>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                {topMitigation?.mitigation || "Limit customer credit to ₹500 and accept UPI soundbox payments."}
              </p>
            </div>
          </div>

          {/* 5 Dimensions Progress Pillars with Human Status Tags */}
          <div className="human-card p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Feasibility Breakdown across 5 Dimensions
              </span>
              <span className="text-[11px] font-semibold text-secondary flex items-center gap-1">
                <Users className="h-3 w-3" />
                Benchmark: 70+
              </span>
            </div>

            <div className="space-y-3">
              {breakdownMetrics.map((metric) => (
                <div key={metric.label}>
                  <div className="mb-1 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{metric.label}</span>
                      <span className="text-[10px] font-medium text-muted-foreground uppercase">
                        ({metric.weight})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline">
                        {metric.status}
                      </span>
                      <span className="font-extrabold text-foreground">{metric.score}/100</span>
                    </div>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted/80">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${metric.color}`}
                      style={{ width: `${Math.min(100, Math.max(8, metric.score))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
