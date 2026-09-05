import { ShieldCheck, AlertTriangle, Sparkles, AlertOctagon, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { FullResultsData } from "@/lib/resultsData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SwotAnalysisTabProps {
  data: FullResultsData;
}

export function SwotAnalysisTab({ data }: SwotAnalysisTabProps) {
  const { t } = useTranslation();
  const { swot, category, formData } = data;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="human-card flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{t("swot.title")}</h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Ecosystem advantages, operational bottlenecks, growth pathways, and external risks for{" "}
            <span className="font-semibold text-foreground">{category.name}</span> in{" "}
            <span className="font-medium text-foreground">{formData.village || "your village"}, {formData.block || "your block"}</span>.
          </p>
        </div>
        <span className="human-pill border-ochre/30 bg-ochre/10 text-ochre self-start sm:self-auto">
          <HelpCircle className="h-3.5 w-3.5 text-ochre" />
          <span>Tap "Why?" for Data Rationale</span>
        </span>
      </div>

      <TooltipProvider delayDuration={150}>
        {/* 2x2 Grid Layout */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* Top-Left: STRENGTHS (Deep Forest Sage) */}
          <div className="human-card relative overflow-hidden border-sage/30 bg-sage/[0.04] p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-sage text-white shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sage">
                  {t("swot.strengths")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Local ecosystem advantages & unit economics
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-3.5">
              {(swot?.strengths || []).map((item, i) => (
                <li
                  key={i}
                  className="flex items-start justify-between gap-3 rounded-2xl bg-card p-3.5 text-sm font-medium text-foreground shadow-2xs border border-sage/20"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-sage" />
                    <span className="leading-snug">{item.point}</span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sage/10 px-2.5 py-0.5 text-[11px] font-bold text-sage hover:bg-sage/20"
                      >
                        <HelpCircle className="h-3 w-3" />
                        <span>Why?</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs font-normal">
                      <p className="font-semibold text-sage mb-0.5">Data Rationale:</p>
                      {item.why}
                    </TooltipContent>
                  </Tooltip>
                </li>
              ))}
            </ul>
          </div>

          {/* Top-Right: WEAKNESSES (Warm Terracotta) */}
          <div className="human-card relative overflow-hidden border-terracotta/30 bg-terracotta/[0.04] p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-terracotta text-white shadow-sm">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-terracotta">
                  {t("swot.weaknesses")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Resource constraints & initial bottlenecks
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-3.5">
              {(swot?.weaknesses || []).map((item, i) => (
                <li
                  key={i}
                  className="flex items-start justify-between gap-3 rounded-2xl bg-card p-3.5 text-sm font-medium text-foreground shadow-2xs border border-terracotta/20"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-terracotta" />
                    <span className="leading-snug">{item.point}</span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-terracotta/10 px-2.5 py-0.5 text-[11px] font-bold text-terracotta hover:bg-terracotta/20"
                      >
                        <HelpCircle className="h-3 w-3" />
                        <span>Why?</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs font-normal">
                      <p className="font-semibold text-terracotta mb-0.5">Data Rationale:</p>
                      {item.why}
                    </TooltipContent>
                  </Tooltip>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom-Left: OPPORTUNITIES (Warm Amber Ochre) */}
          <div className="human-card relative overflow-hidden border-ochre/30 bg-ochre/[0.04] p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-ochre text-white shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-ochre">
                  {t("swot.opportunities")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Government schemes, scaling & value addition
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-3.5">
              {(swot?.opportunities || []).map((item, i) => (
                <li
                  key={i}
                  className="flex items-start justify-between gap-3 rounded-2xl bg-card p-3.5 text-sm font-medium text-foreground shadow-2xs border border-ochre/20"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ochre" />
                    <span className="leading-snug">{item.point}</span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ochre/10 px-2.5 py-0.5 text-[11px] font-bold text-ochre hover:bg-ochre/20"
                      >
                        <HelpCircle className="h-3 w-3" />
                        <span>Why?</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs font-normal">
                      <p className="font-semibold text-ochre mb-0.5">Data Rationale:</p>
                      {item.why}
                    </TooltipContent>
                  </Tooltip>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom-Right: THREATS (Deep Rose) */}
          <div className="human-card relative overflow-hidden border-rose-500/30 bg-rose-500/[0.04] p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-600 text-white shadow-sm">
                <AlertOctagon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-rose-700 dark:text-rose-400">
                  {t("swot.threats")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Seasonal shocks, power stability & credit risks
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-3.5">
              {(swot?.threats || []).map((item, i) => (
                <li
                  key={i}
                  className="flex items-start justify-between gap-3 rounded-2xl bg-card p-3.5 text-sm font-medium text-foreground shadow-2xs border border-rose-500/20"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-rose-500" />
                    <span className="leading-snug">{item.point}</span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 dark:text-rose-400 hover:bg-rose-500/20"
                      >
                        <HelpCircle className="h-3 w-3" />
                        <span>Why?</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs font-normal">
                      <p className="font-semibold text-rose-500 mb-0.5">Data Rationale:</p>
                      {item.why}
                    </TooltipContent>
                  </Tooltip>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
