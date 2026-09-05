import { calculateViabilityScore } from "@/services/viabilityScorer";
import { matchSchemes } from "@/services/schemeMatcher";
import { calculateLoanDetails } from "@/services/loanCalculator";
import { CATEGORIES, getCategoryByName, getCategoryById } from "@/data/categories";
import { getBlockMeta, getVillageMeta, getVillages } from "@/data/locations";
import { getCompetitors, countCompetitors } from "@/data/competitors";
import type { FormData } from "@/context/AppContext";
import type {
  Category,
  Competitor,
  LocationMeta,
  MatchedScheme,
  LoanCalculation,
} from "@/types/business";

export type ViabilityScoreColor = {
  stroke: string;
  fill: string;
  text: string;
  bgLight: string;
  borderLight: string;
};

export function getScoreColor(score: number): ViabilityScoreColor {
  if (score <= 30) {
    return {
      stroke: "#ef4444",
      fill: "#ef4444",
      text: "text-red-600 dark:text-red-400",
      bgLight: "bg-red-500/10",
      borderLight: "border-red-500/30",
    };
  }
  if (score <= 50) {
    return {
      stroke: "#f97316",
      fill: "#f97316",
      text: "text-orange-600 dark:text-orange-400",
      bgLight: "bg-orange-500/10",
      borderLight: "border-orange-500/30",
    };
  }
  if (score <= 70) {
    return {
      stroke: "#eab308",
      fill: "#eab308",
      text: "text-amber-600 dark:text-amber-400",
      bgLight: "bg-amber-500/10",
      borderLight: "border-amber-500/30",
    };
  }
  if (score <= 85) {
    return {
      stroke: "#22c55e",
      fill: "#22c55e",
      text: "text-green-600 dark:text-green-400",
      bgLight: "bg-emerald-500/10",
      borderLight: "border-emerald-500/30",
    };
  }
  return {
    stroke: "#15803d",
    fill: "#15803d",
    text: "text-emerald-700 dark:text-emerald-300",
    bgLight: "bg-emerald-600/15",
    borderLight: "border-emerald-600/40",
  };
}

export type SwotItem = {
  point: string;
  why: string;
};

export type FullResultsData = {
  formData: FormData;
  category: Category;
  blockMeta: LocationMeta;
  competitors: Competitor[];
  competitorCount: number;
  competitorDensity: {
    label: string;
    level: "Low" | "Medium" | "High";
    badgeClass: string;
  };
  competitorSummary: string;
  totalScore: number;
  scoreLabel: string;
  scoreColor: ViabilityScoreColor;
  confidence: {
    level: "High" | "Medium" | "Low";
    colorClass: string;
    tooltip: string;
  };
  summary: string;
  breakdown: {
    demand: number;
    competition: number;
    capital: number;
    infrastructure: number;
    risk: number;
  };
  marketAnalysis: {
    targetCustomers: number;
    rawMaterialAvailability: {
      level: "High" | "Medium" | "Low";
      color: string;
      reason: string;
    };
    infrastructureReadiness: {
      level: "High" | "Medium" | "Low";
      color: string;
      reason: string;
    };
    seasonalDemandFactor: {
      title: string;
      description: string;
    };
    explanation: string;
    demandLevel: "high" | "moderate" | "low";
    chartData: { name: string; score: number; fullMark: number }[];
  };
  swot: {
    strengths: SwotItem[];
    weaknesses: SwotItem[];
    opportunities: SwotItem[];
    threats: SwotItem[];
  };
  matchedSchemes: MatchedScheme[];
  loanDetails: LoanCalculation;
  financials: {
    avgInvestment: number;
    marginPercent: number;
    breakevenMonths: number;
    estimatedMonthlyRevenue: number;
    estimatedMonthlyProfit: number;
    capexBreakdown: { item: string; amount: number; percentage: number }[];
  };
  threatsDetailed: {
    name: string;
    risk: string;
    severity: "High" | "Medium" | "Low";
    description: string;
    impact: string;
    mitigation: string;
  }[];
  roadmap: {
    step: number;
    title: string;
    duration: string;
    action: string;
    status: "Upcoming" | "Ready";
  }[];
  alternatives: {
    category: Category;
    viabilityScore: number;
    scoreLabel: string;
    investmentRange: string;
    whyConsider: string;
  }[];
  isLocationEstimated: boolean;
  isCapitalExceedingInvestment: boolean;
  estimatedInvestment: number;
};

export const DEFAULT_FALLBACK_FORM_DATA: FormData = {
  fullName: "Ramesh Kumar",
  language: "English",
  state: "Uttar Pradesh",
  district: "Lucknow",
  block: "Malihabad",
  village: "Rasoolpur",
  category: "Flour Mill",
  capital: 60000,
};

export function computeFullResults(inputData?: Partial<FormData> | null): FullResultsData {
  const safeInput = inputData || {};
  const formData: FormData = {
    fullName: safeInput.fullName?.trim() || DEFAULT_FALLBACK_FORM_DATA.fullName,
    language: safeInput.language || DEFAULT_FALLBACK_FORM_DATA.language,
    state: safeInput.state || DEFAULT_FALLBACK_FORM_DATA.state,
    district: safeInput.district || DEFAULT_FALLBACK_FORM_DATA.district,
    block: safeInput.block || DEFAULT_FALLBACK_FORM_DATA.block,
    village: safeInput.village?.trim() || DEFAULT_FALLBACK_FORM_DATA.village,
    category: safeInput.category || DEFAULT_FALLBACK_FORM_DATA.category,
    capital:
      safeInput.capital !== undefined && !Number.isNaN(Number(safeInput.capital)) && Number(safeInput.capital) >= 0
        ? Number(safeInput.capital)
        : DEFAULT_FALLBACK_FORM_DATA.capital,
  };

  const rawCategories = CATEGORIES as unknown as Category[];
  const defaultCat = rawCategories[0] as Category;
  const category: Category =
    (getCategoryByName(formData.category) as Category | null) ||
    (getCategoryById((formData.category || "").toLowerCase().replace(/\s+/g, "_")) as Category | null) ||
    defaultCat;

  const rawMeta = getBlockMeta(
    formData.state,
    formData.district,
    formData.block,
  ) as LocationMeta | null;
  const villageMeta = getVillageMeta(
    formData.state,
    formData.district,
    formData.block,
    formData.village,
  ) as LocationMeta | null;
  const blockMeta: LocationMeta = {
    population: villageMeta?.population ?? rawMeta?.population ?? 4500,
    literacy_rate: villageMeta?.literacy_rate ?? rawMeta?.literacy_rate ?? 65,
    primary_occupation:
      villageMeta?.primary_occupation ?? rawMeta?.primary_occupation ?? "Agriculture",
    nearest_city_km: villageMeta?.nearest_city_km ?? rawMeta?.nearest_city_km ?? 25,
  };

  const rawCompetitors = getCompetitors({
    state: formData.state,
    district: formData.district,
    block: formData.block,
    categoryId: category.id,
  }) as Competitor[];
  const competitors: Competitor[] = rawCompetitors || [];
  const competitorCount = competitors.length;

  // Competitor Density calculation
  const competitorDensityLevel: "Low" | "Medium" | "High" =
    competitorCount <= 2 ? "Low" : competitorCount <= 4 ? "Medium" : "High";

  const competitorDensityLabel =
    competitorCount === 0
      ? "Low (0 nearby)"
      : competitorCount <= 2
        ? `Low (${competitorCount} nearby)`
        : competitorCount <= 4
          ? `Medium (${competitorCount} nearby)`
          : `High (${competitorCount} nearby)`;

  const competitorDensityBadgeClass =
    competitorDensityLevel === "Low"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
      : competitorDensityLevel === "Medium"
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
        : "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30";

  const maxDist =
    competitors.length > 0
      ? Math.max(...competitors.map((c) => c.distance_km || 3))
      : 8;

  const competitorSummary =
    competitorCount === 0
      ? `Having 0 competitors within ${formData.block} means you have a completely open local market with zero direct saturation. This gives you a clear first-mover advantage to build deep customer trust and capture household loyalty.`
      : competitorCount === 1
        ? `Having 1 competitor within ${maxDist} km means the local market has proven customer demand, with plenty of room for your new business to thrive by providing faster service, fair prices, and clean premises.`
        : competitorCount === 2
          ? `Having 2 competitors within ${maxDist} km means healthy community demand without market saturation. You can easily stand out from existing shops through digital payment options, reliable hours, and friendly customer care.`
          : `Having ${competitorCount} competitors within ${maxDist} km means moderate market saturation. To win customers, focus on distinctive advantages like free home delivery, superior product hygiene, and WhatsApp ordering.`;

  const viability = calculateViabilityScore({
    blockMeta,
    category,
    capital: formData.capital,
    competitorCount,
  });

  const totalScore: number = viability.totalScore;
  const scoreLabel: string = viability.label;
  const scoreColor = getScoreColor(totalScore);

  // Location check: is specific village found in verified dataset?
  const villageList = getVillages(formData.state, formData.district, formData.block);
  const isVillageFound = villageList.some(
    (v: any) => v.name?.toLowerCase() === (formData.village || "").trim().toLowerCase()
  );
  const isLocationEstimated = Boolean(formData.village && !isVillageFound);

  // Confidence calculation
  const hasExactBlock = Boolean(rawMeta);
  const hasCompetitorData = competitors.length >= 0;
  const confidenceLevel: "High" | "Medium" | "Low" =
    isLocationEstimated
      ? "Low"
      : hasExactBlock && hasCompetitorData
        ? "High"
        : hasExactBlock
          ? "Medium"
          : "Low";

  const confidenceColorClass =
    confidenceLevel === "High"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
      : confidenceLevel === "Medium"
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
        : "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30";

  const confidence = {
    level: confidenceLevel,
    colorClass: confidenceColorClass,
    tooltip: isLocationEstimated
      ? `Limited local data available for ${formData.village || "your village"}. Derived from ${formData.district || "district"} baseline.`
      : `Based on verified data availability for ${formData.village || "your village"} and ${formData.block} block census records`,
  };

  const estimatedInvestment = category.min_investment || 100000;
  const isCapitalExceedingInvestment = formData.capital > estimatedInvestment;

  const summary = `A ${category.name} in ${formData.village || "your village"}, ${formData.block} has ${scoreLabel.toLowerCase()} potential based on local market conditions.`;

  // Market Analysis metrics
  const targetCustomers = Math.round(blockMeta.population * 0.3);

  const rawMaterialAvailability = (() => {
    if (
      category.sector === "Agriculture" ||
      category.id === "flour_mill" ||
      category.id === "oil_mill"
    ) {
      return blockMeta.primary_occupation === "Agriculture"
        ? {
            level: "High" as const,
            color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
            reason: "Direct access to farm harvest & local produce",
          }
        : {
            level: "Medium" as const,
            color: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
            reason: "Moderate local supply, accessible via wholesale mandi",
          };
    }
    if (category.sector === "Service") {
      return {
        level: "High" as const,
        color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
        reason: "Service-driven model requiring minimal bulk materials",
      };
    }
    if (blockMeta.nearest_city_km <= 20) {
      return {
        level: "High" as const,
        color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
        reason: `Proximity to district market (${blockMeta.nearest_city_km} km)`,
      };
    }
    return {
      level: "Medium" as const,
      color: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
      reason: `Transit required from nearest city (${blockMeta.nearest_city_km} km)`,
    };
  })();

  const infrastructureReadiness = (() => {
    if (blockMeta.nearest_city_km <= 15) {
      return {
        level: "High" as const,
        color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
        reason: `Excellent road connectivity (${blockMeta.nearest_city_km} km to city hub)`,
      };
    }
    if (blockMeta.nearest_city_km <= 30) {
      return {
        level: "Medium" as const,
        color: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
        reason: `Moderate transit distance (${blockMeta.nearest_city_km} km), motorable access`,
      };
    }
    return {
      level: "Low" as const,
      color: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
      reason: `Remote location (${blockMeta.nearest_city_km} km to urban supply chain)`,
    };
  })();

  const seasonalDemandFactor = (() => {
    if (category.id === "flour_mill") {
      return {
        title: "Post-Harvest Surge (Apr-Jun & Oct-Dec)",
        description:
          "Year-round steady staple demand with peak milling volume following wheat and paddy harvests.",
      };
    }
    if (category.id === "dairy_farm") {
      return {
        title: "Winter Peak / Summer Lean",
        description:
          "Milk production peaks during winter months. Festival seasons (Diwali, Holi, Eid) generate 40%+ spike in demand.",
      };
    }
    if (category.id === "poultry_farm") {
      return {
        title: "Winter High / Summer Dipping",
        description:
          "Broiler and egg demand remains high through autumn/winter; festival and wedding seasons accelerate bulk orders.",
      };
    }
    if (category.id === "brick_kiln") {
      return {
        title: "Strictly Dry Season (Oct - May)",
        description:
          "Operations pause during monsoon months (Jun-Sep). Peak manufacturing & construction dispatch occurs in spring.",
      };
    }
    if (category.id === "agarbatti_making" || category.id === "papad_making") {
      return {
        title: "Festival & Wedding Season Spikes",
        description:
          "Consistent base consumption with 50-70% volume uplift during festive quarters (Aug-Nov).",
      };
    }
    return {
      title: "Consistent Year-Round Demand",
      description:
        "Essential community need with moderate spikes during marriage seasons and local village haat days.",
    };
  })();

  const demandLevel: "high" | "moderate" | "low" =
    viability.breakdown.demand >= 75
      ? "high"
      : viability.breakdown.demand >= 50
        ? "moderate"
        : "low";

  const demandExplanation = `The demand for ${category.name} in ${formData.village || "this village"} is ${demandLevel} BECAUSE the village has an estimated consumer catchment of ${targetCustomers.toLocaleString("en-IN")} residents, an active ${blockMeta.primary_occupation.toLowerCase()} economic base, and ${
    competitorCount === 0
      ? "zero direct registered competitors operating in this immediate block"
      : `only ${competitorCount} existing competitor(s) in ${formData.block}`
  }. Furthermore, proximity to the nearest economic center (${blockMeta.nearest_city_km} km) ensures reliable supply chain replenishment.`;

  const demandChartData = [
    {
      name: "Population Catchment",
      score: Math.round(Math.min(100, (blockMeta.population / 8000) * 100)),
      fullMark: 100,
    },
    { name: "Occupation Synergy", score: viability.breakdown.demand, fullMark: 100 },
    { name: "Market Gap (Low Saturation)", score: viability.breakdown.competition, fullMark: 100 },
    { name: "Capital Sufficiency", score: viability.breakdown.capital, fullMark: 100 },
    { name: "Infra Connectivity", score: viability.breakdown.infrastructure, fullMark: 100 },
  ];

  // Dynamic SWOT generation
  const swotStrengths: SwotItem[] = [
    {
      point:
        competitorCount <= 1
          ? "Unsaturated local market with negligible competition"
          : "Established consumer habit for this category in the block",
      why: `Only ${competitorCount} direct competitor(s) recorded in ${formData.block}, leaving substantial unmet demand for new quality providers.`,
    },
    {
      point: `High potential customer base of ~${targetCustomers.toLocaleString("en-IN")} local residents`,
      why: `Calculated from ${formData.block}'s recorded population of ${blockMeta.population.toLocaleString("en-IN")} in the demographic census.`,
    },
    {
      point: `Attractive average profit margin of ${category.avg_margin_percent}%`,
      why: `Micro enterprise benchmarks for ${category.name} show healthy operating margins of ${category.avg_margin_percent}%.`,
    },
    {
      point: `Strong synergy with ${blockMeta.primary_occupation.toLowerCase()} community lifestyle`,
      why: `The primary livelihood in ${formData.block} aligns directly with consumption and raw material sourcing for ${category.name}.`,
    },
  ];

  const swotWeaknesses: SwotItem[] = [
    {
      point:
        (Number(formData?.capital) || 0) < (Number(category?.min_investment) || 100000)
          ? "Margin capital is below recommended baseline"
          : "Working capital buffer needs careful management",
      why: `Recommended minimum project cost is ₹${(Number(category?.min_investment) || 100000).toLocaleString("en-IN")}, while your available margin is ₹${(Number(formData?.capital) || 0).toLocaleString("en-IN")}.`,
    },
    {
      point:
        blockMeta.literacy_rate < 65
          ? "Lower local literacy may require traditional cash & relationship sales"
          : "Local digital payment adoption is still maturing",
      why: `Census data indicates a ${blockMeta.literacy_rate}% literacy rate in ${formData.block}, favoring personal trust and local dealer credit over app-only marketing.`,
    },
    {
      point:
        blockMeta.nearest_city_km > 20
          ? `Logistical distance of ${blockMeta.nearest_city_km} km to district wholesale hub`
          : "Local spare parts and machine maintenance depend on district city",
      why: `Sourcing replacement machinery components or specialized raw supplies requires transit to the nearest city hub ${blockMeta.nearest_city_km} km away.`,
    },
    {
      point: `Breakeven timeline estimated at ${category.breakeven_months} months`,
      why: `Historical recovery time for a rural ${category.name} unit averages ${category.breakeven_months} months before generating net owner draw.`,
    },
  ];

  const swotOpportunities: SwotItem[] = [
    {
      point: "Eligible for 25% - 35% capital subsidy under Central Government schemes",
      why: "Schemes like PMEGP and PMFME offer substantial credit-linked subsidies for rural micro-units in this sector.",
    },
    {
      point: "Expansion to nearby weekly haats, gram panchayats, and bulk institutional buyers",
      why: `Surrounding villages in ${formData.district} district can be serviced as distribution and brand footprint expand.`,
    },
    {
      point: "Value addition, branded packaging, and UPI-enabled doorstep delivery",
      why: "Modern hygienic packaging and direct delivery allow charging a 10-15% premium over unorganized loose sellers.",
    },
    {
      point: "Formalization opens up collateral-free Mudra credit up to ₹10-20 Lakhs",
      why: "Operating an Udyam-registered enterprise unlocks zero-collateral credit guarantees via CGTMSE and Mudra portals.",
    },
  ];

  const swotThreats: SwotItem[] = [
    {
      point: "Seasonal fluctuations during monsoon or lean agricultural periods",
      why: seasonalDemandFactor.description,
    },
    {
      point: "Fluctuations in electricity supply and power tariffs",
      why: "Commercial rural feeders occasionally experience load shedding, which may require inverter or generator backup investments.",
    },
    {
      point: "Raw material procurement price spikes from wholesalers",
      why: "Unfavorable crop yield seasons or transport strikes can temporarily squeeze gross margins by 3-5%.",
    },
    {
      point: "Informal credit requests (udhaar) from village acquaintances",
      why: "Rural customer credit cycles can delay cash flow if strict credit limits and payment schedules are not enforced.",
    },
  ];

  // Matched Government Schemes
  const matchedSchemes =
    (matchSchemes({
      sector: category.sector,
      projectCost: Math.max(category.min_investment, formData.capital * 4),
      capital: formData.capital,
      categoryId: category.id,
      categoryName: category.name,
      socialCategory: "General",
      gender: "Male",
      isRural: true,
      age: 30,
    }) as MatchedScheme[]) || [];

  // Top scheme subsidy percent for loan math
  const topEligibleScheme = matchedSchemes.find((s: MatchedScheme) => s.eligible);
  const bestSubsidyPercent = topEligibleScheme?.subsidyPercentApplied || 0;
  const projectCost = Math.max(category.min_investment, formData.capital * 3.5);

  const loanDetails = calculateLoanDetails({
    projectCost,
    ownCapital: formData.capital,
    subsidyPercent: bestSubsidyPercent,
    annualRate: 10.5,
    months: 60,
  }) as LoanCalculation;

  // Financials & Breakeven
  const estimatedMonthlyRevenue = Math.round((projectCost * 0.28) / 1000) * 1000;
  const estimatedMonthlyProfit =
    Math.round((estimatedMonthlyRevenue * (category.avg_margin_percent / 100)) / 100) * 100;

  const capexBreakdown = [
    {
      item: "Machinery & Core Equipment",
      amount: Math.round(projectCost * 0.55),
      percentage: 55,
    },
    {
      item: "Initial Raw Material & Inventory",
      amount: Math.round(projectCost * 0.2),
      percentage: 20,
    },
    {
      item: "Shed / Shop Renovation & Electricals",
      amount: Math.round(projectCost * 0.15),
      percentage: 15,
    },
    {
      item: "Working Capital Reserve & Licenses",
      amount: Math.round(projectCost * 0.1),
      percentage: 10,
    },
  ];

  const financials = {
    avgInvestment: projectCost,
    marginPercent: category.avg_margin_percent,
    breakevenMonths: category.breakeven_months,
    estimatedMonthlyRevenue,
    estimatedMonthlyProfit,
    capexBreakdown,
  };

  // Rule-based Dynamic Threats generation (4 to 6 cards)
  const threatsDetailed: {
    name: string;
    risk: string;
    severity: "High" | "Medium" | "Low";
    description: string;
    impact: string;
    mitigation: string;
  }[] = [];

  // 1. If nearest_city > 25km → Supply chain disruption risk
  if (blockMeta.nearest_city_km > 25) {
    threatsDetailed.push({
      name: "Supply chain disruption risk",
      risk: "Supply chain disruption risk",
      severity: blockMeta.nearest_city_km > 35 ? "High" : "Medium",
      description: `Your village is ${blockMeta.nearest_city_km} km away from the nearest city wholesale hub. Transport delays, road repairs, or monsoon weather can slow down deliveries of raw materials and machine spare parts.`,
      impact: "Temporary stock shortages or longer machine breakdown times during peak customer demand.",
      mitigation: "Maintain a 15–20 day emergency buffer of key raw materials and partner with 2 local transport or wholesale drivers.",
    });
  }

  // 2. If literacy < 50% → Skilled labor shortage (or < 65% digital adoption barrier)
  if (blockMeta.literacy_rate < 50) {
    threatsDetailed.push({
      name: "Skilled labor shortage",
      risk: "Skilled labor shortage",
      severity: "High",
      description: `With local literacy at ${blockMeta.literacy_rate}%, finding workers who can operate technical machinery, read invoices, or manage digital billing without constant supervision is challenging.`,
      impact: "Higher reliance on the business owner for everyday basic shop management and record keeping.",
      mitigation: "Use color-coded machine switches, install a voice-enabled UPI soundbox for payment confirmation, and provide simple visual step-by-step training.",
    });
  } else if (blockMeta.literacy_rate < 65) {
    threatsDetailed.push({
      name: "Digital payment & record-keeping adoption barrier",
      risk: "Digital payment & record-keeping adoption barrier",
      severity: "Medium",
      description: `Moderate local literacy (${blockMeta.literacy_rate}%) means many village customers still prefer informal verbal trust and cash over digital payment apps.`,
      impact: "Cash handling overhead and reliance on manual notebook bookkeeping.",
      mitigation: "Keep an audio soundbox for UPI receipts and maintain a simple mobile Khata app to track cash and digital transactions cleanly.",
    });
  }

  // 3. If primary_occupation = "Agriculture" → Seasonal income fluctuation
  if (blockMeta.primary_occupation === "Agriculture") {
    threatsDetailed.push({
      name: "Seasonal income fluctuation affecting customer purchasing power",
      risk: "Seasonal income fluctuation affecting customer purchasing power",
      severity: "Medium",
      description: "Most households in your area depend on farm harvests, meaning customer spending surges post-harvest (April–May and Oct–Nov) and tightens during sowing and monsoon months.",
      impact: "Uneven monthly cash flow with slower revenue during off-season agricultural months.",
      mitigation: "Save a working capital reserve during peak harvest months to cover fixed costs, and introduce smaller affordable pack sizes for lean months.",
    });
  }

  // 4. Category-specific threats
  if (category.id === "dairy_farm") {
    threatsDetailed.push({
      name: "Milk spoilage without cold chain",
      risk: "Milk spoilage without cold chain",
      severity: "High",
      description: "Fresh unchilled cow and buffalo milk turns sour within 3 to 4 hours in warm weather, creating immediate loss if collection or sale is delayed.",
      impact: "Spoiled batches leading to direct revenue loss and wasted cattle feed costs.",
      mitigation: "Sign a daily morning/evening collection contract with a village dairy cooperative (like Amul/Parag) and use insulated stainless-steel cans.",
    });
  } else if (category.id === "flour_mill") {
    threatsDetailed.push({
      name: "Power cuts & machine downtime",
      risk: "Power cuts & machine downtime",
      severity: "Medium",
      description: "Unscheduled rural power cuts can halt grinding motors right when village customers arrive with their grain sacks in the morning.",
      impact: "Delayed customer orders and lost milling charges to nearby diesel or solar chakki units.",
      mitigation: "Schedule heavy milling during designated rural 3-phase power supply hours and explore a dual single-phase converter or backup generator.",
    });
  } else if (category.id === "poultry_farm") {
    threatsDetailed.push({
      name: "Seasonal disease outbreaks & temperature stress",
      risk: "Seasonal disease outbreaks & temperature stress",
      severity: "High",
      description: "High summer heat and viral illnesses (such as Ranikhet or Bird Flu) can spread rapidly through crowded poultry sheds.",
      impact: "High chick mortality rates and sharp drop in daily egg or broiler weight gain.",
      mitigation: "Strictly follow the 45-day veterinarian vaccination schedule, maintain limestone-disinfected floors, and install thatch roof water sprinklers for summer cooling.",
    });
  } else if (category.id === "mobile_repair") {
    threatsDetailed.push({
      name: "Rapid spare parts obsolescence",
      risk: "Rapid spare parts obsolescence",
      severity: "Medium",
      description: "Smartphones evolve rapidly; buying expensive display screens and motherboards for specific phone models risks unsold dead stock as phone models get retired.",
      impact: "Tied-up cash in unsellable old phone spare parts.",
      mitigation: "Stock only universal high-turnover items (charging jacks, tempered glass, cables) and order expensive screens on-demand after taking a 50% customer advance.",
    });
  } else if (category.id === "grocery_store") {
    threatsDetailed.push({
      name: "Perishable stock expiry & uncollected customer credit (Udhaar)",
      risk: "Perishable stock expiry & uncollected customer credit (Udhaar)",
      severity: "High",
      description: "Unsold packaged food passing expiry dates and local customers taking goods on long credit without settling bills can drain your working capital.",
      impact: "Direct inventory loss and shortage of cash to buy fresh wholesale provisions.",
      mitigation: "Follow First-In, First-Out (FIFO) shelf rotation, cap individual credit at ₹500, and send polite automated SMS reminders using a mobile ledger app.",
    });
  } else if (category.id === "tailoring_unit") {
    threatsDetailed.push({
      name: "Post-festival seasonal order slump",
      risk: "Post-festival seasonal order slump",
      severity: "Medium",
      description: "Heavy rush during Diwali, Eid, and wedding seasons is often followed by very quiet months with minimal custom stitching orders.",
      impact: "Income drops during off-peak months while workshop rent and electric bills remain constant.",
      mitigation: "Secure school uniform and hospital/hotel linen stitching contracts to guarantee reliable baseline income during non-festive months.",
    });
  } else if (category.id === "oil_mill") {
    threatsDetailed.push({
      name: "Seed price volatility & oil rancidity risk",
      risk: "Seed price volatility & oil rancidity risk",
      severity: "Medium",
      description: "Mustard and groundnut seed prices fluctuate sharply across agricultural cycles, and unrefined cold-pressed oil can spoil if stored in warm humid conditions.",
      impact: "Margin compression when seed prices spike, and inventory waste if oil is unsold.",
      mitigation: "Buy raw seeds in bulk directly from farmers at harvest time when prices are low, and store filtered oil in airtight stainless-steel or food-grade drums.",
    });
  } else if (category.id === "agarbatti_making" || category.id === "papad_making") {
    threatsDetailed.push({
      name: "Monsoon humidity impeding natural drying",
      risk: "Monsoon humidity impeding natural drying",
      severity: "Medium",
      description: "Continuous monsoon rains and high moisture prevent sun-drying of raw sticks or dough, causing warping, breakage, or fungal mold.",
      impact: "Production halt for weeks during peak rainy months and damaged batches.",
      mitigation: "Set up an enclosed indoor drying room fitted with energy-efficient electric heat blowers and exhaust fans for July–September.",
    });
  } else if (category.id === "brick_kiln") {
    threatsDetailed.push({
      name: "Monsoon washouts & rising fuel costs",
      risk: "Monsoon washouts & rising fuel costs",
      severity: "High",
      description: "Heavy rains melt unbaked raw clay bricks back into sludge and coal/biomass fuel prices can spike unexpectedly.",
      impact: "Complete outdoor production shutdown for 3–4 months during the monsoon season.",
      mitigation: "Maximize brick production and kiln firing between November and May, store finished bricks on elevated beds, and cover stacks with heavy waterproof tarps.",
    });
  }

  // Universal Rural Business Threats (guaranteeing 4 to 6 robust cards)
  if (threatsDetailed.length < 5) {
    threatsDetailed.push({
      name: "Informal customer credit (Udhaar) trap",
      risk: "Informal customer credit (Udhaar) trap",
      severity: "High",
      description: "Villagers often expect purchases on trust to be paid at the end of the month. Too much outstanding credit drains your cash and stops you from buying fresh inventory.",
      impact: "Cash crunch that prevents timely restocking from wholesale mandis.",
      mitigation: "Set a hard limit of ₹500 credit per customer, offer a 2% instant cash/UPI discount, and record every transaction in a mobile Khata app.",
    });
  }

  if (threatsDetailed.length < 6) {
    threatsDetailed.push({
      name: "Copycat competitor undercutting prices",
      risk: "Copycat competitor undercutting prices",
      severity: "Low",
      description: "Seeing your business do well might motivate another local resident to start a similar venture nearby and offer temporary discounts.",
      impact: "Temporary division of customer footfall if products appear identical.",
      mitigation: "Build long-term customer loyalty through 100% accurate digital weight scales, superior cleanliness, friendly greetings, and free doorstep delivery.",
    });
  }

  if (threatsDetailed.length < 6) {
    threatsDetailed.push({
      name: "Machinery breakdown & local repair delays",
      risk: "Machinery breakdown & local repair delays",
      severity: "Medium",
      description: "Equipment failure can halt operations for days if village mechanics lack experience with your specific motor or electronic machine model.",
      impact: "Lost revenue during repair downtime and customer migration to other vendors.",
      mitigation: "Learn basic routine maintenance (belt tension, lubrication, fuse replacement) during machine installation and keep essential spare fuses and belts on hand.",
    });
  }

  const roadmap = [
    {
      step: 1,
      title: "Udyam & FSSAI Registration",
      duration: "Days 1 - 7",
      action:
        "Register free on Udyam portal with Aadhaar/PAN to obtain MSME certificate and apply for trade/FSSAI license.",
      status: "Ready" as const,
    },
    {
      step: 2,
      title: "Bank Account & PMEGP / Mudra Application",
      duration: "Days 8 - 20",
      action:
        "Open a Current Account and submit loan application via KVIC PMEGP or JanSamarth portal with the project report.",
      status: "Ready" as const,
    },
    {
      step: 3,
      title: "Site Preparation & Electrical Setup",
      duration: "Days 21 - 35",
      action:
        "Secure shop/shed lease, complete concrete machine foundation, and obtain necessary power sanction.",
      status: "Upcoming" as const,
    },
    {
      step: 4,
      title: "Machinery Sourcing & Installation",
      duration: "Days 36 - 50",
      action:
        "Order verified ISI-certified machinery from authorized district dealers; execute test runs and trial production.",
      status: "Upcoming" as const,
    },
    {
      step: 5,
      title: "Raw Material Stocking & Staff Training",
      duration: "Days 51 - 60",
      action:
        "Procure first 30-day stock batch directly from farmers or wholesale mandi; calibrate digital scales.",
      status: "Upcoming" as const,
    },
    {
      step: 6,
      title: "Grand Launch & Village Promotion",
      duration: "Day 61 onwards",
      action:
        "Host village opening day with introductory sample discounts, distribute pamphlets, and launch WhatsApp ordering.",
      status: "Upcoming" as const,
    },
  ];

  // Alternative business ideas matching capital, demographic synergy, and location
  const otherCategories = rawCategories.filter((c: Category) => c.id !== category.id);
  const scoredAlternatives = otherCategories.map((alt: Category) => {
    const altCompetitorCount = countCompetitors(
      formData.state,
      formData.district,
      formData.block,
      alt.id,
    ) as number;
    const altViability = calculateViabilityScore({
      blockMeta,
      category: alt,
      capital: formData.capital,
      competitorCount: altCompetitorCount,
    });

    const whyFit = (() => {
      if (alt.id === "flour_mill") {
        return "BECAUSE every village household needs weekly grain grinding, ensuring constant daily cash flow with steady year-round local demand.";
      }
      if (alt.id === "dairy_farm") {
        return "BECAUSE your block has strong agricultural fodder support, and milk cooperatives (like Amul) offer guaranteed daily cash procurement.";
      }
      if (alt.id === "poultry_farm") {
        return "BECAUSE fast 40-day bird cycles deliver quick cash returns and high demand for fresh poultry at weekly village haats.";
      }
      if (alt.id === "mobile_repair") {
        return "BECAUSE rapid smartphone adoption across rural areas creates high 40% service profit margins with very low initial capital investment.";
      }
      if (alt.id === "grocery_store") {
        return "BECAUSE daily food staples and household provisions generate immediate, predictable daily cash income from neighboring families.";
      }
      if (alt.id === "tailoring_unit") {
        return "BECAUSE low machinery investment, zero perishable waste, and high recurring demand for custom clothing deliver strong 35% profit margins.";
      }
      if (alt.id === "oil_mill") {
        return "BECAUSE cold-pressed pure mustard and edible oils command a premium price among health-conscious village and town consumers.";
      }
      if (alt.id === "agarbatti_making") {
        return "BECAUSE low raw material costs and steady demand across local temples and homes allow flexible, high-margin production.";
      }
      if (alt.id === "papad_making") {
        return "BECAUSE minimal startup capital and strong local grocery/haat demand enable fast breakeven within just 7 months.";
      }
      if (alt.id === "brick_kiln") {
        return "BECAUSE rural housing growth under government schemes (PMAY) generates massive bulk purchase orders from local builders.";
      }
      return `BECAUSE it has strong demographic synergy with ${blockMeta.primary_occupation.toLowerCase()} communities and high profit potential.`;
    })();

    return {
      category: alt,
      viabilityScore: altViability.totalScore as number,
      scoreLabel: altViability.label as string,
      investmentRange: `₹${alt.min_investment.toLocaleString("en-IN")} - ₹${alt.max_investment.toLocaleString("en-IN")}`,
      whyConsider: whyFit,
    };
  });

  // Sort alternatives by viability score descending
  scoredAlternatives.sort((a, b) => b.viabilityScore - a.viabilityScore);

  // Pick alternatives that score higher than user's current choice when possible, or top 3 highest scoring
  const higherScoring = scoredAlternatives.filter((alt) => alt.viabilityScore >= totalScore);
  const alternatives =
    higherScoring.length >= 3
      ? higherScoring.slice(0, 3)
      : scoredAlternatives.slice(0, 3);

  return {
    formData,
    category,
    blockMeta,
    competitors,
    competitorCount,
    competitorDensity: {
      label: competitorDensityLabel,
      level: competitorDensityLevel,
      badgeClass: competitorDensityBadgeClass,
    },
    competitorSummary,
    totalScore,
    scoreLabel,
    scoreColor,
    confidence,
    summary,
    breakdown: viability.breakdown,
    marketAnalysis: {
      targetCustomers,
      rawMaterialAvailability,
      infrastructureReadiness,
      seasonalDemandFactor,
      explanation: demandExplanation,
      demandLevel,
      chartData: demandChartData,
    },
    swot: {
      strengths: swotStrengths,
      weaknesses: swotWeaknesses,
      opportunities: swotOpportunities,
      threats: swotThreats,
    },
    matchedSchemes,
    loanDetails,
    financials,
    threatsDetailed,
    roadmap,
    alternatives,
    isLocationEstimated,
    isCapitalExceedingInvestment,
    estimatedInvestment,
  };
}
