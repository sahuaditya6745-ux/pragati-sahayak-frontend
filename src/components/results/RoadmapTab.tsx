import { useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  FileText,
  Hammer,
  Wrench,
  Rocket,
  TrendingUp,
  IndianRupee,
  Lightbulb,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { FullResultsData } from "@/lib/resultsData";
import type { MatchedScheme } from "@/types/business";

interface RoadmapTabProps {
  data: FullResultsData;
}

export function RoadmapTab({ data }: RoadmapTabProps) {
  const { formData, category, financials, loanDetails, matchedSchemes } = data;

  // Identify top eligible matched scheme for personalized application step
  const topEligibleScheme = (matchedSchemes || []).find((s: MatchedScheme) => s.eligible);
  const schemeName = topEligibleScheme ? topEligibleScheme.name : "PMEGP / Mudra Scheme";

  // Total Investment amount calculation
  const totalInvestment =
    Number(financials?.avgInvestment) ||
    Number(loanDetails?.projectCost) ||
    Math.max(Number(category?.min_investment) || 100000, (Number(formData?.capital) || 0) * 3.5);

  // Exact Cost Breakdown ensuring total matches totalInvestment
  const costRegistration = 5000;
  const remainingBudget = Math.max(0, totalInvestment - costRegistration);
  const costSetup = Math.round(remainingBudget * 0.60);
  const costTrial = Math.round(remainingBudget * 0.10);
  const costSoftLaunch = Math.round(remainingBudget * 0.15);
  const costFullOps = Math.max(0, totalInvestment - (costRegistration + costSetup + costTrial + costSoftLaunch));

  // Track expanded state for each node (all start open or first 2 open)
  const [expandedNodes, setExpandedNodes] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
    4: false,
    5: false,
  });

  // Track checked tasks for interactive progress
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const toggleExpand = (nodeId: number) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const timelineSteps = [
    {
      id: 1,
      month: "Month 1-2",
      badgeIcon: "📋",
      title: "Registration & Planning",
      icon: FileText,
      color: "from-blue-500 to-indigo-600",
      accentColor: "blue",
      estimatedCost: costRegistration,
      costLabel: `₹${costRegistration.toLocaleString("en-IN")}`,
      bullets: [
        "Register business (Udyam Registration)",
        `Apply for ${schemeName}`,
        "Open business bank account",
        `Get required licenses (${category.sector === "Manufacturing" ? "FSSAI / Pollution NOC / Trade License" : "Shop Act & Local Trade License"})`,
      ],
      details: {
        deliverable: "Official Udyam Certificate, Bank Current Account, and Loan Sanction Letter.",
        proTip:
          "Udyam registration is 100% free and online at udyamregistration.gov.in. Avoid paying private agent fees.",
        riskToAvoid:
          "Do not mix personal and business bank transactions; open a dedicated Current Account under your firm's name.",
        actionItems: [
          { id: "1-1", text: "Gather Aadhaar, PAN card, and bank statement." },
          { id: "1-2", text: "Submit free online registration on the official Udyam portal." },
          { id: "1-3", text: `Apply online for ${schemeName} with your project report.` },
          { id: "1-4", text: "Apply for local Gram Panchayat / Municipal trade NOC and FSSAI if handling food." },
        ],
      },
    },
    {
      id: 2,
      month: "Month 3",
      badgeIcon: "🏗️",
      title: "Setup & Procurement",
      icon: Hammer,
      color: "from-amber-500 to-orange-600",
      accentColor: "amber",
      estimatedCost: costSetup,
      costLabel: `₹${costSetup.toLocaleString("en-IN")} (60% of investment)`,
      bullets: [
        "Purchase equipment and machinery",
        "Set up workspace/shop",
        "Arrange raw material suppliers",
      ],
      details: {
        deliverable: "Fully fitted premise with commissioned machinery and initial raw inventory in place.",
        proTip:
          "Request written warranty and at least 2 free initial maintenance visits from the machinery manufacturer before paying final balance.",
        riskToAvoid:
          "Avoid purchasing unbranded second-hand machinery without an on-site demonstration under full load.",
        actionItems: [
          { id: "2-1", text: `Finalize lease or layout for your unit in ${formData.village || "your village"}.` },
          { id: "2-2", text: "Inspect and purchase ISI-certified machinery from authorized dealers." },
          { id: "2-3", text: "Arrange electrical power connection (single-phase or 3-phase commercial load)." },
          { id: "2-4", text: "Negotiate payment terms with 2 verified raw material suppliers." },
        ],
      },
    },
    {
      id: 3,
      month: "Month 4",
      badgeIcon: "🔧",
      title: "Trial & Testing",
      icon: Wrench,
      color: "from-purple-500 to-indigo-600",
      accentColor: "purple",
      estimatedCost: costTrial,
      costLabel: `₹${costTrial.toLocaleString("en-IN")} (10% of investment)`,
      bullets: [
        "Install and test equipment",
        "Train helpers/workers",
        "Do trial production runs",
      ],
      details: {
        deliverable: "Calibrated machines, trained operating team, and tested product samples.",
        proTip:
          "Distribute initial trial samples to respected village elders, friends, and local tea stalls to collect honest feedback on taste, quality, and packaging.",
        riskToAvoid:
          "Do not skip safety training for helpers operating rotating belts or high-voltage electric motors.",
        actionItems: [
          { id: "3-1", text: "Conduct 3 test runs to measure output speed and power consumption." },
          { id: "3-2", text: "Train local workers on machine operation, safety shut-offs, and hygiene." },
          { id: "3-3", text: "Calibrate digital weighing scales and packing sealing machines." },
          { id: "3-4", text: "Fix mechanical vibrations, minor electrical issues, or recipe variations." },
        ],
      },
    },
    {
      id: 4,
      month: "Month 5",
      badgeIcon: "🚀",
      title: "Soft Launch",
      icon: Rocket,
      color: "from-emerald-500 to-teal-600",
      accentColor: "emerald",
      estimatedCost: costSoftLaunch,
      costLabel: `₹${costSoftLaunch.toLocaleString("en-IN")} (15% of investment)`,
      bullets: [
        "Start limited operations",
        "Get feedback from initial customers",
        "Fix operational issues",
      ],
      details: {
        deliverable: "First 50 paying customers, live payment systems, and documented customer testimonials.",
        proTip:
          "Set up an audio UPI soundbox at your counter. Hearing the voice confirmation builds trust for both you and your customers.",
        riskToAvoid:
          "Resist offering large credit (udhaar) during your first month; prioritize building steady daily cash collections.",
        actionItems: [
          { id: "4-1", text: `Start sales in ${formData.village || "local village"} with introductory pricing.` },
          { id: "4-2", text: "Enable QR code payment standee and a physical cash register drawer." },
          { id: "4-3", text: "Record customer remarks on speed, quality, and service convenience." },
          { id: "4-4", text: "Fine-tune daily operating hours to match morning/evening village footfall peaks." },
        ],
      },
    },
    {
      id: 5,
      month: "Month 6+",
      badgeIcon: "📈",
      title: "Full Operations",
      icon: TrendingUp,
      color: "from-green to-emerald-600",
      accentColor: "green",
      estimatedCost: costFullOps,
      costLabel: `₹${costFullOps.toLocaleString("en-IN")} (10% of investment)`,
      bullets: [
        "Scale to full capacity",
        "Start marketing in nearby villages",
        "Track revenue and expenses",
      ],
      details: {
        deliverable: "Stable daily revenue, monthly profitability, and expansion to nearby villages.",
        proTip:
          "Create a WhatsApp broadcast group for your village to announce fresh stock arrival, seasonal discounts, and free home deliveries.",
        riskToAvoid:
          "Do not delay monthly loan EMI payments; maintaining an on-time credit record qualifies you for future business expansion loans.",
        actionItems: [
          { id: "5-1", text: `Distribute flyers and posters in nearby weekly haats across ${formData.block || "your block"}.` },
          { id: "5-2", text: "Establish relationships with bulk institutional buyers or local retailers." },
          { id: "5-3", text: "Review monthly income vs expenses using a digital Khata or ledger notebook." },
          { id: "5-4", text: "Set aside 10% of monthly net profit as emergency maintenance reserve." },
        ],
      },
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="human-card flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-terracotta/10 text-terracotta">
              🚀
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Your 6-Month Business Launch Plan
            </h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Step-by-step milestone execution roadmap tailored for starting your{" "}
            <span className="font-semibold text-foreground">{category.name}</span> in{" "}
            <span className="font-semibold text-foreground">
              {formData.village || "your village"}, {formData.block || "your block"}
            </span>.
          </p>
        </div>

        {/* Budget summary chip */}
        <div className="flex shrink-0 flex-col items-start rounded-2xl border border-border/80 bg-muted/40 p-3 text-xs sm:items-end">
          <span className="text-[11px] font-medium text-muted-foreground">Total Budget Allocated:</span>
          <span className="text-base font-extrabold text-foreground sm:text-lg">
            ₹{totalInvestment.toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] text-sage font-semibold">
            Matches 100% of Project Cost
          </span>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 sm:pl-10">
        {/* Continuous vertical connecting line */}
        <div className="absolute left-[19px] top-4 bottom-6 w-0.5 bg-gradient-to-b from-terracotta via-ochre via-slate-500 to-sage sm:left-[27px]" />

        <div className="space-y-6 sm:space-y-8">
          {timelineSteps.map((step) => {
            const isExpanded = expandedNodes[step.id];

            return (
              <div key={step.id} className="relative">
                {/* Node Dot / Icon on the vertical line */}
                <div
                  onClick={() => toggleExpand(step.id)}
                  className="absolute -left-6 top-3 flex h-8 w-8 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-card bg-foreground text-card text-xs font-extrabold shadow-md transition hover:scale-110 sm:-left-10 sm:h-10 sm:w-10 sm:text-sm"
                >
                  <span>{step.badgeIcon}</span>
                </div>

                {/* Timeline Card */}
                <div className="human-card p-5 sm:p-6 transition hover:border-terracotta/40 hover:shadow-md">
                  {/* Top Bar of Node */}
                  <div
                    onClick={() => toggleExpand(step.id)}
                    className="flex cursor-pointer flex-col justify-between gap-2 sm:flex-row sm:items-center"
                  >
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-foreground">
                        <Calendar className="h-3 w-3 text-terracotta" />
                        {step.month}:
                      </span>
                      <h3 className="text-base font-bold text-foreground sm:text-lg">
                        {step.badgeIcon} {step.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <div className="text-right">
                        <span className="text-[11px] text-muted-foreground block sm:inline mr-1">
                          Estimated Cost:
                        </span>
                        <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 sm:text-sm">
                          {step.costLabel}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="grid h-7 w-7 place-items-center rounded-lg border border-border bg-muted/50 text-muted-foreground hover:text-foreground"
                        aria-label="Toggle details"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Bullet points */}
                  <div className="mt-4">
                    <ul className="grid gap-2 text-xs sm:grid-cols-2 sm:text-sm">
                      {step.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-foreground/90 font-medium">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Expandable Section Details */}
                  {isExpanded && (
                    <div className="mt-5 space-y-4 border-t border-border/60 pt-4 animate-in fade-in duration-200">
                      {/* Actionable Interactive Checklist */}
                      <div className="rounded-xl bg-muted/40 p-4">
                        <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                          <CheckCircle2 className="h-4 w-4 text-green" />
                          <span>Actionable Checklist (Click to track progress):</span>
                        </h4>
                        <div className="mt-3 space-y-2">
                          {step.details.actionItems.map((item) => {
                            const isChecked = completedTasks[item.id];
                            return (
                              <label
                                key={item.id}
                                onClick={() => toggleTask(item.id)}
                                className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-transparent p-1.5 text-xs transition hover:bg-muted/60"
                              >
                                <input
                                  type="checkbox"
                                  checked={!!isChecked}
                                  onChange={() => {}}
                                  className="mt-0.5 h-4 w-4 rounded border-border text-green focus:ring-green"
                                />
                                <span
                                  className={`leading-relaxed ${
                                    isChecked
                                      ? "text-muted-foreground line-through opacity-70"
                                      : "text-foreground font-medium"
                                  }`}
                                >
                                  {item.text}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Deliverable, Pro-Tip, and Risk Box */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        {/* Milestone Deliverable */}
                        <div className="rounded-xl border border-border/70 bg-card p-3.5 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-foreground">
                            <Sparkles className="h-3.5 w-3.5 text-saffron" />
                            <span>Milestone Deliverable:</span>
                          </div>
                          <p className="mt-1 text-muted-foreground leading-relaxed">
                            {step.details.deliverable}
                          </p>
                        </div>

                        {/* Pro-Tip */}
                        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                            <Lightbulb className="h-3.5 w-3.5" />
                            <span>Rural Business Pro-Tip:</span>
                          </div>
                          <p className="mt-1 text-foreground/90 leading-relaxed">
                            {step.details.proTip}
                          </p>
                        </div>
                      </div>

                      {/* Risk to avoid */}
                      <div className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <p className="leading-snug">
                          <strong className="font-bold">Key Risk to Avoid:</strong> {step.details.riskToAvoid}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Click to expand toggle hint if collapsed */}
                  {!isExpanded && (
                    <div
                      onClick={() => toggleExpand(step.id)}
                      className="mt-3 flex cursor-pointer items-center justify-center gap-1 border-t border-border/40 pt-2 text-[11px] font-semibold text-muted-foreground transition hover:text-foreground"
                    >
                      <span>Click to view checklist & setup details</span>
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-green/30 bg-green/5 p-5 sm:flex-row sm:p-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-green text-green-foreground font-bold shadow-sm">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground sm:text-base">
              Ready to execute your launch roadmap?
            </h4>
            <p className="text-xs text-muted-foreground">
              Follow this timeline sequentially to achieve steady break-even within{" "}
              <span className="font-semibold text-foreground">{category.breakeven_months} months</span>.
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-foreground shadow-sm transition hover:bg-muted"
        >
          <span>Print / Save Roadmap</span>
        </button>
      </div>
    </div>
  );
}
