import {
  Store,
  Star,
  MapPin,
  Calendar,
  CheckCircle2,
  IndianRupee,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  HeartHandshake,
  Scale,
  Smartphone,
} from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import type { FullResultsData } from "@/lib/resultsData";
import type { Competitor } from "@/types/business";

const CompetitorGeoMap = lazy(() =>
  import("./CompetitorGeoMap").then((m) => ({ default: m.CompetitorGeoMap }))
);

interface CompetitorsTabProps {
  data: FullResultsData;
}

export function CompetitorsTab({ data }: CompetitorsTabProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const competitors = data?.competitors ?? [];
  const competitorDensity = data?.competitorDensity ?? {
    label: "Low (0 nearby)",
    level: "Low" as const,
    badgeClass: "bg-sage/10 text-sage border-sage/30",
  };
  const competitorSummary = data?.competitorSummary ?? "Market saturation analysis not available.";
  const formData = data?.formData ?? ({} as FullResultsData["formData"]);
  const category = data?.category ?? ({} as FullResultsData["category"]);

  const villageName = formData.village || "your village";
  const blockName = formData.block || "your block";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Density Badge */}
      <div className="human-card flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-terracotta/10 text-terracotta">
              <Store className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Local Landscape around {villageName}
            </h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Nearby operators and saturation check for{" "}
            <span className="font-semibold text-foreground">{category?.name || "Business"}</span> ({category?.name_hi || ""}) in {blockName}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground hidden sm:inline">Density:</span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold shadow-sm ${competitorDensity.badgeClass}`}
          >
            {competitorDensity.level === "Low" && <span className="h-2 w-2 rounded-full bg-sage animate-pulse" />}
            {competitorDensity.level === "Medium" && <span className="h-2 w-2 rounded-full bg-ochre" />}
            {competitorDensity.level === "High" && <span className="h-2 w-2 rounded-full bg-rose-500" />}
            <span>{competitorDensity.label}</span>
          </span>
        </div>
      </div>

      {/* Saturation Summary Box */}
      <div className="human-card border-terracotta/20 bg-gradient-to-br from-terracotta/[0.04] via-card to-background p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-terracotta/10 text-terracotta">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-terracotta">
              Market Saturation Verdict
            </h4>
            <p className="mt-1 text-xs sm:text-sm leading-relaxed text-foreground/90 font-medium">
              {competitorSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Geo Heatmap (Leaflet + OpenStreetMap) */}
      <div className="overflow-hidden rounded-3xl border border-border/80 shadow-sm">
        <ErrorBoundary
          fallback={
            <div className="h-[280px] w-full bg-card p-6 flex flex-col items-center justify-center text-center space-y-2">
              <Store className="h-8 w-8 text-terracotta mx-auto opacity-70" />
              <h4 className="font-bold text-foreground text-sm">Geo Heatmap Available Offline</h4>
              <p className="text-xs text-muted-foreground max-w-sm">
                Showing {competitors.length} recorded nearby operators in the verified list below.
              </p>
            </div>
          }
        >
          {isClient ? (
            <Suspense
              fallback={
                <div className="h-[300px] w-full bg-card p-6 flex items-center justify-center animate-pulse text-xs text-muted-foreground font-medium">
                  Loading Interactive Geo Heatmap...
                </div>
              }
            >
              <CompetitorGeoMap data={data} />
            </Suspense>
          ) : (
            <div className="h-[300px] w-full bg-card p-6 flex items-center justify-center animate-pulse text-xs text-muted-foreground font-medium">
              Loading Interactive Geo Heatmap...
            </div>
          )}
        </ErrorBoundary>
      </div>

      {/* Competitors List / Table */}
      {competitors.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Nearby Operators in Your Trade Area ({competitors.length})
            </h3>
            <span className="text-xs text-muted-foreground">
              Verified operating units in {formData.district} district
            </span>
          </div>

          {/* Desktop & Tablet Table (md+) */}
          <div className="hidden md:block overflow-hidden human-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border/70 bg-muted/40 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-5 py-4">Business Name</th>
                    <th scope="col" className="px-5 py-4">Type</th>
                    <th scope="col" className="px-5 py-4">Distance</th>
                    <th scope="col" className="px-5 py-4">Est. Monthly Revenue</th>
                    <th scope="col" className="px-5 py-4">Years Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {competitors.map((comp: Competitor) => (
                    <tr
                      key={comp.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-5 py-4 font-semibold text-foreground">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-terracotta/10 text-terracotta">
                            <Store className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="font-bold text-foreground">{comp.name}</span>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                              <span>{comp.block}, {comp.district}</span>
                              <span className="inline-flex items-center gap-0.5 rounded bg-amber-500/10 px-1.5 py-0.2 text-[10px] font-bold text-amber-600">
                                <Star className="h-2.5 w-2.5 fill-amber-500" />
                                {comp.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs font-medium text-foreground">
                        <span className="inline-flex rounded-lg bg-muted px-2.5 py-1 text-xs text-foreground font-medium">
                          {comp.type || category.name}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-terracotta" />
                          <span className="font-semibold text-foreground">~{comp.distance_km} km</span> away
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs font-bold text-sage whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <IndianRupee className="h-3.5 w-3.5" />
                          <span>
                            {(comp.est_monthly_revenue || (comp.years_active * 4000 + 35000)).toLocaleString("en-IN")} / month
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-medium text-foreground">{comp.years_active} years active</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards Layout (< md) */}
          <div className="grid gap-3.5 md:hidden">
            {competitors.map((comp: Competitor) => (
              <div
                key={comp.id}
                className="human-card p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-terracotta/10 text-terracotta">
                      <Store className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">{comp.name}</h4>
                      <p className="text-xs text-muted-foreground">{comp.block}, {comp.district}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-600">
                    <Star className="h-3 w-3 fill-amber-500" />
                    <span>{comp.rating}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-muted/40 p-2.5 text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium text-foreground">{comp.type || category.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Distance:</span>
                    <span className="font-semibold text-terracotta">~{comp.distance_km} km away</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Est. Monthly Revenue:</span>
                    <span className="font-bold text-sage">
                      ₹{(comp.est_monthly_revenue || (comp.years_active * 4000 + 35000)).toLocaleString("en-IN")} / mo
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Years Active:</span>
                    <span className="text-foreground">{comp.years_active} years</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Zero Competitors Greenfield Banner */
        <div className="human-card border-sage/40 bg-sage/10 p-6 sm:p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-sage/20 text-sage">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-foreground sm:text-xl">
            No direct competitors recorded in {blockName}! 🎉
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-muted-foreground sm:text-sm">
            There are currently no recorded direct competitors for <span className="font-semibold text-foreground">{category.name}</span> in your immediate trade catchment. Launching here gives you 100% first-mover advantage to capture the village loyalty before anyone else.
          </p>
        </div>
      )}

      {/* Strategic Advantage: How to Win Loyal Village Families */}
      <div className="human-card p-5 sm:p-6">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-sage/10 text-sage">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-sm sm:text-base">
              The Mentor's Playbook: How to Win Loyal Village Families
            </h3>
            <p className="text-xs text-muted-foreground">
              Simple, time-tested rural relationship rules that beat any competitor without price wars
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3.5 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-card p-4">
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-4 w-4 text-terracotta" />
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
                1. Dependable Shutters
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Open fixed hours daily (e.g. 7 AM to 8 PM). In villages, dependability is everything—people will walk past an irregular shop to buy from someone whose shutters are always reliably open.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-4">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-sage" />
              <span className="text-xs font-bold uppercase tracking-wider text-sage">
                2. 100% Honest Weight
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Use a government-stamped digital scale placed right in front of the customer. Complete honesty in grammage creates permanent word-of-mouth trust across women and elders.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-4">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-ochre" />
              <span className="text-xs font-bold uppercase tracking-wider text-ochre">
                3. Instant UPI Soundbox
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Install a voice-prompt UPI soundbox and offer doorstep drops for senior citizens or bulk orders. Removing small payment frictions wins high-spending customers easily.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
