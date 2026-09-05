import { SCHEMES } from "@/data/schemes.js";
import { CATEGORIES } from "@/data/categories.js";
import { LOCATIONS } from "@/data/locations.js";
import { COMPETITORS } from "@/data/competitors.js";
import { toast } from "sonner";

export interface AdminScheme {
  id: string;
  name: string;
  name_hi?: string;
  ministry: string;
  agency?: string;
  description: string;
  max_loan: number;
  min_loan: number;
  interest_rate: string;
  subsidy_percent: number;
  tenure_years: string;
  eligibility_criteria: string;
  applicable_states: string[];
  applicable_categories: string[];
  application_url: string;
  is_active: boolean;
}

export interface AdminCategory {
  id: string;
  name: string;
  name_hi: string;
  sector: string;
  min_investment: number;
  max_investment: number;
  avg_margin_percent: number;
  risk_level: "Low" | "Medium" | "High";
  breakeven_months: number;
}

export interface AdminCompetitor {
  id: string | number;
  name: string;
  category_id: string;
  type: string;
  state: string;
  district: string;
  block: string;
  village?: string;
  distance_km: number;
  years_active: number;
  rating: number;
  est_monthly_revenue: number;
}

export interface VillageData {
  name: string;
  population?: number;
  literacy_rate?: number;
  primary_occupation?: string;
  nearest_city_km?: number;
}

export interface BlockData {
  population: number;
  literacy_rate: number;
  primary_occupation: string;
  nearest_city_km: number;
  villages?: VillageData[];
}

export type LocationTree = Record<string, Record<string, Record<string, BlockData>>>;

export interface AdminSession {
  email: string;
  isAuthenticated: boolean;
  loggedInAt: string;
}

const STORAGE_KEYS = {
  AUTH: "pragatisahayak_admin_session",
  SCHEMES: "pragatisahayak_admin_schemes",
  CATEGORIES: "pragatisahayak_admin_categories",
  LOCATIONS: "pragatisahayak_admin_locations",
  COMPETITORS: "pragatisahayak_admin_competitors",
  REPORTS_COUNT: "pragatisahayak_reports_count",
};

// Available Indian states for selection
export const ALL_STATES = [
  "All India",
  "Uttar Pradesh",
  "Bihar",
  "Madhya Pradesh",
  "Rajasthan",
  "Maharashtra",
  "Gujarat",
  "Punjab",
  "Haryana",
  "West Bengal",
];

export const ALL_SECTORS = [
  "Manufacturing",
  "Service",
  "Retail",
  "Agriculture",
];

// --- AUTHENTICATION ---
export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data?.isAuthenticated ? data : null;
  } catch {
    return null;
  }
}

export function setAdminSession(email: string): AdminSession {
  const session: AdminSession = {
    email,
    isAuthenticated: true,
    loggedInAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session));
    } catch (e) {
      console.error("Failed to save admin session", e);
    }
  }
  return session;
}

export function clearAdminSession(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch (e) {
      console.error("Failed to remove admin session", e);
    }
  }
}

// --- REPORTS STATS ---
export function getReportsGeneratedCount(): number {
  if (typeof window === "undefined") return 34;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS_COUNT);
    if (!raw) {
      // Default to an initial realistic counter
      localStorage.setItem(STORAGE_KEYS.REPORTS_COUNT, "34");
      return 34;
    }
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) ? 34 : parsed;
  } catch {
    return 34;
  }
}

export function incrementReportsGeneratedCount(): number {
  if (typeof window === "undefined") return 35;
  try {
    const current = getReportsGeneratedCount();
    const next = current + 1;
    localStorage.setItem(STORAGE_KEYS.REPORTS_COUNT, next.toString());
    return next;
  } catch {
    return 35;
  }
}

// --- SCHEMES ---
export function getAdminSchemes(): AdminScheme[] {
  if (typeof window === "undefined") return getInitialSchemes();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHEMES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error loading schemes from localStorage", e);
  }

  // Fallback & initialize
  const initial = getInitialSchemes();
  saveAdminSchemes(initial);
  return initial;
}

export function isStorageFull(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const testKey = "__pragatisahayak_quota_test__";
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return false;
  } catch (e) {
    return true;
  }
}

export function safeSetItem(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.error(`Quota exceeded or error saving "${key}"`, e);
    toast.warning("Browser storage is full! Please clear browser cache or delete old items.", {
      id: "storage-quota-warning",
    });
    return false;
  }
}

export function saveAdminSchemes(schemes: AdminScheme[]): boolean {
  return safeSetItem(STORAGE_KEYS.SCHEMES, JSON.stringify(schemes));
}

export function saveAdminScheme(scheme: AdminScheme): AdminScheme[] {
  const current = getAdminSchemes();
  const index = current.findIndex((s) => s.id === scheme.id);
  let updated: AdminScheme[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = scheme;
  } else {
    updated = [scheme, ...current];
  }
  saveAdminSchemes(updated);
  return updated;
}

export function deleteAdminScheme(id: string): AdminScheme[] {
  try {
    const current = getAdminSchemes();
    const updated = current.filter((s) => s.id !== id);
    const success = saveAdminSchemes(updated);
    if (!success) {
      toast.error("Failed to delete scheme. Storage update failed.");
    }
    return updated;
  } catch (err) {
    console.error("Delete scheme failed", err);
    toast.error("Failed to delete scheme. Please try again.");
    return getAdminSchemes();
  }
}

export function toggleSchemeActive(id: string): AdminScheme[] {
  const current = getAdminSchemes();
  const updated = current.map((s) =>
    s.id === id ? { ...s, is_active: !s.is_active } : s
  );
  saveAdminSchemes(updated);
  return updated;
}

function getInitialSchemes(): AdminScheme[] {
  return (SCHEMES as any[]).map((s) => ({
    id: s.id || `scheme_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: s.name || "Government Scheme",
    name_hi: s.name_hi || "",
    ministry: s.ministry || s.agency || "Government of India",
    agency: s.agency || "",
    description: s.description || "",
    max_loan: s.max_loan || s.max_project_cost || 1000000,
    min_loan: s.min_loan || 25000,
    interest_rate: s.interest_rate || "8.5% - 11.5%",
    subsidy_percent: s.subsidy_percent_rural ?? (s.subsidy_percent ?? 25),
    tenure_years: s.tenure_years || "3 - 7 Years",
    eligibility_criteria: Array.isArray(s.criteria)
      ? s.criteria.join("\n• ")
      : typeof s.criteria === "string"
        ? s.criteria
        : "Standard MSME / Rural Enterprise eligibility criteria apply.",
    applicable_states: Array.isArray(s.states) && s.states.length > 0 ? s.states : ["All India"],
    applicable_categories: Array.isArray(s.sectors) ? s.sectors : ALL_SECTORS,
    application_url: s.application_url || s.url || "https://www.india.gov.in/",
    is_active: true,
  }));
}

// --- CATEGORIES ---
export function getAdminCategories(): AdminCategory[] {
  if (typeof window === "undefined") return getInitialCategories();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error loading categories from localStorage", e);
  }

  const initial = getInitialCategories();
  saveAdminCategories(initial);
  return initial;
}

export function saveAdminCategories(categories: AdminCategory[]): boolean {
  return safeSetItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
}

export function saveAdminCategory(category: AdminCategory): AdminCategory[] {
  const current = getAdminCategories();
  const index = current.findIndex((c) => c.id === category.id);
  let updated: AdminCategory[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = category;
  } else {
    updated = [category, ...current];
  }
  saveAdminCategories(updated);
  return updated;
}

export function deleteAdminCategory(id: string): AdminCategory[] {
  try {
    const current = getAdminCategories();
    const updated = current.filter((c) => c.id !== id);
    const success = saveAdminCategories(updated);
    if (!success) {
      toast.error("Failed to delete category. Storage update failed.");
    }
    return updated;
  } catch (err) {
    console.error("Delete category failed", err);
    toast.error("Failed to delete category. Please try again.");
    return getAdminCategories();
  }
}

function getInitialCategories(): AdminCategory[] {
  return (CATEGORIES as any[]).map((c) => ({
    id: c.id,
    name: c.name,
    name_hi: c.name_hi || "",
    sector: c.sector || "Manufacturing",
    min_investment: c.min_investment || 50000,
    max_investment: c.max_investment || 300000,
    avg_margin_percent: c.avg_margin_percent || 20,
    risk_level: (c.risk_level as "Low" | "Medium" | "High") || "Medium",
    breakeven_months: c.breakeven_months || 12,
  }));
}

// --- LOCATIONS ---
export function getAdminLocations(): LocationTree {
  if (typeof window === "undefined") return LOCATIONS as LocationTree;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error loading locations from localStorage", e);
  }

  const initial = LOCATIONS as LocationTree;
  saveAdminLocations(initial);
  return initial;
}

export function saveAdminLocations(locations: LocationTree): boolean {
  return safeSetItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
}

export function addAdminLocation(params: {
  state: string;
  district: string;
  block: string;
  population?: number;
  literacy_rate?: number;
  primary_occupation?: string;
  nearest_city_km?: number;
  villages?: string[];
}): LocationTree {
  const current = getAdminLocations();
  const state = params.state.trim();
  const district = params.district.trim();
  const block = params.block.trim();

  const updated: LocationTree = {
    ...current,
    [state]: {
      ...(current[state] || {}),
      [district]: {
        ...(current[state]?.[district] || {}),
        [block]: {
          population: params.population || 4500,
          literacy_rate: params.literacy_rate || 65,
          primary_occupation: params.primary_occupation || "Mixed",
          nearest_city_km: params.nearest_city_km || 25,
          villages: (params.villages || []).map((v) => ({
            name: v.trim(),
            population: Math.round((params.population || 4500) / Math.max(1, (params.villages || []).length)),
            literacy_rate: params.literacy_rate || 65,
            primary_occupation: params.primary_occupation || "Mixed",
            nearest_city_km: params.nearest_city_km || 25,
          })),
        },
      },
    },
  };

  saveAdminLocations(updated);
  return updated;
}

export function deleteAdminLocation(state: string, district?: string, block?: string): LocationTree {
  try {
    const current = getAdminLocations();
    const updated: LocationTree = JSON.parse(JSON.stringify(current));

    if (block && district && updated[state]?.[district]) {
      delete updated[state][district][block];
      // Clean up district if empty
      if (Object.keys(updated[state][district]).length === 0) {
        delete updated[state][district];
      }
      // Clean up state if empty
      if (Object.keys(updated[state]).length === 0) {
        delete updated[state];
      }
    } else if (district && updated[state]) {
      delete updated[state][district];
      if (Object.keys(updated[state]).length === 0) {
        delete updated[state];
      }
    } else if (state && updated[state]) {
      delete updated[state];
    }

    const success = saveAdminLocations(updated);
    if (!success) {
      toast.error("Failed to delete location. Storage update failed.");
    }
    return updated;
  } catch (err) {
    console.error("Delete location failed", err);
    toast.error("Failed to delete location. Please try again.");
    return getAdminLocations();
  }
}

// --- COMPETITORS ---
export function getAdminCompetitors(): AdminCompetitor[] {
  if (typeof window === "undefined") return getInitialCompetitors();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPETITORS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error loading competitors from localStorage", e);
  }

  const initial = getInitialCompetitors();
  saveAdminCompetitors(initial);
  return initial;
}

export function saveAdminCompetitors(competitors: AdminCompetitor[]): boolean {
  return safeSetItem(STORAGE_KEYS.COMPETITORS, JSON.stringify(competitors));
}

export function saveAdminCompetitor(competitor: AdminCompetitor): AdminCompetitor[] {
  const current = getAdminCompetitors();
  const index = current.findIndex((c) => String(c.id) === String(competitor.id));
  let updated: AdminCompetitor[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = competitor;
  } else {
    updated = [competitor, ...current];
  }
  saveAdminCompetitors(updated);
  return updated;
}

export function deleteAdminCompetitor(id: string | number): AdminCompetitor[] {
  try {
    const current = getAdminCompetitors();
    const updated = current.filter((c) => String(c.id) !== String(id));
    const success = saveAdminCompetitors(updated);
    if (!success) {
      toast.error("Failed to delete competitor. Storage update failed.");
    }
    return updated;
  } catch (err) {
    console.error("Delete competitor failed", err);
    toast.error("Failed to delete competitor. Please try again.");
    return getAdminCompetitors();
  }
}

function getInitialCompetitors(): AdminCompetitor[] {
  return (COMPETITORS as any[]).map((c) => ({
    id: c.id,
    name: c.name,
    category_id: c.category_id || "general",
    type: c.type || "Local Enterprise",
    state: c.state || "Uttar Pradesh",
    district: c.district || "Lucknow",
    block: c.block || "Malihabad",
    village: c.village || "",
    distance_km: c.distance_km || 2.5,
    years_active: c.years_active || 3,
    rating: c.rating || 4.0,
    est_monthly_revenue: c.est_monthly_revenue || 45000,
  }));
}
