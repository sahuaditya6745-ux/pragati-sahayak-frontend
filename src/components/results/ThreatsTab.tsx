import { AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, HelpCircle } from "lucide-react";
import type { FullResultsData } from "@/lib/resultsData";

interface ThreatsTabProps {
  data: FullResultsData;
}

export function ThreatsTab({ data }: ThreatsTabProps) {
  const { threatsDetailed, category, breakdown, formData } = data;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Risk Score */}
      <div className="human-card flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-terracotta/10 text-terracotta">
              <ShieldAlert className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Risk Safeguards for {formData.village || "Your Village"}
            </h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Realistic business hurdles for <span className="font-semibold text-foreground">{category.name}</span> and practical ways to safeguard your investment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground hidden sm:inline">Safety Index:</span>
          <span className="human-pill border-sage/30 bg-sage/10 text-sage">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{breakdown.risk} / 100 Safety</span>
          </span>
        </div>
      </div>

      {/* Explanatory Banner */}
      <div className="human-card border-terracotta/20 bg-gradient-to-br from-terracotta/[0.04] via-card to-ochre/[0.03] p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-terracotta/10 text-terracotta">
            <HelpCircle className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-terracotta">
              Why Threat Planning Matters
            </h4>
            <p className="mt-1 text-xs sm:text-sm leading-relaxed text-foreground/90 font-medium">
              Every village business encounters seasonal lulls, power cuts, or credit risks. Knowing these beforehand ensures you build protective buffers and never run short of working capital.
            </p>
          </div>
        </div>
      </div>

      {/* List of 4-6 Identified Threat Cards */}
      <div className="space-y-4">
        {threatsDetailed.map((item, idx) => {
          const isHigh = item.severity === "High";
          const isMedium = item.severity === "Medium";

          return (
            <div
              key={idx}
              className="human-card p-5 transition hover:border-terracotta/30"
            >
              {/* Top Row: Threat Name & Severity Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-3">
                  <div
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                      isHigh
                        ? "bg-rose-500/10 text-rose-600"
                        : isMedium
                          ? "bg-ochre/15 text-ochre"
                          : "bg-sage/15 text-sage"
                    }`}
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground sm:text-lg">
                      {item.name}
                    </h3>
                  </div>
                </div>

                {/* Severity Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                    isHigh
                      ? "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400"
                      : isMedium
                        ? "border-ochre/30 bg-ochre/10 text-ochre"
                        : "border-sage/30 bg-sage/10 text-sage"
                  }`}
                >
                  <span className="text-sm leading-none">
                    {isHigh ? "🔴" : isMedium ? "🟡" : "🟢"}
                  </span>
                  <span>{item.severity} Risk</span>
                </span>
              </div>

              {/* Description */}
              <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>

              {/* Mitigation Box */}
              <div className="mt-4 rounded-2xl border border-sage/30 bg-sage/5 p-3.5 sm:p-4">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold text-foreground">
                      How to handle this:{" "}
                    </span>
                    <span className="text-foreground leading-relaxed">
                      {item.mitigation.startsWith("How to handle this:")
                        ? item.mitigation.replace("How to handle this:", "").trim()
                        : item.mitigation}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Beginner Safety Principles */}
      <div className="human-card p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-terracotta" />
          <h3 className="font-bold text-foreground text-sm sm:text-base">
            Golden Rules for Rural Enterprises
          </h3>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs text-muted-foreground">
          <div className="rounded-2xl border border-border/70 bg-card p-3.5">
            <span className="font-bold text-foreground block mb-1">1. Keep 1 Month Buffer:</span>
            Never exhaust 100% of your savings on equipment. Always keep 20% in reserve for repairs, fuel spikes, or seasonal harvest delays.
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-3.5">
            <span className="font-bold text-foreground block mb-1">2. Strictly Cap Udhaar (Credit):</span>
            Businesses falter from uncollected customer debts, rarely from lack of sales. Offer a 2% discount for instant cash/UPI rather than open-ended ledger credit.
          </div>
        </div>
      </div>
    </div>
  );
}
