export interface Category {
  id: string;
  name: string;
  name_hi: string;
  sector: "Manufacturing" | "Agriculture" | "Service" | "Retail";
  min_investment: number;
  max_investment: number;
  avg_margin_percent: number;
  risk_level: "Low" | "Medium" | "High";
  breakeven_months: number;
}

export interface Competitor {
  id: number;
  name: string;
  category_id: string;
  type?: string;
  state: string;
  district: string;
  block: string;
  distance_km: number;
  years_active: number;
  rating: number;
  est_monthly_revenue?: number;
}

export interface ThreatItem {
  name: string;
  severity: "High" | "Medium" | "Low";
  description: string;
  mitigation: string;
}

export interface LocationMeta {
  population: number;
  literacy_rate: number;
  primary_occupation: string;
  nearest_city_km: number;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  name_hi: string;
  agency: string;
  ministry?: string;
  subsidy_percent_rural: number;
  subsidy_percent_urban: number;
  interest_subvention_percent?: number;
  max_project_cost: number;
  max_loan?: number;
  max_loan_display?: string;
  interest_rate?: string;
  tenure_years?: string;
  min_own_contribution_percent: number;
  sectors: string[];
  eligibility: {
    min_age?: number;
    max_loan?: number;
    min_loan?: number;
    new_units_only?: boolean;
    collateral_free?: boolean;
    target_groups?: string[];
    urban_only?: boolean;
    food_processing_only?: boolean;
    post_harvest_infra_only?: boolean;
    max_subsidy?: number;
  };
  criteria?: string[];
  description: string;
  url: string;
  application_url?: string;
}

export interface MatchedScheme extends GovernmentScheme {
  eligible: boolean;
  matchScore: number;
  subsidyPercentApplied: number;
  estimatedSubsidyAmount: number;
  reasons: string[];
  whyQualify?: string;
}

export interface LoanCalculation {
  projectCost: number;
  ownCapital: number;
  ownCapitalPercent: number;
  subsidyPercent: number;
  subsidyAmount: number;
  loanAmount: number;
  annualRate: number;
  months: number;
  emi: number;
  totalInterest: number;
  totalPayable: number;
}
