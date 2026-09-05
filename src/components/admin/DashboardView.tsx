import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FileText,
  Landmark,
  Briefcase,
  MapPin,
  Plus,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  TrendingUp,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AdminScheme,
  AdminCategory,
  LocationTree,
  AdminCompetitor,
} from "@/services/adminStore";

interface DashboardViewProps {
  reportsCount: number;
  schemes: AdminScheme[];
  categories: AdminCategory[];
  locations: LocationTree;
  competitors: AdminCompetitor[];
  onOpenAddScheme: () => void;
  onOpenAddCategory: () => void;
  onOpenAddLocation: () => void;
  onOpenAddCompetitor: () => void;
  onNavigateTab: (tab: "schemes" | "categories" | "locations" | "competitors") => void;
}

export function DashboardView({
  reportsCount,
  schemes,
  categories,
  locations,
  competitors,
  onOpenAddScheme,
  onOpenAddCategory,
  onOpenAddLocation,
  onOpenAddCompetitor,
  onNavigateTab,
}: DashboardViewProps) {
  const { t } = useTranslation();
  // Count stats
  const activeSchemesCount = schemes.filter((s) => s.is_active).length;
  const totalSchemes = schemes.length;
  const totalCategories = categories.length;

  // Calculate total blocks & states
  const totalStates = Object.keys(locations).length;
  let totalDistricts = 0;
  let totalBlocks = 0;
  Object.values(locations).forEach((districts) => {
    totalDistricts += Object.keys(districts).length;
    Object.values(districts).forEach((blocks) => {
      totalBlocks += Object.keys(blocks).length;
    });
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-saffron/10 via-background to-green/10 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-saffron/10 px-3 py-1 text-xs font-bold text-saffron mb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Platform Operations & Database Controls</span>
            </div>
            <h2 className="text-xl font-black text-foreground sm:text-2xl">
              {t("admin.welcome")}
            </h2>
            <p className="mt-1 max-w-xl text-xs text-muted-foreground sm:text-sm">
              {t("admin.welcome_sub")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={onOpenAddScheme}
              className="bg-saffron text-saffron-foreground hover:bg-saffron/90 cursor-pointer shadow-sm text-xs sm:text-sm font-semibold"
            >
              <Plus className="mr-1.5 h-4 w-4" /> {t("admin.add_scheme")}
            </Button>
            <Button
              onClick={onOpenAddCategory}
              variant="outline"
              className="border-border hover:bg-accent cursor-pointer text-xs sm:text-sm font-semibold"
            >
              <Plus className="mr-1.5 h-4 w-4" /> {t("admin.add_category")}
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Reports Generated */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("admin.total_reports")}
            </span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-500">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black tracking-tight text-foreground">
              {reportsCount}
            </div>
            <p className="mt-1 flex items-center text-xs font-medium text-green">
              <TrendingUp className="mr-1 h-3.5 w-3.5" />
              Live generated from /analyze
            </p>
          </div>
        </div>

        {/* Card 2: Active Schemes */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("admin.active_schemes")}
            </span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-saffron/10 text-saffron">
              <Landmark className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black tracking-tight text-foreground">
              {activeSchemesCount}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Out of <strong className="text-foreground">{totalSchemes}</strong> registered schemes
            </p>
          </div>
        </div>

        {/* Card 3: Business Categories */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("admin.business_categories")}
            </span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black tracking-tight text-foreground">
              {totalCategories}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Manufacturing, Retail, Service, Agro
            </p>
          </div>
        </div>

        {/* Card 4: Locations in Database */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("admin.locations_db")}
            </span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 text-purple-500">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black tracking-tight text-foreground">
              {totalBlocks}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Blocks across {totalDistricts} districts & {totalStates} states
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-base font-extrabold text-foreground">{t("admin.quick_actions")}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Perform frequent catalog and data management tasks with one click.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            onClick={onOpenAddScheme}
            className="flex items-center gap-3 rounded-xl border border-border/80 bg-background p-4 text-left transition-all hover:border-saffron hover:bg-saffron/5 cursor-pointer group"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-saffron/10 text-saffron group-hover:bg-saffron group-hover:text-saffron-foreground transition-colors">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{t("admin.add_scheme")}</p>
              <p className="text-xs text-muted-foreground">Subsidies, loans, policy rules</p>
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenAddCategory}
            className="flex items-center gap-3 rounded-xl border border-border/80 bg-background p-4 text-left transition-all hover:border-emerald-500 hover:bg-emerald-500/5 cursor-pointer group"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{t("admin.add_category")}</p>
              <p className="text-xs text-muted-foreground">Capital range, margins, risks</p>
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenAddLocation}
            className="flex items-center gap-3 rounded-xl border border-border/80 bg-background p-4 text-left transition-all hover:border-purple-500 hover:bg-purple-500/5 cursor-pointer group"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{t("admin.add_location")}</p>
              <p className="text-xs text-muted-foreground">State, district, block tree</p>
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenAddCompetitor}
            className="flex items-center gap-3 rounded-xl border border-border/80 bg-background p-4 text-left transition-all hover:border-blue-500 hover:bg-blue-500/5 cursor-pointer group"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{t("admin.add_competitor")}</p>
              <p className="text-xs text-muted-foreground">Local market benchmark unit</p>
            </div>
          </button>
        </div>
      </div>

      {/* Database Highlights & Quick Jump Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Schemes Summary */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Schemes Portfolio</h3>
              <p className="text-xs text-muted-foreground">Top active policy programs</p>
            </div>
            <button
              onClick={() => onNavigateTab("schemes")}
              className="inline-flex items-center text-xs font-semibold text-saffron hover:underline cursor-pointer"
            >
              View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {schemes.slice(0, 4).map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3"
              >
                <div className="min-w-0 pr-3">
                  <p className="truncate text-xs font-bold text-foreground sm:text-sm">
                    {s.name}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {s.ministry} • Max: ₹{(s.max_loan / 100000).toFixed(0)}L • Subsidy: {s.subsidy_percent}%
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                    s.is_active
                      ? "bg-green/10 text-green"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Overview */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Business Categories</h3>
              <p className="text-xs text-muted-foreground">Sector profiles & margins</p>
            </div>
            <button
              onClick={() => onNavigateTab("categories")}
              className="inline-flex items-center text-xs font-semibold text-saffron hover:underline cursor-pointer"
            >
              View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {categories.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3"
              >
                <div>
                  <p className="text-xs font-bold text-foreground sm:text-sm">
                    {c.name} {c.name_hi && <span className="font-normal text-muted-foreground">({c.name_hi})</span>}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Sector: {c.sector} • ₹{(c.min_investment / 1000).toFixed(0)}k - ₹{(c.max_investment / 1000).toFixed(0)}k
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-green">{c.avg_margin_percent}% margin</span>
                  <p className="text-[10px] text-muted-foreground">{c.risk_level} Risk</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
