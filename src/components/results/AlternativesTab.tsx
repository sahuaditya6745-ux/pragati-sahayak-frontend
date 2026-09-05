import {
  ArrowRight,
  TrendingUp,
  Sparkles,
  HelpCircle,
  Wheat,
  Milk,
  Egg,
  Smartphone,
  Store,
  Scissors,
  Droplets,
  Boxes,
  Cookie,
  Factory,
} from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import type { FullResultsData } from "@/lib/resultsData";
import { getScoreColor } from "@/lib/resultsData";
import { useAppContext } from "@/context/AppContext";

interface AlternativesTabProps {
  data: FullResultsData;
}

function getCategoryIcon(categoryId: string) {
  switch (categoryId) {
    case "flour_mill":
      return Wheat;
    case "dairy_farm":
      return Milk;
    case "poultry_farm":
      return Egg;
    case "mobile_repair":
      return Smartphone;
    case "grocery_store":
      return Store;
    case "tailoring_unit":
      return Scissors;
    case "oil_mill":
      return Droplets;
    case "agarbatti_making":
      return Sparkles;
    case "papad_making":
      return Cookie;
    case "brick_kiln":
      return Boxes;
    default:
      return Factory;
  }
}

/**
 * Mini Circular Viability Gauge (0-100)
 */
function MiniViabilityGauge({ score }: { score: number }) {
  const scoreColor = getScoreColor(score);
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 54 54">
        {/* Track circle */}
        <circle
          cx="27"
          cy="27"
          r={radius}
          className="stroke-muted"
          strokeWidth="4"
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx="27"
          cy="27"
          r={radius}
          stroke={scoreColor.stroke}
          strokeWidth="4.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xs font-black tracking-tight text-foreground">{score}</span>
        <span className="text-[8px] font-bold text-muted-foreground uppercase leading-none">pts</span>
      </div>
    </div>
  );
}

export function AlternativesTab({ data }: AlternativesTabProps) {
  const { alternatives, formData, category, totalScore } = data;
  const { setFormData } = useAppContext();
  const navigate = useNavigate();

  const villageName = formData.village || "your village";

  const handleSelectAlternative = (categoryName: string) => {
    setFormData({
      ...formData,
      category: categoryName,
    });
    navigate({
      to: "/analyze",
      search: { category: categoryName },
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="human-card flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Other Business Opportunities in {villageName}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Top 3 alternative ventures evaluated for your budget of ₹
            {(Number(formData?.capital) || 0).toLocaleString("en-IN")} and local demographic strengths.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">Current Selection:</span>
          <span className="human-pill border-terracotta/30 bg-terracotta/10 text-terracotta">
            <span>{category.name}</span>
            <span className="text-muted-foreground font-normal">({totalScore} pts)</span>
          </span>
        </div>
      </div>

      {/* Explanatory Banner */}
      <div className="human-card border-terracotta/20 bg-gradient-to-br from-terracotta/[0.04] via-card to-ochre/[0.03] p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-terracotta/10 text-terracotta">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-terracotta">
              Comparing Viability & Returns
            </h4>
            <p className="mt-1 text-xs sm:text-sm leading-relaxed text-foreground/90 font-medium">
              These recommendations are ranked by feasibility in {formData.block}. We highlight ideas matching your capital with high local demand and low market competition.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Alternative Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        {(alternatives || []).map((alt) => {
          const Icon = getCategoryIcon(alt.category.id);
          const scoreColor = getScoreColor(alt.viabilityScore);
          const isHigherThanCurrent = alt.viabilityScore > totalScore;

          return (
            <div
              key={alt.category.id}
              className={`human-card relative flex flex-col justify-between p-5 transition hover:shadow-md ${
                isHigherThanCurrent
                  ? "border-sage/50 hover:border-sage"
                  : "border-border/80 hover:border-terracotta/40"
              }`}
            >
              {/* Higher Viability Callout Tag */}
              {isHigherThanCurrent && (
                <div className="absolute -top-2.5 right-4 rounded-full bg-sage px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-white shadow-sm">
                  ⭐ Higher Score
                </div>
              )}

              <div>
                {/* Header: Icon + Name + Gauge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-terracotta/10 text-terracotta">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base">
                        {alt.category.name}
                      </h3>
                      <p className="text-xs font-semibold text-terracotta">
                        {alt.category.name_hi}
                      </p>
                    </div>
                  </div>

                  {/* Viability Gauge */}
                  <MiniViabilityGauge score={alt.viabilityScore} />
                </div>

                {/* Score Status Badge */}
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${scoreColor.bgLight} ${scoreColor.borderLight} ${scoreColor.text}`}
                  >
                    <span>Viability:</span>
                    <span className="font-extrabold">{alt.viabilityScore}/100</span>
                    <span className="font-medium">({alt.scoreLabel})</span>
                  </span>
                </div>

                {/* Investment Range & Economics Box */}
                <div className="mt-4 rounded-2xl border border-border/60 bg-muted/40 p-3 text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Estimated Investment:</span>
                    <span className="font-bold text-foreground">{alt.investmentRange}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Profit Margin:</span>
                    <span className="font-bold text-sage">~{alt.category.avg_margin_percent}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Breakeven Time:</span>
                    <span className="font-semibold text-foreground">~{alt.category.breakeven_months} months</span>
                  </div>
                </div>

                {/* Why it's a good fit: BECAUSE reason */}
                <div className="mt-4 rounded-2xl bg-muted/20 p-3 text-xs">
                  <p className="font-medium leading-relaxed text-foreground">
                    <span className="font-extrabold text-terracotta uppercase tracking-wider">
                      Why it's a good fit:{" "}
                    </span>
                    {alt.whyConsider}
                  </p>
                </div>
              </div>

              {/* Action Button: Analyze This Instead */}
              <div className="mt-5 border-t border-border/60 pt-4">
                <button
                  type="button"
                  onClick={() => handleSelectAlternative(alt.category.name)}
                  className="inline-flex w-full min-h-[42px] items-center justify-center gap-2 rounded-full bg-terracotta px-4 text-xs font-bold text-white shadow-sm transition hover:opacity-90 active:scale-[0.98]"
                >
                  <span>Analyze This Instead</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Beginner Guide Note */}
      <div className="human-card p-5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <HelpCircle className="h-4 w-4 text-sage" />
          <span>Tip for Choosing Your First Venture</span>
        </div>
        <p className="mt-1.5 leading-relaxed">
          If your available capital is under ₹50,000, consider starting with low-capital service models like Mobile Repair or Papad Making. You can always expand into heavier manufacturing (like Flour Mill or Oil Mill) once you establish steady daily revenue and save additional reserves.
        </p>
      </div>
    </div>
  );
}
