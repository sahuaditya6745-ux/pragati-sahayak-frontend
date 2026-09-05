import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Building2,
  IndianRupee,
  Percent,
  Clock,
  HelpCircle,
  Info,
  ShieldCheck,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import type { FullResultsData } from "@/lib/resultsData";
import type { MatchedScheme } from "@/types/business";

interface SchemesTabProps {
  data: FullResultsData;
}

export function SchemesTab({ data }: SchemesTabProps) {
  const { matchedSchemes, formData, category, financials } = data;

  const schemesList = matchedSchemes || [];
  const eligibleSchemes = schemesList.filter((s: MatchedScheme) => s?.eligible);
  const otherSchemes = schemesList.filter((s: MatchedScheme) => !s?.eligible);

  const neededLoan = Math.max(
    0,
    (Number(financials?.avgInvestment) || 100000) - (Number(formData?.capital) || 0),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="human-card flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-sage/10 text-sage">
              🏛️
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Government Schemes You're Eligible For
            </h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Government subsidies and credit support mapped for{" "}
            <span className="font-semibold text-foreground">{category.name}</span> in{" "}
            <span className="font-semibold text-foreground">{formData.block || "rural"}, {formData.state}</span>.
          </p>
        </div>

        {eligibleSchemes.length > 0 && (
          <div className="human-pill border-sage/30 bg-sage/10 text-sage">
            <Sparkles className="h-4 w-4" />
            <span>{eligibleSchemes.length} Eligible Scheme{eligibleSchemes.length > 1 ? "s" : ""} Available</span>
          </div>
        )}
      </div>

      {/* Main Schemes Grid or Empty State */}
      {eligibleSchemes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center sm:p-10 space-y-4">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-500/10 text-amber-600">
            <AlertCircle className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground sm:text-lg">
              No matching schemes found. Try adjusting your loan amount or business category.
            </h3>
            <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Your investment profile or selected sector currently exceeds or falls outside primary subsidy brackets.
            </p>
          </div>

          <div className="mx-auto max-w-md rounded-xl bg-muted/40 p-4 text-left text-xs space-y-2 text-muted-foreground border border-border/60">
            <p className="font-semibold text-foreground">Recommended Next Steps:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Check general Mudra Shishu/Kishor micro-credit loans (zero collateral up to ₹5 Lakhs).</li>
              <li>Visit your nearest District Industries Centre (DIC) for state-specific MSME grants.</li>
              <li>Adjust your starting capital or explore manufacturing categories to unlock PMEGP subsidies.</li>
            </ul>
          </div>

          <div>
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 rounded-xl bg-saffron px-5 py-2.5 text-xs font-bold text-saffron-foreground shadow-sm transition hover:opacity-90 active:scale-95"
            >
              <span>Modify Input</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {eligibleSchemes.map((scheme: MatchedScheme) => {
            const subsidyDisplay =
              scheme.subsidyPercentApplied > 0
                ? `${scheme.subsidyPercentApplied}% (~₹${(Number(scheme?.estimatedSubsidyAmount) || 0).toLocaleString("en-IN")})`
                : scheme.interest_subvention_percent
                  ? `${scheme.interest_subvention_percent}% Interest Subvention`
                  : "Credit Guarantee / Zero Collateral";

            const maxLoanStr =
              scheme.max_loan_display ||
              (scheme.max_loan ? `₹${(scheme.max_loan / 100000).toFixed(1)} Lakhs` : `₹${(scheme.max_project_cost / 100000).toFixed(1)} Lakhs`);

            const interestStr = scheme.interest_rate || "8.5% - 11.5% per annum";
            const tenureStr = scheme.tenure_years ? `${scheme.tenure_years} years` : "5 - 7 years";

            const applyUrl = scheme.application_url || scheme.url || "#";

            return (
              <div
                key={scheme.id}
                className="human-card group relative flex flex-col justify-between overflow-hidden p-6 transition hover:border-sage/60"
              >
                {/* Accent top ribbon */}
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sage via-ochre to-terracotta" />

                <div>
                  {/* Card Header: Scheme Name & Ministry */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Ministry: {scheme.ministry || scheme.agency}</span>
                      </div>
                      <h3 className="mt-1 text-lg font-bold text-foreground">
                        🏛️ {scheme.name}
                      </h3>
                      {scheme.name_hi && (
                        <p className="text-xs font-medium text-saffron mt-0.5">{scheme.name_hi}</p>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-3.5 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      ELIGIBLE
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Match Score: <span className="font-bold text-foreground">{scheme.matchScore}%</span>
                    </span>
                  </div>

                  {/* Key Financial Parameters Grid */}
                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5 text-xs sm:grid-cols-2">
                    <div className="space-y-0.5">
                      <span className="text-[11px] text-muted-foreground">Max Loan:</span>
                      <p className="font-bold text-foreground">
                        {maxLoanStr.startsWith("₹") ? maxLoanStr : `₹${maxLoanStr}`}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[11px] text-muted-foreground">Interest Rate:</span>
                      <p className="font-bold text-foreground">
                        {interestStr.includes("per annum") ? interestStr : `${interestStr} per annum`}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[11px] text-muted-foreground">Subsidy:</span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">
                        {subsidyDisplay}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[11px] text-muted-foreground">Tenure:</span>
                      <p className="font-bold text-foreground">
                        {tenureStr}
                      </p>
                    </div>
                  </div>

                  {/* Why You Qualify Box */}
                  <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Why you qualify:</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-foreground/90">
                      {scheme.whyQualify ||
                        `"Your business category ${category?.name || "Business"} and loan requirement of ₹${(Number(neededLoan) || 0).toLocaleString("en-IN")} fall within this scheme's criteria."`}
                    </p>
                  </div>

                  {/* Eligibility Criteria Bullet List */}
                  <div className="mt-4 space-y-2">
                    <span className="text-xs font-bold text-foreground">
                      Eligibility Criteria:
                    </span>
                    <ul className="space-y-1.5 text-xs">
                      {(scheme.criteria && scheme.criteria.length > 0
                        ? scheme.criteria
                        : scheme.reasons
                      ).map((crit: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                          <span className="leading-snug">{crit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Apply Online Button */}
                <div className="mt-6 pt-2">
                  <a
                    href={applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sage px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90 active:scale-[0.99]"
                  >
                    <span>Apply Online</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Other Schemes / Ineligible Reference (if any) */}
      {otherSchemes.length > 0 && (
        <div className="human-card p-6">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Other National Schemes for Reference
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {otherSchemes.map((scheme: MatchedScheme) => (
              <div
                key={scheme.id}
                className="flex flex-col justify-between rounded-xl border border-border/60 bg-muted/20 p-4 text-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-foreground">{scheme.name}</h4>
                    <span className="shrink-0 rounded-md border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      Ineligible
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {scheme.ministry || scheme.agency}
                  </p>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    {scheme.reasons[0] || scheme.description}
                  </p>
                </div>
                <div className="mt-3 pt-2">
                  <a
                    href={scheme.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-saffron hover:underline"
                  >
                    <span>View Scheme Guidelines</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mandatory Disclaimer */}
      <div className="flex items-start gap-3 rounded-xl border border-border/80 bg-muted/30 p-4 text-xs text-muted-foreground sm:text-sm">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p>
          <strong className="font-semibold text-foreground">Disclaimer:</strong> Scheme details are for reference only. Please verify current terms, eligibility criteria, and application guidelines on the official website before applying.
        </p>
      </div>
    </div>
  );
}
