import { useState, useMemo } from "react";
import {
  Calculator,
  ShieldCheck,
  Landmark,
  IndianRupee,
  Calendar,
  Percent,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { calculateEMI } from "@/services/loanCalculator";
import { useTranslation } from "react-i18next";
import { getScoreColor } from "@/lib/resultsData";
import type { FullResultsData } from "@/lib/resultsData";
import type { MatchedScheme } from "@/types/business";

interface LoanTabProps {
  data: FullResultsData;
}

/**
 * Mini Circular Readiness Gauge (0-100)
 */
function LoanReadinessGauge({ score }: { score: number }) {
  const scoreColor = getScoreColor(score);
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 76 76">
        {/* Track */}
        <circle
          cx="38"
          cy="38"
          r={radius}
          className="stroke-muted"
          strokeWidth="6"
          fill="transparent"
        />
        {/* Progress */}
        <circle
          cx="38"
          cy="38"
          r={radius}
          stroke={scoreColor.stroke}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-lg font-black tracking-tight text-foreground">{score}</span>
        <span className="text-[9px] font-bold text-muted-foreground uppercase leading-none">
          / 100
        </span>
      </div>
    </div>
  );
}

export function LoanTab({ data }: LoanTabProps) {
  const { t } = useTranslation();
  const { financials, formData, matchedSchemes, category } = data;
  const projectCost = Number(financials?.avgInvestment) || 100000;
  const safeCapital = Number(formData?.capital) || 0;
  const initialFundingNeeded = Math.max(0, projectCost - safeCapital);

  // Top eligible scheme
  const schemesList = matchedSchemes || [];
  const topEligibleScheme = schemesList.find(
    (s: MatchedScheme) => s.eligible && s.subsidyPercentApplied > 0,
  ) || schemesList[0];

  // State for Scheme Selector and editable inputs
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(
    topEligibleScheme ? topEligibleScheme.id : "pmegp",
  );
  const [loanAmount, setLoanAmount] = useState<number>(initialFundingNeeded || 50000);
  const [subsidyPercent, setSubsidyPercent] = useState<number>(
    topEligibleScheme?.subsidyPercentApplied || 25,
  );
  const [interestRate, setInterestRate] = useState<number>(10.5);
  const [tenureYears, setTenureYears] = useState<number>(5);

  // Handle Scheme Selection (Auto-fill values)
  const handleSchemeChange = (schemeId: string) => {
    setSelectedSchemeId(schemeId);
    if (schemeId === "custom") {
      setSubsidyPercent(0);
      setInterestRate(11.5);
      setTenureYears(5);
      return;
    }

    const scheme = matchedSchemes.find((s) => s.id === schemeId);
    if (scheme) {
      // Auto-fill loan amount to funding needed
      setLoanAmount(Math.max(0, projectCost - safeCapital));
      setSubsidyPercent(scheme.subsidyPercentApplied || scheme.subsidy_percent_rural || 0);

      // Scheme specific rates
      if (scheme.id.includes("pmegp")) {
        setInterestRate(9.5);
        setTenureYears(5);
      } else if (scheme.id.includes("mudra")) {
        setInterestRate(10.5);
        setTenureYears(5);
      } else if (scheme.id.includes("pmfme")) {
        setInterestRate(9.0);
        setTenureYears(7);
      } else if (scheme.id.includes("standup")) {
        setInterestRate(9.75);
        setTenureYears(7);
      } else {
        setInterestRate(10.5);
        setTenureYears(5);
      }
    }
  };

  // Real-time Calculations using reducing balance EMI formula from loanCalculator.js
  const calculations = useMemo(() => {
    const rawLoan = Math.max(0, Number(loanAmount) || 0);
    const subPct = Math.max(0, Math.min(100, Number(subsidyPercent) || 0));
    const rate = Math.max(0, Number(interestRate) || 0);
    const yrs = Math.max(1, Math.min(30, Number(tenureYears) || 5));
    const totalMonths = yrs * 12;

    // Subsidy Amount: ₹[loan × subsidy%]
    const subsidyAmount = Math.round((rawLoan * subPct) / 100);

    // Effective Loan (after subsidy): ₹[loan - subsidy]
    const effectiveLoan = Math.max(0, rawLoan - subsidyAmount);

    // Monthly EMI using exact reducing-balance formula:
    // EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]
    const monthlyEMI = calculateEMI(effectiveLoan, rate, totalMonths);

    // Quarterly EMI: ₹[monthly × 3]
    const quarterlyEMI = monthlyEMI * 3;

    // Total Amount Payable & Total Interest
    const totalPayable = monthlyEMI * totalMonths;
    const totalInterest = Math.max(0, totalPayable - effectiveLoan);

    // Year-by-year Amortization Table Schedule
    const monthlyRate = rate / 12 / 100;
    let balance = effectiveLoan;
    const amortizationSchedule = [];

    for (let yr = 1; yr <= yrs; yr++) {
      const opening = balance;
      let yrInterest = 0;
      let yrPrincipal = 0;

      for (let m = 1; m <= 12; m++) {
        if (balance <= 0) break;
        const monthInterest = balance * monthlyRate;
        const monthPrincipal = Math.min(balance, monthlyEMI - monthInterest);
        yrInterest += monthInterest;
        yrPrincipal += monthPrincipal;
        balance = Math.max(0, balance - monthPrincipal);
      }

      amortizationSchedule.push({
        year: yr,
        openingBalance: Math.round(opening),
        emiPaid: Math.round(yrInterest + yrPrincipal),
        interest: Math.round(yrInterest),
        principal: Math.round(yrPrincipal),
        closingBalance: Math.round(balance),
      });
    }

    return {
      rawLoan,
      subPct,
      rate,
      yrs,
      totalMonths,
      subsidyAmount,
      effectiveLoan,
      monthlyEMI,
      quarterlyEMI,
      totalInterest,
      totalPayable,
      amortizationSchedule,
    };
  }, [loanAmount, subsidyPercent, interestRate, tenureYears]);

  // Loan Readiness Score (0-100):
  // Based on: margin money ratio (40%), scheme fit (30%), capital adequacy (30%)
  const readiness = useMemo(() => {
    // 1. Margin Money Ratio (40% weight)
    const marginRatio = projectCost > 0 ? safeCapital / projectCost : 0;
    const marginScore =
      marginRatio >= 0.25
        ? 100
        : marginRatio >= 0.15
          ? 85
          : marginRatio >= 0.1
            ? 70
            : Math.round((marginRatio / 0.1) * 60);

    // 2. Scheme Fit (30% weight)
    const scheme = matchedSchemes.find((s) => s.id === selectedSchemeId);
    const schemeScore =
      scheme?.eligible && (scheme.subsidyPercentApplied || 0) >= 25
        ? 100
        : scheme?.eligible
          ? 85
          : 60;

    // 3. Capital Adequacy (30% weight)
    const minInv = Number(category?.min_investment) || 100000;
    const adequacyRatio = minInv > 0 ? safeCapital / minInv : 0;
    const adequacyScore =
      adequacyRatio >= 1.0
        ? 100
        : adequacyRatio >= 0.75
          ? 85
          : adequacyRatio >= 0.5
            ? 70
            : Math.round(adequacyRatio * 100);

    const totalReadinessScore = Math.min(
      100,
      Math.max(
        0,
        Math.round(marginScore * 0.4 + schemeScore * 0.3 + adequacyScore * 0.3),
      ),
    );

    const label =
      totalReadinessScore >= 80
        ? "High Bank Loan Readiness"
        : totalReadinessScore >= 60
          ? "Moderate Loan Readiness"
          : "Margin Enhancement Recommended";

    return {
      totalScore: totalReadinessScore,
      label,
      marginScore,
      schemeScore,
      adequacyScore,
      marginRatioPercent: Math.round(marginRatio * 100),
    };
  }, [projectCost, formData.capital, matchedSchemes, selectedSchemeId, category]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="human-card flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {t("loan.title")}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Calculate accurate monthly EMIs, government subsidies, interest schedules and your bank readiness score.
          </p>
        </div>

        <span className="human-pill border-sage/30 bg-sage/10 text-sage">
          <span>Reducing Balance Math</span>
        </span>
      </div>

      {/* Scheme Selector & Loan Readiness Gauge Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Scheme Selector Dropdown (7 cols) */}
        <div className="human-card p-5 sm:p-6 lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-terracotta/10 text-terracotta">
              <Landmark className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Select Credit / Subsidy Scheme
              </h3>
              <p className="text-xs text-muted-foreground">
                Auto-populates loan subsidy rates and standard bank terms
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="schemeSelect" className="block text-xs font-bold text-foreground mb-1.5">
              Matched Government Schemes
            </label>
            <select
              id="schemeSelect"
              value={selectedSchemeId}
              onChange={(e) => handleSchemeChange(e.target.value)}
              className="min-h-[46px] w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/20"
            >
              {matchedSchemes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.subsidyPercentApplied || s.subsidy_percent_rural}% Subsidy) — {s.agency}
                </option>
              ))}
              <option value="custom">Standard Commercial Bank Loan (0% Subsidy)</option>
            </select>
          </div>

          <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Scheme Benefit: </span>
            {selectedSchemeId === "custom"
              ? "General micro-enterprise loan with commercial interest rates and zero government capital subsidy."
              : matchedSchemes.find((s) => s.id === selectedSchemeId)?.description ||
                "Subsidized central credit scheme designed for rural micro-enterprises."}
          </div>
        </div>

        {/* Loan Readiness Score Gauge (5 cols) */}
        <div className="human-card flex flex-col justify-between p-5 sm:p-6 lg:col-span-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Loan Readiness Score
              </span>
              <h4 className="mt-1 text-base font-bold text-foreground sm:text-lg">
                {readiness.label}
              </h4>
            </div>
            <LoanReadinessGauge score={readiness.totalScore} />
          </div>

          {/* Readiness Criteria Breakdown */}
          <div className="mt-4 space-y-2 border-t border-border/60 pt-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Margin Money Ratio ({readiness.marginRatioPercent}%):</span>
              <span className="font-bold text-foreground">{readiness.marginScore}/100 (40%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Government Scheme Fit:</span>
              <span className="font-bold text-foreground">{readiness.schemeScore}/100 (30%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Capital Adequacy:</span>
              <span className="font-bold text-foreground">{readiness.adequacyScore}/100 (30%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* EDITABLE PARAMETERS & REAL-TIME SUMMARY GRID */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Editable Loan Inputs (5 cols) */}
        <div className="human-card p-5 sm:p-6 lg:col-span-5 space-y-4">
          <h3 className="text-base font-bold text-foreground">
            Editable Loan Parameters
          </h3>
          <p className="text-xs text-muted-foreground">
            Adjust loan amount, subsidy percentage, interest rate, or tenure to simulate custom terms.
          </p>

          <div className="space-y-4 pt-2">
            {/* 1. Loan Amount (Editable Input) */}
            <div>
              <label htmlFor="loanAmountInput" className="flex justify-between text-xs font-bold text-foreground mb-1.5">
                <span>{t("loan.loan_amount")}</span>
                <span className="text-saffron">₹{calculations.rawLoan.toLocaleString("en-IN")}</span>
              </label>
              <div className="flex items-stretch overflow-hidden rounded-xl border border-border focus-within:border-saffron focus-within:ring-2 focus-within:ring-saffron/20">
                <span className="grid w-10 shrink-0 place-items-center bg-muted text-sm font-bold text-foreground">
                  ₹
                </span>
                <input
                  id="loanAmountInput"
                  type="number"
                  min={0}
                  step={5000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
                  className="min-h-[42px] w-full bg-background px-3 text-sm font-semibold text-foreground outline-none"
                />
              </div>
            </div>

            {/* 2. Subsidy Percentage (Editable Range + Input) */}
            <div>
              <div className="flex justify-between text-xs font-bold text-foreground mb-1.5">
                <span>{t("loan.subsidy")}</span>
                <span className="text-green">{subsidyPercent}% (₹{calculations.subsidyAmount.toLocaleString("en-IN")})</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                step={1}
                value={subsidyPercent}
                onChange={(e) => setSubsidyPercent(Number(e.target.value))}
                className="h-2 w-full cursor-pointer accent-green"
              />
              <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                <span>0%</span>
                <span>25% (PMEGP Urban)</span>
                <span>35% (PMEGP Rural)</span>
                <span>50%</span>
              </div>
            </div>

            {/* 3. Interest Rate (Editable Input + Slider) */}
            <div>
              <div className="flex justify-between text-xs font-bold text-foreground mb-1.5">
                <span>{t("loan.interest_rate")}</span>
                <span className="text-foreground font-extrabold">{interestRate}% p.a.</span>
              </div>
              <input
                type="range"
                min={6}
                max={16}
                step={0.25}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="h-2 w-full cursor-pointer accent-saffron"
              />
              <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                <span>6%</span>
                <span>9.5% (PMEGP/Mudra)</span>
                <span>12%</span>
                <span>16%</span>
              </div>
            </div>

            {/* 4. Tenure in Years (Editable Buttons) */}
            <div>
              <div className="flex justify-between text-xs font-bold text-foreground mb-1.5">
                <span>{t("loan.tenure")}</span>
                <span className="text-saffron font-bold">
                  {tenureYears} Years ({calculations.totalMonths} Months)
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[3, 5, 7, 10].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setTenureYears(yr)}
                    className={`rounded-xl border py-2 text-xs font-bold transition ${
                      tenureYears === yr
                        ? "border-saffron bg-saffron text-saffron-foreground shadow-sm"
                        : "border-border bg-muted/40 text-foreground hover:bg-muted"
                    }`}
                  >
                    {yr} Yrs
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Real-time Calculations Summary (7 cols) */}
        <div className="human-card flex flex-col justify-between p-5 sm:p-6 lg:col-span-7 space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t("loan.emi_monthly")}
              </span>
              <span className="rounded-full bg-green/10 px-2.5 py-0.5 text-[11px] font-bold text-green">
                {t("loan.emi_quarterly")}: ₹{calculations.quarterlyEMI.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-foreground sm:text-4xl">
                ₹{calculations.monthlyEMI.toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-medium text-muted-foreground">/ month</span>
            </div>

            {/* 4 Key Calculation Cards */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-border/70 bg-muted/30 p-3 text-xs">
                <span className="text-muted-foreground block text-[11px]">{t("loan.subsidy")}:</span>
                <span className="font-extrabold text-green text-sm sm:text-base">
                  ₹{calculations.subsidyAmount.toLocaleString("en-IN")}
                </span>
                <span className="block text-[10px] text-muted-foreground">{subsidyPercent}% Grant</span>
              </div>

              <div className="rounded-xl border border-border/70 bg-muted/30 p-3 text-xs">
                <span className="text-muted-foreground block text-[11px]">{t("loan.effective_loan")}:</span>
                <span className="font-extrabold text-foreground text-sm sm:text-base">
                  ₹{calculations.effectiveLoan.toLocaleString("en-IN")}
                </span>
                <span className="block text-[10px] text-muted-foreground">Principal amount</span>
              </div>

              <div className="rounded-xl border border-border/70 bg-muted/30 p-3 text-xs">
                <span className="text-muted-foreground block text-[11px]">{t("loan.total_interest")}:</span>
                <span className="font-extrabold text-amber-600 dark:text-amber-400 text-sm sm:text-base">
                  ₹{calculations.totalInterest.toLocaleString("en-IN")}
                </span>
                <span className="block text-[10px] text-muted-foreground">Over {tenureYears} yrs</span>
              </div>

              <div className="rounded-xl border border-border/70 bg-muted/30 p-3 text-xs">
                <span className="text-muted-foreground block text-[11px]">{t("loan.total_payment")}:</span>
                <span className="font-extrabold text-foreground text-sm sm:text-base">
                  ₹{calculations.totalPayable.toLocaleString("en-IN")}
                </span>
                <span className="block text-[10px] text-muted-foreground">Principal + Interest</span>
              </div>
            </div>

            {/* Formula Transparency Callout */}
            <div className="mt-5 rounded-xl border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <Calculator className="h-3.5 w-3.5 text-saffron" />
                <span>Exact Reducing Balance Formula Applied:</span>
              </div>
              <p className="font-mono text-[11px] text-foreground">
                EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]
              </p>
              <p className="text-[11px]">
                Where P = ₹{calculations.effectiveLoan.toLocaleString("en-IN")}, R = {(interestRate / 12 / 100).toFixed(6)}, N = {calculations.totalMonths} months.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-green/10 p-3 text-xs text-green flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>
              All Mudra & PMEGP loans are backed by CGTMSE collateral-free guarantee. No land or home mortgaging needed.
            </span>
          </div>
        </div>
      </div>

      {/* AMORTIZATION TABLE (YEAR-BY-YEAR) */}
      <div className="human-card p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground sm:text-lg">
                Year-by-Year Amortization Schedule
              </h3>
              <p className="text-xs text-muted-foreground">
                Step-by-step annual principal reduction, interest paid, and closing balances
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-border/70">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-border/70 bg-muted/40 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-4 py-3 sm:px-5 sm:py-3.5">Year</th>
                  <th scope="col" className="px-4 py-3 sm:px-5 sm:py-3.5">Opening Balance</th>
                  <th scope="col" className="px-4 py-3 sm:px-5 sm:py-3.5">EMI Paid</th>
                  <th scope="col" className="px-4 py-3 sm:px-5 sm:py-3.5">Interest</th>
                  <th scope="col" className="px-4 py-3 sm:px-5 sm:py-3.5">Principal</th>
                  <th scope="col" className="px-4 py-3 sm:px-5 sm:py-3.5">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {calculations.amortizationSchedule.map((row) => (
                  <tr key={row.year} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 sm:px-5 sm:py-3.5 font-bold text-foreground whitespace-nowrap">
                      Year {row.year}
                    </td>
                    <td className="px-4 py-3 sm:px-5 sm:py-3.5 text-muted-foreground whitespace-nowrap">
                      ₹{row.openingBalance.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 sm:px-5 sm:py-3.5 font-semibold text-foreground whitespace-nowrap">
                      ₹{row.emiPaid.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 sm:px-5 sm:py-3.5 text-amber-600 dark:text-amber-400 font-medium whitespace-nowrap">
                      ₹{row.interest.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 sm:px-5 sm:py-3.5 text-green font-medium whitespace-nowrap">
                      ₹{row.principal.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 sm:px-5 sm:py-3.5 font-bold text-foreground whitespace-nowrap">
                      ₹{row.closingBalance.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
