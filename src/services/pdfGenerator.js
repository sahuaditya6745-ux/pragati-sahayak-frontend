import { jsPDF as jsPDFNamed } from "jspdf";
import * as jspdfLib from "jspdf";
import autoTablePkg from "jspdf-autotable";

// Resilient resolver for ESM/CJS bundling across Vite & environments
const jsPDF = jsPDFNamed || jspdfLib.default?.jsPDF || jspdfLib.default;
const autoTable = typeof autoTablePkg === "function" ? autoTablePkg : autoTablePkg.autoTable || autoTablePkg.default;

/**
 * Clean currency formatting without unicode Indian Rupee symbol
 * (standard PDF Helvetica font renders ₹ as garbled characters).
 * @param {number} amount
 * @returns {string} e.g. "Rs. 2,50,000"
 */
function formatRupees(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "Rs. 0";
  }
  return `Rs. ${Number(amount).toLocaleString("en-IN")}`;
}

/**
 * Format date nicely for report display
 * @param {Date|string} date
 * @returns {string} e.g. "01 September 2026"
 */
function formatDate(date) {
  const d = date ? new Date(date) : new Date();
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/**
 * Draws the standard Saffron header bar and page footer across Pages 2 to 7.
 * @param {jsPDF} doc
 * @param {string} pageTitle
 * @param {number} pageNum
 * @param {number} totalPages
 */
function drawPageHeaderFooter(doc, pageTitle, pageNum, totalPages = 7) {
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;

  // 1. Saffron Header Bar across the top
  doc.setFillColor(255, 153, 51); // #FF9933 Saffron
  doc.rect(0, 0, pageWidth, 13, "F");

  // Deep saffron decorative underline
  doc.setFillColor(227, 100, 20); // #E36414
  doc.rect(0, 13, pageWidth, 1.5, "F");

  // Header Left: Brand Logo & Category
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("PRAGATISAHAYAK", margin, 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`|   ${pageTitle.toUpperCase()}`, margin + 35, 9);

  // Header Right: Tagline
  doc.setFontSize(8);
  doc.text("AI ADVISORY REPORT", pageWidth - margin, 9, { align: "right" });

  // 2. Footer
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("PragatiSahayak AI Feasibility Engine • Confidential", margin, pageHeight - 10);
  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, pageHeight - 10, {
    align: "right",
  });
}

/**
 * Generates a professional 7-page PDF Business Feasibility Report.
 * 
 * @param {object} userData - User inputs (fullName, category, village, block, district, state, capital, etc.)
 * @param {object} analysisData - Full computed analysis results from computeFullResults
 */
export function generateReportPDF(userData, analysisData) {
  // Normalize user & analysis data
  const user = {
    fullName: userData?.fullName || analysisData?.formData?.fullName || "Entrepreneur",
    category: userData?.category || analysisData?.category?.name || analysisData?.formData?.category || "Rural Enterprise",
    village: userData?.village || analysisData?.formData?.village || "Local Village",
    block: userData?.block || analysisData?.formData?.block || "Local Block",
    district: userData?.district || analysisData?.formData?.district || "District",
    state: userData?.state || analysisData?.formData?.state || "State",
    capital: userData?.capital ?? analysisData?.formData?.capital ?? 0,
    language: userData?.language || analysisData?.formData?.language || "English",
  };

  const analysis = analysisData || {};
  const viabilityScore = analysis.totalScore ?? 75;
  const viabilityLabel = analysis.scoreLabel || (viabilityScore >= 70 ? "High Viability" : viabilityScore >= 50 ? "Moderate Viability" : "Challenging");
  const financials = analysis.financials || {};
  const loan = analysis.loanDetails || {};
  const schemes = analysis.matchedSchemes || [];
  const roadmapSteps = analysis.roadmap || [];
  const swot = analysis.swot || {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  };

  // Create A4 portrait document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const margin = 20; // 20mm margin required
  const contentWidth = pageWidth - margin * 2; // 170mm
  const currentDate = formatDate(new Date());

  // =========================================================================
  // PAGE 1 — COVER PAGE
  // =========================================================================
  {
    // Top Saffron Decorative Banner
    doc.setFillColor(255, 153, 51);
    doc.rect(0, 0, pageWidth, 22, "F");
    doc.setFillColor(227, 100, 20);
    doc.rect(0, 22, pageWidth, 2, "F");

    // "PragatiSahayak" logo text (large, centered, saffron)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(36); // Large logo text
    doc.setTextColor(227, 100, 20); // Deep saffron
    doc.text("PragatiSahayak", pageWidth / 2, 70, { align: "center" });

    // Decorative tagline below logo
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(148, 163, 184);
    doc.text("RURAL ENTERPRISE EMPOWERMENT PLATFORM", pageWidth / 2, 78, {
      align: "center",
    });

    // "Business Feasibility Report" subtitle (Title font size: 24pt)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(30, 41, 59);
    doc.text("Business Feasibility Report", pageWidth / 2, 98, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text("Comprehensive Market, Financial & Subsidy Advisory", pageWidth / 2, 107, {
      align: "center",
    });

    // Horizontal line separator
    doc.setDrawColor(255, 153, 51);
    doc.setLineWidth(0.8);
    doc.line(margin + 15, 117, pageWidth - margin - 15, 117);

    // Profile Card Box
    const cardY = 130;
    const cardHeight = 85;
    doc.setFillColor(255, 250, 245); // Warm subtle saffron tint
    doc.setDrawColor(255, 204, 153);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, cardY, contentWidth, cardHeight, 4, 4, "FD");

    // Inner card title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(227, 100, 20);
    doc.text("APPLICANT & ENTERPRISE DOSSIER", margin + 10, cardY + 12);

    doc.setDrawColor(241, 245, 249);
    doc.line(margin + 10, cardY + 16, pageWidth - margin - 10, cardY + 16);

    // Grid data inside card
    const fields = [
      { label: "User Name:", value: user.fullName },
      { label: "Business:", value: user.category },
      {
        label: "Location:",
        value: `${user.village}, ${user.block}, ${user.district}, ${user.state}`,
      },
      { label: "Date:", value: currentDate },
      {
        label: "Own Capital Contribution:",
        value: formatRupees(user.capital),
      },
    ];

    let fieldY = cardY + 25;
    fields.forEach((item) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(item.label, margin + 10, fieldY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      // Wrap long location values
      const valLines = doc.splitTextToSize(item.value, contentWidth - 65);
      doc.text(valLines, margin + 65, fieldY);
      fieldY += Math.max(10, valLines.length * 5.5 + 4);
    });

    // "Generated by PragatiSahayak AI Advisory"
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(227, 100, 20);
    doc.text("Generated by PragatiSahayak AI Advisory", pageWidth / 2, 252, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text("Strictly Confidential • Valid for Local Business Planning Only", pageWidth / 2, 258, {
      align: "center",
    });

    // Bottom decorative bar
    doc.setFillColor(255, 153, 51);
    doc.rect(0, 290, pageWidth, 7, "F");
  }

  // =========================================================================
  // PAGE 2 — EXECUTIVE SUMMARY
  // =========================================================================
  {
    doc.addPage();
    drawPageHeaderFooter(doc, "Executive Summary", 2, 7);

    // Section Heading (Heading font size: 14pt)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("Executive Summary & Viability Evaluation", margin, 27);

    // Business Viability Scorecard Card
    const scoreY = 33;
    const scoreHeight = 32;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, scoreY, contentWidth, scoreHeight, 3, 3, "FD");

    // Left accent strip on the card
    doc.setFillColor(viabilityScore >= 70 ? 19 : 255, viabilityScore >= 70 ? 136 : 153, viabilityScore >= 70 ? 8 : 51);
    doc.roundedRect(margin, scoreY, 4, scoreHeight, 2, 2, "F");

    // Viability Score text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("BUSINESS VIABILITY INDEX", margin + 12, scoreY + 11);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text(`Business Viability Score: ${viabilityScore}/100 (${viabilityLabel})`, margin + 12, scoreY + 22);

    // One-paragraph summary of findings
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("Summary of Findings", margin, 74);

    const defaultSummary = `Based on location dynamics in ${user.village}, ${user.block} and current market demand for ${user.category}, this enterprise demonstrates a viability score of ${viabilityScore}/100. With an estimated capital investment of ${formatRupees(financials.avgInvestment || user.capital * 3)} and a supportive rural consumer base, the unit possesses stable commercial fundamentals. Proper execution of government subsidy linkages and disciplined working capital control will ensure sustainable profitability and swift breakeven.`;

    const summaryText = analysis.summary || defaultSummary;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10); // Body font size: 10pt
    doc.setTextColor(51, 65, 85);
    const summaryLines = doc.splitTextToSize(summaryText, contentWidth);
    doc.text(summaryLines, margin, 81);

    const afterSummaryY = 81 + summaryLines.length * 5.2 + 6;

    // Key highlights (3 bullet points)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("Key Strategic Highlights", margin, afterSummaryY);

    const highlights = [
      `Market & Demand: Strong local demand potential for ${user.category} across ${user.block} with sustainable recurring daily consumption.`,
      `Financial Feasibility: Projected initial investment of ${formatRupees(financials.avgInvestment || user.capital * 3)} with estimated operational breakeven achieved in ${financials.breakevenMonths || 6} to 9 months.`,
      `Scheme Eligibility: Matched with high-priority government subsidy programs (e.g. ${schemes[0]?.name || "PMEGP / Mudra"}) providing capital margin assistance.`,
    ];

    let bulletY = afterSummaryY + 8;
    highlights.forEach((hl) => {
      // Saffron bullet marker
      doc.setFillColor(255, 153, 51);
      doc.circle(margin + 2.5, bulletY - 1.5, 1.6, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      const hlLines = doc.splitTextToSize(hl, contentWidth - 10);
      doc.text(hlLines, margin + 8, bulletY);
      bulletY += hlLines.length * 5.2 + 4;
    });

    // Score Breakdown Table using jspdf-autotable
    const breakdown = analysis.breakdown || {
      demand: Math.min(25, Math.round(viabilityScore * 0.25)),
      competition: Math.min(20, Math.round(viabilityScore * 0.20)),
      capital: Math.min(20, Math.round(viabilityScore * 0.20)),
      infrastructure: Math.min(20, Math.round(viabilityScore * 0.20)),
      risk: Math.min(15, Math.round(viabilityScore * 0.15)),
    };

    autoTable(doc, {
      startY: bulletY + 6,
      margin: { left: margin, right: margin },
      head: [["Evaluation Parameter", "Weight / Max", "Obtained Score", "Assessment"]],
      body: [
        ["Market Demand Drivers", "25 pts", `${breakdown.demand} pts`, breakdown.demand >= 18 ? "Strong" : "Moderate"],
        ["Competition & Density", "20 pts", `${breakdown.competition} pts`, breakdown.competition >= 14 ? "Favorable" : "Competitive"],
        ["Capital Feasibility", "20 pts", `${breakdown.capital} pts`, breakdown.capital >= 14 ? "Healthy" : "Needs Subsidy"],
        ["Infrastructure Readiness", "20 pts", `${breakdown.infrastructure} pts`, breakdown.infrastructure >= 14 ? "Adequate" : "Developing"],
        ["Risk Mitigation", "15 pts", `${breakdown.risk} pts`, breakdown.risk >= 10 ? "Controlled" : "Moderate Risk"],
      ],
      theme: "grid",
      headStyles: {
        fillColor: [255, 153, 51], // Saffron header
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // Alternating row color
      },
      styles: {
        fontSize: 9,
        cellPadding: 3.5,
        textColor: [30, 41, 59],
      },
    });
  }

  // =========================================================================
  // PAGE 3 — SWOT ANALYSIS
  // =========================================================================
  {
    doc.addPage();
    drawPageHeaderFooter(doc, "SWOT Analysis", 3, 7);

    // Section Heading (Heading font size: 14pt)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("Strategic SWOT Analysis", margin, 27);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `AI-synthesized strategic matrix evaluating internal and external determinants for ${user.category}.`,
      margin,
      34
    );

    // Format bullet points for each SWOT cell
    const formatSwotPoints = (items, fallback) => {
      if (!items || items.length === 0) return fallback.join("\n\n• ");
      return (
        "• " +
        items
          .slice(0, 4)
          .map((it) => (typeof it === "string" ? it : it.point || it.text || JSON.stringify(it)))
          .join("\n\n• ")
      );
    };

    const sBullets = formatSwotPoints(swot.strengths, [
      "Consistent year-round demand for staple rural consumer items.",
      "Lower operational overheads and workshop rental costs.",
      "Proximity to target village customers fostering loyal client base.",
    ]);

    const wBullets = formatSwotPoints(swot.weaknesses, [
      "High upfront reliance on reliable single/three-phase electrical supply.",
      "Limited working capital buffer during initial market penetration.",
      "Dependency on prompt raw inventory sourcing and transportation.",
    ]);

    const oBullets = formatSwotPoints(swot.opportunities, [
      "Value addition, branded packaging, and retail distribution to neighbouring blocks.",
      "Attractive government credit-linked capital subsidies (PMEGP / Mudra).",
      "Opportunity to form tie-ups with local agricultural self-help groups (SHGs).",
    ]);

    const tBullets = formatSwotPoints(swot.threats, [
      "Informal local price competition from unorganized operators.",
      "Seasonal power voltage fluctuations or power outage risks.",
      "Occasional spike in raw commodity or wholesale procurement rates.",
    ]);

    // 2x2 SWOT Matrix using jspdf-autotable
    const halfWidth = contentWidth / 2;

    autoTable(doc, {
      startY: 42,
      margin: { left: margin, right: margin },
      head: [
        [
          {
            content: "STRENGTHS (Internal Advantages)",
            styles: {
              fillColor: [19, 136, 8], // Green
              textColor: [255, 255, 255],
              fontStyle: "bold",
              fontSize: 10,
              halign: "left",
            },
          },
          {
            content: "WEAKNESSES (Internal Challenges)",
            styles: {
              fillColor: [234, 88, 12], // Deep Amber / Orange
              textColor: [255, 255, 255],
              fontStyle: "bold",
              fontSize: 10,
              halign: "left",
            },
          },
        ],
      ],
      body: [
        [
          {
            content: sBullets,
            styles: {
              fillColor: [240, 253, 244], // Light green tint
              textColor: [22, 101, 52],
              cellPadding: 6,
              fontSize: 9,
              valign: "top",
              minCellHeight: 85,
            },
          },
          {
            content: wBullets,
            styles: {
              fillColor: [255, 251, 235], // Light amber tint
              textColor: [146, 64, 14],
              cellPadding: 6,
              fontSize: 9,
              valign: "top",
              minCellHeight: 85,
            },
          },
        ],
        [
          {
            content: "OPPORTUNITIES (Growth Levers)",
            styles: {
              fillColor: [37, 99, 235], // Blue
              textColor: [255, 255, 255],
              fontStyle: "bold",
              fontSize: 10,
              halign: "left",
            },
          },
          {
            content: "THREATS (External Risks)",
            styles: {
              fillColor: [220, 38, 38], // Red
              textColor: [255, 255, 255],
              fontStyle: "bold",
              fontSize: 10,
              halign: "left",
            },
          },
        ],
        [
          {
            content: oBullets,
            styles: {
              fillColor: [239, 246, 255], // Light blue tint
              textColor: [30, 64, 175],
              cellPadding: 6,
              fontSize: 9,
              valign: "top",
              minCellHeight: 85,
            },
          },
          {
            content: tBullets,
            styles: {
              fillColor: [254, 242, 242], // Light red tint
              textColor: [153, 27, 27],
              cellPadding: 6,
              fontSize: 9,
              valign: "top",
              minCellHeight: 85,
            },
          },
        ],
      ],
      theme: "grid",
      columnStyles: {
        0: { cellWidth: halfWidth },
        1: { cellWidth: halfWidth },
      },
    });
  }

  // =========================================================================
  // PAGE 4 — FINANCIAL PLAN
  // =========================================================================
  {
    doc.addPage();
    drawPageHeaderFooter(doc, "Financial Plan", 4, 7);

    // Section Heading (Heading font size: 14pt)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("Financial Plan & Capital Structure", margin, 27);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(
      "Comprehensive project budget, margin capital, matched subsidy, and debt servicing outlook.",
      margin,
      34
    );

    // Computed financial metrics
    const totalInvestment = financials.avgInvestment || loan.projectCost || Math.max(150000, user.capital * 3.5);
    const marginCapital = user.capital > 0 ? user.capital : Math.round(totalInvestment * 0.15);
    const topScheme = schemes.find((s) => s.eligible) || schemes[0] || {
      name: "PMEGP Subsidy Scheme",
      subsidy_percent_rural: 35,
    };
    const subsidyRate = topScheme.subsidy_percent_rural || loan.subsidyPercent || 25;
    const estimatedSubsidy = Math.round((totalInvestment * subsidyRate) / 100);
    const loanNeeded = Math.max(0, totalInvestment - marginCapital - estimatedSubsidy);

    const monthlyEMI = loan.emi || Math.round((loanNeeded * 0.021));
    const quarterlyEMI = monthlyEMI * 3;

    // Financial KPI Summary Cards Table
    autoTable(doc, {
      startY: 40,
      margin: { left: margin, right: margin },
      head: [["Total Project Cost", "Margin Capital (Own)", "Est. Subsidy", "Net Loan Needed"]],
      body: [
        [
          formatRupees(totalInvestment),
          formatRupees(marginCapital),
          `${formatRupees(estimatedSubsidy)} (${subsidyRate}%)`,
          formatRupees(loanNeeded),
        ],
      ],
      theme: "grid",
      headStyles: {
        fillColor: [255, 153, 51],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
        halign: "center",
      },
      bodyStyles: {
        fontStyle: "bold",
        fontSize: 10,
        textColor: [30, 41, 59],
        halign: "center",
        cellPadding: 4,
      },
      alternateRowStyles: {
        fillColor: [255, 251, 235],
      },
    });

    const currentYAfterKpi = doc.lastAutoTable ? doc.lastAutoTable.finalY + 8 : 65;

    // EMI Details Box
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("Matched Scheme & Debt Repayment Terms", margin, currentYAfterKpi);

    autoTable(doc, {
      startY: currentYAfterKpi + 4,
      margin: { left: margin, right: margin },
      head: [["Matched Govt Scheme", "Tenure", "Monthly EMI", "Quarterly EMI (3 mo.)"]],
      body: [
        [
          topScheme.name || "PMEGP / Mudra Yojana",
          `${loan.months || 60} Months (5 Years)`,
          formatRupees(monthlyEMI),
          formatRupees(quarterlyEMI),
        ],
      ],
      theme: "grid",
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 9.5,
        textColor: [30, 41, 59],
        cellPadding: 4,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
    });

    const currentYAfterEmi = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 105;

    // Investment Breakdown Table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("Capital Expenditure (CapEx) & Working Capital Breakdown", margin, currentYAfterEmi);

    // Custom or default capex breakdown
    const capexItems = financials.capexBreakdown && financials.capexBreakdown.length > 0
      ? financials.capexBreakdown.map((item) => [
          item.item,
          formatRupees(item.amount),
          `${item.percentage}%`,
          `Essential equipment & operational allocation for ${user.category}`,
        ])
      : [
          ["Machinery & Core Processing Equipment", formatRupees(Math.round(totalInvestment * 0.40)), "40%", "Primary processing machinery, motors and tooling setup"],
          ["Initial Raw Material & Inventory", formatRupees(Math.round(totalInvestment * 0.25)), "25%", "Initial stock buffer for uninterrupted manufacturing/sales"],
          ["Facility Setup & Commercial Electricals", formatRupees(Math.round(totalInvestment * 0.15)), "15%", "Wiring, counters, safety equipment and shop fixtures"],
          ["Operating Contingency Reserve", formatRupees(Math.round(totalInvestment * 0.15)), "15%", "Emergency cash buffer for cashflow stabilization"],
          ["Licensing, Permits & Digital Onboarding", formatRupees(Math.round(totalInvestment * 0.05)), "5%", "Udyam registration, FSSAI/Trade NOC and initial signage"],
        ];

    autoTable(doc, {
      startY: currentYAfterEmi + 4,
      margin: { left: margin, right: margin },
      head: [["Investment Component", "Amount", "Share (%)", "Purpose & Allocation"]],
      body: capexItems,
      foot: [
        ["Total Estimated Investment", formatRupees(totalInvestment), "100%", "Full project outlay ready for bank sanction"],
      ],
      theme: "grid",
      headStyles: {
        fillColor: [255, 153, 51], // Saffron header bar
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      footStyles: {
        fillColor: [241, 245, 249],
        textColor: [15, 23, 42],
        fontStyle: "bold",
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // Alternating row color
      },
      styles: {
        fontSize: 9,
        cellPadding: 3.5,
        textColor: [51, 65, 85],
      },
      columnStyles: {
        0: { cellWidth: 55, fontStyle: "bold" },
        1: { cellWidth: 32 },
        2: { cellWidth: 23, halign: "center" },
        3: { cellWidth: 60 },
      },
    });

    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 6 : 220;

    // Projected Monthly Return Summary Box
    doc.setFillColor(240, 253, 244); // Light green
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(margin, finalY, contentWidth, 20, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(22, 101, 52);
    doc.text("Estimated Monthly Profitability & Payback Outlook:", margin + 8, finalY + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(21, 128, 61);
    doc.text(
      `Projected Revenue: ${formatRupees(financials.estimatedMonthlyRevenue || Math.round(totalInvestment * 0.35))}/mo   •   Est. Net Profit: ${formatRupees(financials.estimatedMonthlyProfit || Math.round(totalInvestment * 0.08))}/mo   •   Payback Period: ~${financials.breakevenMonths || 8} Months`,
      margin + 8,
      finalY + 14
    );
  }

  // =========================================================================
  // PAGE 5 — SCHEME DETAILS
  // =========================================================================
  {
    doc.addPage();
    drawPageHeaderFooter(doc, "Government Schemes", 5, 7);

    // Section Heading (Heading font size: 14pt)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("Government Schemes & Subsidies", margin, 27);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Tailored central and state financial schemes evaluated for ${user.category} in ${user.state}.`,
      margin,
      34
    );

    // Prepare schemes table data
    const schemesData = schemes.slice(0, 5).map((sch) => {
      const subsidy = sch.subsidy_percent_rural
        ? `${sch.subsidy_percent_rural}% Subsidy`
        : "Interest Subvention";
      const maxCap = sch.max_loan_display || (sch.max_loan ? formatRupees(sch.max_loan) : "Up to ₹10 Lakhs");
      const link = sch.application_url || sch.url || "https://www.myscheme.gov.in";

      return [
        sch.name || "Government MSME Scheme",
        `${subsidy}\n(Cap: ${maxCap})`,
        sch.interest_rate ? `${sch.interest_rate}\nTenure: ${sch.tenure_years || "3-7"} Yrs` : "Concessional\n3-5 Yrs",
        sch.eligibility?.criteria?.[0] || sch.description?.substring(0, 80) + "..." || "Rural entrepreneurs establishing new micro-enterprises.",
        link,
      ];
    });

    // Fallback if no schemes provided
    if (schemesData.length === 0) {
      schemesData.push(
        [
          "Prime Minister's Employment Generation Programme (PMEGP)",
          "Up to 35% Subsidy\n(Cap: Rs. 50 Lakhs)",
          "8.5% - 11.5%\nTenure: 3 - 7 Yrs",
          "For new rural micro-enterprises. Margin money routed via KVIC.",
          "https://www.kviconline.gov.in/pmegpeportal/",
        ],
        [
          "Pradhan Mantri MUDRA Yojana (PMMY)",
          "Collateral-Free\n(Tarun: Rs. 10 Lakhs)",
          "9.0% - 12.0%\nTenure: Up to 5 Yrs",
          "Micro-business loans with no collateral requirements across commercial banks.",
          "https://www.mudra.org.in/",
        ],
        [
          "PM Formalisation of Micro food processing Enterprises (PMFME)",
          "35% Credit-linked\n(Cap: Rs. 10 Lakhs)",
          "Standard MSME\nTenure: 3 - 5 Yrs",
          "Capital subsidy for micro food processing units, self-help groups and FPOs.",
          "https://pmfme.mofpi.gov.in/",
        ]
      );
    }

    autoTable(doc, {
      startY: 42,
      margin: { left: margin, right: margin },
      head: [["Scheme Name", "Subsidy / Ceiling", "Interest & Terms", "Eligibility & Fit", "Application Portal Link"]],
      body: schemesData,
      theme: "grid",
      headStyles: {
        fillColor: [255, 153, 51], // Saffron header
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // Alternating row color
      },
      styles: {
        fontSize: 8.5,
        cellPadding: 4,
        textColor: [51, 65, 85],
        valign: "middle",
      },
      columnStyles: {
        0: { cellWidth: 42, fontStyle: "bold" },
        1: { cellWidth: 30 },
        2: { cellWidth: 28 },
        3: { cellWidth: 38 },
        4: { cellWidth: 32, textColor: [37, 99, 235] },
      },
    });

    const afterSchemesY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 190;

    // How to Apply Advisory Note Box
    doc.setFillColor(255, 251, 235);
    doc.setDrawColor(254, 215, 170);
    doc.roundedRect(margin, afterSchemesY, contentWidth, 38, 3, 3, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(194, 65, 12);
    doc.text("Official Application Guidelines & Important Checklist:", margin + 8, afterSchemesY + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(124, 45, 18);
    const guidelines = [
      "1. Free Online Registration: Submit applications only on official government domains (.gov.in / .nic.in).",
      "2. Mandatory Documents: Aadhaar Card, PAN Card, Passport Photos, Proof of Address, and Land / Rent Agreement.",
      "3. Detailed Project Report (DPR): Use this feasibility report and the financial plan from Page 4 for bank submission.",
      "4. DIC Assistance: Visit your local District Industries Centre (DIC) for physical document vetting before final submission.",
    ];

    let guideY = afterSchemesY + 15;
    guidelines.forEach((line) => {
      doc.text(line, margin + 8, guideY);
      guideY += 5;
    });
  }

  // =========================================================================
  // PAGE 6 — ROADMAP
  // =========================================================================
  {
    doc.addPage();
    drawPageHeaderFooter(doc, "Implementation Roadmap", 6, 7);

    // Section Heading (Heading font size: 14pt)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("Month-by-Month Implementation Roadmap", margin, 27);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(
      "Structured 6-month operational deployment plan from registration to full-scale operations.",
      margin,
      34
    );

    // Month-by-month table data
    const roadmapRows = [
      [
        "Month 1-2",
        "Registration & Scheme Linkage",
        "• Apply for free Udyam MSME certificate at udyamregistration.gov.in.\n• Open dedicated firm Current Account in public sector or regional rural bank.\n• Apply for matched government subsidy scheme (PMEGP / Mudra) with project DPR.\n• Obtain Gram Panchayat NOC and Trade License (or FSSAI for food units).",
        "Rs. 3,000 - Rs. 8,000\n(Documentation & NOCs)",
      ],
      [
        "Month 3",
        "Site Setup & Machinery Procurement",
        "• Finalize lease or space renovation in your village / commercial location.\n• Inspect, purchase and install ISI-certified machinery from reputable dealers.\n• Secure commercial electricity connection (single-phase or 3-phase load).\n• Finalize initial terms with 2 verified local raw material suppliers.",
        "50% - 60% of Outlay\n(Machinery & Fixtures)",
      ],
      [
        "Month 4",
        "Trial Run & Quality Testing",
        "• Conduct trial processing runs under partial electrical load.\n• Calibrate machinery output for optimal yield and minimal waste.\n• Train workshop helpers or family operators on safety protocols.\n• Distribute test samples to local villagers and kirana stores for feedback.",
        "10% of Outlay\n(Test Inventory & Power)",
      ],
      [
        "Month 5",
        "Commercial Soft Launch & Marketing",
        "• Inaugurate enterprise operations with village announcement or WhatsApp outreach.\n• Erect clean storefront signage and display clear product price lists.\n• Offer introductory discount rates to first 100 regular customers.\n• Establish wholesale supply links with local retailers across neighbouring blocks.",
        "15% of Outlay\n(Working Capital & Promo)",
      ],
      [
        "Month 6+",
        "Full Scale Operations & Payback",
        "• Reach 80%+ daily capacity utilization and stable operational routine.\n• Implement weekly cashbook recording to monitor margins and avoid credit losses.\n• Begin disciplined monthly EMI repayments through bank auto-debit.\n• Explore product diversification and regional distribution tie-ups.",
        "Self-Sustaining\n(Operational Cashflow)",
      ],
    ];

    autoTable(doc, {
      startY: 42,
      margin: { left: margin, right: margin },
      head: [["Timeline", "Phased Objective", "Key Action Steps & Deliverables", "Budget Focus"]],
      body: roadmapRows,
      theme: "grid",
      headStyles: {
        fillColor: [255, 153, 51], // Saffron header
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9.5,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // Alternating row color
      },
      styles: {
        fontSize: 8.5,
        cellPadding: 4,
        textColor: [51, 65, 85],
        valign: "top",
      },
      columnStyles: {
        0: { cellWidth: 26, fontStyle: "bold", textColor: [227, 100, 20] },
        1: { cellWidth: 38, fontStyle: "bold" },
        2: { cellWidth: 76 },
        3: { cellWidth: 30, halign: "center" },
      },
    });

    const afterRoadmapY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 8 : 220;

    // Critical Milestone Success Rule
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(margin, afterRoadmapY, contentWidth, 18, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(22, 101, 52);
    doc.text("Golden Operational Rule for Rural Entrepreneurs:", margin + 6, afterRoadmapY + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(21, 128, 61);
    doc.text(
      "Never extend unmonitored customer credit (udhaar) during the first 6 months. Maintain cash-first sales to safeguard working liquidity.",
      margin + 6,
      afterRoadmapY + 13
    );
  }

  // =========================================================================
  // PAGE 7 — DISCLAIMER
  // =========================================================================
  {
    doc.addPage();
    drawPageHeaderFooter(doc, "Legal & Regulatory Disclaimer", 7, 7);

    // Section Heading (Heading font size: 14pt)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("Legal & Regulatory Disclaimer", margin, 27);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Mandatory advisory disclosures, statutory notices, and guidance.", margin, 34);

    // Big Advisory Warning Box
    const boxY = 42;
    const boxHeight = 115;
    doc.setFillColor(255, 250, 245); // Subtle warm saffron tint
    doc.setDrawColor(255, 153, 51);
    doc.setLineWidth(0.8);
    doc.roundedRect(margin, boxY, contentWidth, boxHeight, 4, 4, "FD");

    // Header inside disclaimer box
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(194, 65, 12);
    doc.text("IMPORTANT NOTICE & STATUTORY DECLARATIONS", margin + 8, boxY + 12);

    doc.setDrawColor(254, 215, 170);
    doc.setLineWidth(0.4);
    doc.line(margin + 8, boxY + 16, pageWidth - margin - 8, boxY + 16);

    // The 4 mandatory disclaimer statements required by USER_REQUEST
    const disclaimerClauses = [
      {
        num: "1.",
        text: "This report is generated by an AI-powered advisory tool for informational purposes only.",
      },
      {
        num: "2.",
        text: "It does not constitute financial or legal advice.",
      },
      {
        num: "3.",
        text: "Please consult your local District Industries Centre (DIC), bank, or qualified financial advisor before making any investment decisions.",
      },
      {
        num: "4.",
        text: "Government scheme details are subject to change. Verify current terms on official websites.",
      },
    ];

    let clauseY = boxY + 26;
    disclaimerClauses.forEach((item) => {
      // Saffron badge
      doc.setFillColor(255, 153, 51);
      doc.circle(margin + 12, clauseY - 1.5, 3, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(item.num, margin + 10.8, clauseY - 0.2);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10); // Body font size: 10pt
      doc.setTextColor(30, 41, 59);
      const wrappedText = doc.splitTextToSize(item.text, contentWidth - 28);
      doc.text(wrappedText, margin + 20, clauseY);

      clauseY += Math.max(16, wrappedText.length * 5.5 + 8);
    });

    // District Industries Centre (DIC) Assistance Card
    const dicY = boxY + boxHeight + 12;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, dicY, contentWidth, 38, 3, 3, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    doc.text("Where to get official assistance in your district:", margin + 8, dicY + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const dicInfo = [
      `• District Industries Centre (DIC): Located at District Headquarters in ${user.district}, ${user.state}.`,
      `• Lead District Bank (LDB) & RSETI: Offers free rural entrepreneurship training and credit facilitation.`,
      `• Official MSME Portal: Verify all scheme guidelines directly at msme.gov.in and myScheme.gov.in.`,
    ];
    let dy = dicY + 16;
    dicInfo.forEach((line) => {
      doc.text(line, margin + 8, dy);
      dy += 6;
    });

    // Report Dossier Sign-Off Section
    const signY = dicY + 46;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.4);
    doc.line(margin, signY, pageWidth - margin, signY);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Report Dossier Reference: PS-REP-${Date.now().toString().slice(-6)}`, margin, signY + 8);
    doc.text(`Generated for: ${user.fullName} (${user.village})`, margin, signY + 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated on ${currentDate} • PragatiSahayak Advisory Engine v2.4`, pageWidth - margin, signY + 8, {
      align: "right",
    });
    doc.text("Official Portal: pragatisahayak.org", pageWidth - margin, signY + 14, {
      align: "right",
    });
  }

  // =========================================================================
  // FILE SAVE & AUTO-DOWNLOAD
  // =========================================================================
  // Sanitize user name for file name
  const safeName = (user.fullName || "Entrepreneur").trim().replace(/[^a-zA-Z0-9]/g, "_");
  const dateStr = new Date().toISOString().split("T")[0];
  const fileName = `PragatiSahayak_Report_${safeName}_${dateStr}.pdf`;

  // Auto-download when ready
  doc.save(fileName);

  return fileName;
}
