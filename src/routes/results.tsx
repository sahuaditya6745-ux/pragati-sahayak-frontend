import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  TrendingUp,
  ShieldAlert,
  Store,
  IndianRupee,
  Landmark,
  Calculator,
  Compass,
  Lightbulb,
  ArrowRight,
  Printer,
  Sparkles,
  FileDown,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/context/AppContext";
import { computeFullResults, DEFAULT_FALLBACK_FORM_DATA } from "@/lib/resultsData";
import { generateReportPDF } from "@/services/pdfGenerator";
import { api } from "@/services/api";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ResultsTopSection } from "@/components/results/ResultsTopSection";
import { ResultsSkeleton } from "@/components/results/ResultsSkeleton";
import { MarketAnalysisTab } from "@/components/results/MarketAnalysisTab";
import { SwotAnalysisTab } from "@/components/results/SwotAnalysisTab";
import { CompetitorsTab } from "@/components/results/CompetitorsTab";
import { ThreatsTab } from "@/components/results/ThreatsTab";
import { FinanceTab } from "@/components/results/FinanceTab";
import { SchemesTab } from "@/components/results/SchemesTab";
import { LoanTab } from "@/components/results/LoanTab";
import { RoadmapTab } from "@/components/results/RoadmapTab";
import { AlternativesTab } from "@/components/results/AlternativesTab";
import { AiChatTab } from "@/components/results/AiChatTab";

export const Route = createFileRoute("/results")({
  validateSearch: (search: Record<string, unknown>): { tab?: TabKey } => {
    const tab = search["tab"];
    return typeof tab === "string" ? { tab: tab as TabKey } : {};
  },
  head: () => ({
    meta: [
      { title: "Business Feasibility Report & Dashboard — PragatiSahayak" },
      {
        name: "description",
        content:
          "Comprehensive rural business viability report with viability score gauge, market demand drivers, SWOT analysis, local competitors, government subsidies, and loan calculator.",
      },
      { property: "og:title", content: "Business Feasibility Report & Dashboard — PragatiSahayak" },
      {
        property: "og:description",
        content:
          "Personalised rural business feasibility report with market, scheme and loan insights.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResultsPage,
});

type TabKey =
  | "market"
  | "swot"
  | "competitors"
  | "threats"
  | "finance"
  | "schemes"
  | "loan"
  | "roadmap"
  | "alternatives"
  | "aiChat";

interface TabItem {
  key: TabKey;
  label: string;
  icon?: React.ElementType;
  badge?: string;
}

const TABS: TabItem[] = [
  { key: "market", label: "Market", icon: TrendingUp },
  { key: "swot", label: "SWOT", icon: Sparkles },
  { key: "competitors", label: "Competitors", icon: Store },
  { key: "threats", label: "Threats", icon: ShieldAlert },
  { key: "finance", label: "Finance", icon: IndianRupee },
  { key: "schemes", label: "Schemes", icon: Landmark, badge: "Subsidy" },
  { key: "loan", label: "Loan", icon: Calculator },
  { key: "roadmap", label: "Roadmap", icon: Compass },
  { key: "alternatives", label: "Alternatives", icon: Lightbulb },
  { key: "aiChat", label: "AI Advisor", badge: "Chat" },
];

function ResultsPage() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { formData, hasSubmitted } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabKey>(search.tab || "market");
  const [isComputing, setIsComputing] = useState(true);

  // Gracefully transition computation skeleton without blocking or forced redirect
  useEffect(() => {
    const timer = setTimeout(() => setIsComputing(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const tabsList: TabItem[] = useMemo(
    () => [
      { key: "market", label: t("results.market"), icon: TrendingUp },
      { key: "swot", label: t("results.swot"), icon: Sparkles },
      { key: "competitors", label: t("results.competitors"), icon: Store },
      { key: "threats", label: t("results.threats"), icon: ShieldAlert },
      { key: "finance", label: t("results.finance"), icon: IndianRupee },
      { key: "schemes", label: t("results.schemes"), icon: Landmark, badge: "Subsidy" },
      { key: "loan", label: t("results.loan"), icon: Calculator },
      { key: "roadmap", label: t("results.roadmap"), icon: Compass },
      { key: "alternatives", label: t("results.alternatives"), icon: Lightbulb },
      { key: "aiChat", label: t("results.ask_ai"), badge: "Chat" },
    ],
    [t],
  );

  useEffect(() => {
    if (search.tab) {
      setActiveTab(search.tab);
    }
  }, [search.tab]);

  // Safe check for session storage without throwing in private/restricted browsing
  const checkSessionSubmitted = (): boolean => {
    if (typeof window === "undefined") return false;
    try {
      return (
        sessionStorage.getItem("pragatisahayak_has_submitted") === "true" ||
        sessionStorage.getItem("vyaparmitra_has_submitted") === "true"
      );
    } catch {
      return false;
    }
  };

  // Compute all metrics using viabilityScorer, schemeMatcher, loanCalculator and datasets
  const resultsData = useMemo(() => {
    try {
      return computeFullResults(formData);
    } catch (err) {
      console.error("Failed to compute full results:", err);
      try {
        return computeFullResults(null);
      } catch (fallbackErr) {
        console.error("Fallback computeFullResults also failed:", fallbackErr);
        return computeFullResults(DEFAULT_FALLBACK_FORM_DATA);
      }
    }
  }, [formData]);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPDF = async () => {
    if (isGeneratingPdf) return;
    try {
      setIsGeneratingPdf(true);
      toast.info("Preparing your 7-page Feasibility Report PDF...", { duration: 2500 });
      // Brief tick to allow UI to render spinner
      await new Promise((resolve) => setTimeout(resolve, 80));
      const fileName = await api.generatePDF(resultsData);
      toast.success(`Report downloaded: ${fileName || "PragatiSahayak_Report.pdf"}`, { duration: 4000 });
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Failed to generate PDF report. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isComputing && (hasSubmitted || checkSessionSubmitted())) {
    return <ResultsSkeleton />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-saffron/20">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {/* Sample / Demo notice banner if accessing directly without form submission */}
        {!hasSubmitted && (
          <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-primary/25 bg-primary/8 p-4.5 sm:flex-row sm:items-center sm:p-5">
            <div className="flex items-center gap-3.5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground text-lg shadow-xs">
                🌾
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  Sample Feasibility Preview ({resultsData.category.name} in{" "}
                  {resultsData.formData.village})
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("results.no_report_desc")}
                </p>
              </div>
            </div>
            <Link
              to="/analyze"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-xs transition hover:bg-primary/90 hover:scale-[1.02]"
            >
              <span>{t("results.start_now")}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {/* Limited Location Data Advisory */}
        {resultsData.isLocationEstimated && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-amber-600/30 bg-amber-600/10 p-4 text-xs sm:text-sm text-amber-900 dark:text-amber-200 animate-in fade-in">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" />
            <p className="font-medium">
              Limited micro-census data available for{" "}
              <strong className="font-bold">{resultsData.formData.village || "your village"}</strong>. Showing
              benchmarks for {resultsData.formData.district}. Confidence: Moderate.
            </p>
          </div>
        )}

        {/* Capital Exceeds Investment Banner */}
        {resultsData.isCapitalExceedingInvestment && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-secondary/30 bg-secondary/10 p-4 text-xs sm:text-sm text-foreground animate-in fade-in">
            <div className="flex items-center gap-3">
              <span className="text-xl shrink-0">🎉</span>
              <p className="font-medium">
                Great financial standing! Your capital of{" "}
                <strong className="font-bold">
                  ₹{(Number(resultsData?.formData?.capital) || 0).toLocaleString("en-IN")}
                </strong>{" "}
                exceeds the estimated investment of{" "}
                <strong className="font-bold">
                  ₹{(Number(resultsData?.estimatedInvestment) || 0).toLocaleString("en-IN")}
                </strong>
                . You can start debt-free without paying loan interest!
              </p>
            </div>
          </div>
        )}

        {/* Page Top Action Bar */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {t("results.title")}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              {t("results.subtitle")}{" "}
              <strong className="text-foreground">{resultsData.formData.fullName || "Entrepreneur"}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Desktop Download PDF Button */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="hidden sm:inline-flex min-h-[40px] items-center gap-2 rounded-full bg-primary px-4.5 text-xs font-bold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Download Feasibility Report as PDF"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="h-4 w-4" />
                  <span>{t("results.download_pdf")} 📄</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-border bg-card px-4 text-xs font-semibold text-foreground transition hover:bg-muted cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">{t("results.print")}</span>
            </button>
            <Link
              to="/analyze"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-secondary px-4.5 text-xs font-bold text-secondary-foreground shadow-xs transition-all hover:bg-secondary/90 hover:scale-[1.02]"
            >
              <span>{t("results.new_analysis")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* TOP SECTION (Always Visible) */}
        <ResultsTopSection data={resultsData} />

        {/* TAB NAVIGATION: Responsive with Horizontal Scroll on Mobile */}
        <div className="mt-8">
          <div className="border-b border-border/80 pb-px">
            <nav
              className="-mb-px flex space-x-2 overflow-x-auto pb-3 scrollbar-none sm:space-x-2.5"
              aria-label="Report Tabs"
            >
              {tabsList.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`group inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition-all sm:text-sm cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                        : "bg-card border border-border/80 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {Icon && (
                      <Icon
                        className={`h-4 w-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"}`}
                      />
                    )}
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                          isActive
                            ? "bg-black/20 text-white"
                            : "bg-secondary/15 text-secondary"
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ACTIVE TAB CONTENT */}
          <div key={activeTab} className="mt-6 tab-content-enter">
            <ErrorBoundary
              fallback={
                <div className="human-card p-8 text-center space-y-3 my-6">
                  <AlertCircle className="h-8 w-8 text-terracotta mx-auto" />
                  <h3 className="text-lg font-bold text-foreground">Section momentarily unavailable</h3>
                  <p className="text-sm text-muted-foreground">
                    Please try switching to another tab above or refresh the page.
                  </p>
                </div>
              }
            >
              {activeTab === "market" && <MarketAnalysisTab data={resultsData} />}
              {activeTab === "swot" && <SwotAnalysisTab data={resultsData} />}
              {activeTab === "competitors" && <CompetitorsTab data={resultsData} />}
              {activeTab === "threats" && <ThreatsTab data={resultsData} />}
              {activeTab === "finance" && <FinanceTab data={resultsData} />}
              {activeTab === "schemes" && <SchemesTab data={resultsData} />}
              {activeTab === "loan" && <LoanTab data={resultsData} />}
              {activeTab === "roadmap" && <RoadmapTab data={resultsData} />}
              {activeTab === "alternatives" && <AlternativesTab data={resultsData} />}
              {activeTab === "aiChat" && <AiChatTab data={resultsData} />}
            </ErrorBoundary>
          </div>
        </div>
      </main>

      {/* Mobile Floating Download PDF Button (Fixed bottom-right on mobile) */}
      <div className="sm:hidden fixed bottom-22 right-5 z-40 animate-in fade-in zoom-in duration-300">
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={isGeneratingPdf}
          className="flex items-center gap-2 rounded-full bg-saffron px-4 py-3 text-xs font-extrabold text-saffron-foreground shadow-2xl border border-white/20 transition hover:opacity-90 active:scale-95 disabled:opacity-50"
          aria-label="Download PDF Report"
        >
          {isGeneratingPdf ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <FileDown className="h-4 w-4" />
              <span>Download PDF 📄</span>
            </>
          )}
        </button>
      </div>

      <Footer />
    </div>
  );
}
