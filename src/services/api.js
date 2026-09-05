/**
 * @file api.js
 * @description PragatiSahayak Unified API Service Layer.
 *
 * Currently routes requests to the client-side mock data layer with a simulated 500ms network delay.
 * When switching to a production Flask/FastAPI backend, configure VITE_API_URL in .env:
 *   VITE_API_URL=http://localhost:5000/api
 * Switching to the real backend requires editing only this file or providing the environment variable.
 */

import {
  getStates as mockGetStates,
  getDistricts as mockGetDistricts,
  getBlocks as mockGetBlocks,
  getVillages as mockGetVillages,
  getBlockMeta as mockGetBlockMeta,
  getVillageMeta as mockGetVillageMeta,
  LOCATIONS as mockLocations,
} from "../data/locations.js";

import {
  CATEGORIES as mockCategories,
  getCategoryById as mockGetCategoryById,
  getCategoryByName as mockGetCategoryByName,
} from "../data/categories.js";

import {
  SCHEMES as mockSchemes,
  getSchemeById as mockGetSchemeById,
} from "../data/schemes.js";

import {
  COMPETITORS as mockCompetitors,
  getCompetitors as mockGetCompetitors,
  countCompetitors as mockCountCompetitors,
} from "../data/competitors.js";

import { matchSchemes as mockMatchSchemes } from "./schemeMatcher.js";
import { calculateViabilityScore as mockCalculateViabilityScore } from "./viabilityScorer.js";
import { calculateLoanDetails as mockCalculateLoanDetails } from "./loanCalculator.js";
import { generateReportPDF as mockGenerateReportPDF } from "./pdfGenerator.js";
import {
  getAdminSchemes as mockGetAdminSchemes,
  saveAdminScheme as mockSaveAdminScheme,
  deleteAdminScheme as mockDeleteAdminScheme,
  getAdminCategories as mockGetAdminCategories,
  saveAdminCategory as mockSaveAdminCategory,
  deleteAdminCategory as mockDeleteAdminCategory,
  getAdminLocations as mockGetAdminLocations,
  addAdminLocation as mockAddAdminLocation,
  deleteAdminLocation as mockDeleteAdminLocation,
  getAdminCompetitors as mockGetAdminCompetitors,
  saveAdminCompetitor as mockSaveAdminCompetitor,
  deleteAdminCompetitor as mockDeleteAdminCompetitor,
  setAdminSession as mockSetAdminSession,
} from "./adminStore";

import { computeFullResults } from "../lib/resultsData";

const API_BASE = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "";

/**
 * Helper to simulate network latency for mock calls.
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Universal HTTP request handler for future Flask API integration.
 * @param {string} endpoint - API route relative to API_BASE
 * @param {RequestInit} [options={}] - Fetch configuration options
 * @returns {Promise<any>}
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
    if (!res.ok) {
      const errorText = await res.text().catch(() => res.statusText);
      throw new Error(`API Error [${res.status}]: ${errorText}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`Request to ${url} failed:`, error);
    throw error;
  }
}

export const api = {
  // ==========================================
  // LOCATION APIS
  // ==========================================

  /**
   * Fetch all supported Indian states.
   * @returns {Promise<string[]>} List of state names
   */
  getStates: async () => {
    try {
      if (API_BASE) {
        return await request("/locations/states");
      }
      await delay(500);
      return mockGetStates();
    } catch (err) {
      console.error("api.getStates error:", err);
      return mockGetStates();
    }
  },

  /**
   * Fetch all districts for a given state.
   * @param {string} state - Name of the state
   * @returns {Promise<string[]>} List of district names
   */
  getDistricts: async (state) => {
    try {
      if (!state) return [];
      if (API_BASE) {
        return await request(`/locations/districts?state=${encodeURIComponent(state)}`);
      }
      await delay(500);
      return mockGetDistricts(state);
    } catch (err) {
      console.error(`api.getDistricts(${state}) error:`, err);
      return mockGetDistricts(state);
    }
  },

  /**
   * Fetch all administrative blocks for a given state and district.
   * @param {string} state - Name of the state
   * @param {string} [district] - Name of the district
   * @returns {Promise<string[]>} List of block names
   */
  getBlocks: async (state, district) => {
    try {
      if (!state) return [];
      if (API_BASE) {
        const query = district
          ? `?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`
          : `?state=${encodeURIComponent(state)}`;
        return await request(`/locations/blocks${query}`);
      }
      await delay(500);
      return mockGetBlocks(state, district);
    } catch (err) {
      console.error(`api.getBlocks(${state}, ${district}) error:`, err);
      return mockGetBlocks(state, district);
    }
  },

  /**
   * Fetch census villages for a given block.
   * @param {string} state - Name of the state
   * @param {string} district - Name of the district
   * @param {string} block - Name of the block
   * @returns {Promise<Array<{name: string, population?: number, literacy_rate?: number}>>}
   */
  getVillages: async (state, district, block) => {
    try {
      if (!state || !district || !block) return [];
      if (API_BASE) {
        return await request(
          `/locations/villages?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}&block=${encodeURIComponent(block)}`
        );
      }
      await delay(500);
      return mockGetVillages(state, district, block);
    } catch (err) {
      console.error(`api.getVillages error:`, err);
      return mockGetVillages(state, district, block);
    }
  },

  /**
   * Fetch detailed socioeconomic metrics for a specific village & block.
   * @param {string} village - Village name
   * @param {string} block - Block name
   * @param {string} district - District name
   * @param {string} state - State name
   * @returns {Promise<{blockMeta: any, villageMeta: any}>}
   */
  getLocationData: async (village, block, district, state) => {
    try {
      if (API_BASE) {
        return await request(
          `/locations/details?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}&block=${encodeURIComponent(block)}&village=${encodeURIComponent(village)}`
        );
      }
      await delay(500);
      const blockMeta = mockGetBlockMeta(state, district, block);
      const villageMeta = mockGetVillageMeta(state, district, block, village);
      return { blockMeta, villageMeta };
    } catch (err) {
      console.error("api.getLocationData error:", err);
      return {
        blockMeta: mockGetBlockMeta(state, district, block),
        villageMeta: mockGetVillageMeta(state, district, block, village),
      };
    }
  },

  // ==========================================
  // BUSINESS CATEGORY APIS
  // ==========================================

  /**
   * Fetch all 10 curated micro-business categories.
   * @returns {Promise<Array<any>>}
   */
  getCategories: async () => {
    try {
      if (API_BASE) {
        return await request("/business/categories");
      }
      await delay(500);
      return mockCategories;
    } catch (err) {
      console.error("api.getCategories error:", err);
      return mockCategories;
    }
  },

  /**
   * Fetch economic profile and investment metrics for a category.
   * @param {string} categoryId - Business category slug (e.g. 'flour_mill')
   * @returns {Promise<any|null>}
   */
  getCategoryDetails: async (categoryId) => {
    try {
      if (API_BASE) {
        return await request(`/business/categories/${categoryId}`);
      }
      await delay(500);
      return mockGetCategoryById(categoryId) || null;
    } catch (err) {
      console.error(`api.getCategoryDetails(${categoryId}) error:`, err);
      return mockGetCategoryById(categoryId) || null;
    }
  },

  // ==========================================
  // SCHEME APIS
  // ==========================================

  /**
   * Fetch all 16 registered central and state government credit schemes.
   * @returns {Promise<Array<any>>}
   */
  getSchemes: async () => {
    try {
      if (API_BASE) {
        return await request("/schemes");
      }
      await delay(500);
      return mockSchemes;
    } catch (err) {
      console.error("api.getSchemes error:", err);
      return mockSchemes;
    }
  },

  /**
   * Match applicant profile against government schemes.
   * @param {object|string} profileOrCategory - Applicant profile object or category id
   * @param {string} [state] - State (if passed as separate arg)
   * @param {number} [loanAmount] - Loan amount (if passed as separate arg)
   * @returns {Promise<Array<any>>} Matched schemes sorted by match score
   */
  matchSchemes: async (profileOrCategory, state, loanAmount) => {
    try {
      const payload =
        typeof profileOrCategory === "object"
          ? profileOrCategory
          : {
              categoryId: profileOrCategory,
              state,
              projectCost: loanAmount ? loanAmount * 1.25 : 500000,
              capital: loanAmount ? loanAmount * 0.25 : 100000,
            };

      if (API_BASE) {
        return await request("/schemes/match", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      await delay(500);
      return mockMatchSchemes(payload);
    } catch (err) {
      console.error("api.matchSchemes error:", err);
      return typeof profileOrCategory === "object" ? mockMatchSchemes(profileOrCategory) : [];
    }
  },

  // ==========================================
  // ANALYSIS APIS
  // ==========================================

  /**
   * Fetch demand, customer catchment, and seasonal factors for an enterprise.
   * @param {object} locationData - Location parameters
   * @param {object} category - Business category object
   * @returns {Promise<object>}
   */
  getMarketAnalysis: async (locationData, category) => {
    try {
      if (API_BASE) {
        return await request("/analysis/market", {
          method: "POST",
          body: JSON.stringify({ locationData, category }),
        });
      }
      await delay(500);
      const full = computeFullResults({
        fullName: "Entrepreneur",
        language: "en",
        state: locationData?.state || "Uttar Pradesh",
        district: locationData?.district || "Lucknow",
        block: locationData?.block || "Malihabad",
        village: locationData?.village || "Bakshi",
        category: category?.id || "flour_mill",
        capital: category?.min_investment || 100000,
      });
      return full.marketAnalysis;
    } catch (err) {
      console.error("api.getMarketAnalysis error:", err);
      throw err;
    }
  },

  /**
   * Fetch 4-quadrant SWOT matrix.
   * @param {object} locationData - Location parameters
   * @param {object} category - Business category object
   * @param {Array} [competitors=[]] - Competitor list
   * @returns {Promise<{strengths: Array, weaknesses: Array, opportunities: Array, threats: Array}>}
   */
  getSWOTAnalysis: async (locationData, category, competitors = []) => {
    try {
      if (API_BASE) {
        return await request("/analysis/swot", {
          method: "POST",
          body: JSON.stringify({ locationData, category, competitors }),
        });
      }
      await delay(500);
      const full = computeFullResults({
        fullName: "Entrepreneur",
        language: "en",
        state: locationData?.state || "Uttar Pradesh",
        district: locationData?.district || "Lucknow",
        block: locationData?.block || "Malihabad",
        village: locationData?.village || "Bakshi",
        category: category?.id || "flour_mill",
        capital: category?.min_investment || 100000,
      });
      return full.swot;
    } catch (err) {
      console.error("api.getSWOTAnalysis error:", err);
      throw err;
    }
  },

  /**
   * Fetch local competitors mapped within the catchment area.
   * @param {string} block - Block name
   * @param {string} district - District name
   * @param {string} [category] - Category ID
   * @returns {Promise<Array<any>>}
   */
  getCompetitors: async (block, district, category) => {
    try {
      if (API_BASE) {
        return await request(
          `/competitors?block=${encodeURIComponent(block || "")}&district=${encodeURIComponent(district || "")}&category=${encodeURIComponent(category || "")}`
        );
      }
      await delay(500);
      return mockGetCompetitors({ block, district, categoryId: category });
    } catch (err) {
      console.error("api.getCompetitors error:", err);
      return mockGetCompetitors({ block, district, categoryId: category });
    }
  },

  /**
   * Fetch ranked business threat items with mitigation strategies.
   * @param {object} locationData - Location parameters
   * @param {object} category - Category object
   * @returns {Promise<Array<any>>}
   */
  getThreatAnalysis: async (locationData, category) => {
    try {
      if (API_BASE) {
        return await request("/analysis/threats", {
          method: "POST",
          body: JSON.stringify({ locationData, category }),
        });
      }
      await delay(500);
      const full = computeFullResults({
        fullName: "Entrepreneur",
        language: "en",
        state: locationData?.state || "Uttar Pradesh",
        district: locationData?.district || "Lucknow",
        block: locationData?.block || "Malihabad",
        village: locationData?.village || "Bakshi",
        category: category?.id || "flour_mill",
        capital: category?.min_investment || 100000,
      });
      return full.threatsDetailed;
    } catch (err) {
      console.error("api.getThreatAnalysis error:", err);
      throw err;
    }
  },

  /**
   * Recommend alternative high-viability business ideas if current category has high saturation.
   * @param {object} locationData - Location parameters
   * @param {string} currentCategory - Current category ID
   * @returns {Promise<Array<any>>}
   */
  getAlternatives: async (locationData, currentCategory) => {
    try {
      if (API_BASE) {
        return await request("/analysis/alternatives", {
          method: "POST",
          body: JSON.stringify({ locationData, currentCategory }),
        });
      }
      await delay(500);
      const full = computeFullResults({
        fullName: "Entrepreneur",
        language: "en",
        state: locationData?.state || "Uttar Pradesh",
        district: locationData?.district || "Lucknow",
        block: locationData?.block || "Malihabad",
        village: locationData?.village || "Bakshi",
        category: currentCategory || "flour_mill",
        capital: 100000,
      });
      return full.alternatives;
    } catch (err) {
      console.error("api.getAlternatives error:", err);
      throw err;
    }
  },

  /**
   * Calculate 5-factor viability score (0-100).
   * @param {object} category - Business category object
   * @param {object} location - Location object
   * @param {number} capital - Entrepreneur capital
   * @param {number|Array} competitors - Competitor count or list
   * @returns {Promise<{totalScore: number, label: string, breakdown: object}>}
   */
  calculateViability: async (category, location, capital, competitors) => {
    try {
      const compCount = Array.isArray(competitors) ? competitors.length : Number(competitors) || 0;
      if (API_BASE) {
        return await request("/analysis/viability", {
          method: "POST",
          body: JSON.stringify({ category, location, capital, competitorCount: compCount }),
        });
      }
      await delay(500);
      return mockCalculateViabilityScore({
        category,
        locationMeta: location,
        capital,
        competitorCount: compCount,
      });
    } catch (err) {
      console.error("api.calculateViability error:", err);
      throw err;
    }
  },

  // ==========================================
  // FINANCIAL APIS
  // ==========================================

  /**
   * Calculate project cost, loan required, subsidy amount, EMI, and payback schedule.
   * @param {number} investment - Total project cost
   * @param {number} capital - Own margin contribution
   * @param {string|number} [schemeIdOrSubsidyPercent] - Scheme identifier or subsidy percent
   * @returns {Promise<any>}
   */
  calculateLoan: async (investment, capital, schemeIdOrSubsidyPercent = 25) => {
    try {
      const subsidyPercent =
        typeof schemeIdOrSubsidyPercent === "number"
          ? schemeIdOrSubsidyPercent
          : (mockGetSchemeById(schemeIdOrSubsidyPercent)?.subsidy_percent_rural || 25);

      if (API_BASE) {
        return await request("/finance/calculate-loan", {
          method: "POST",
          body: JSON.stringify({ investment, capital, subsidyPercent }),
        });
      }
      await delay(500);
      return mockCalculateLoanDetails({
        projectCost: investment,
        ownCapital: capital,
        subsidyPercent,
        annualRate: 10.5,
        months: 60,
      });
    } catch (err) {
      console.error("api.calculateLoan error:", err);
      throw err;
    }
  },

  // ==========================================
  // AI APIS
  // ==========================================

  /**
   * Generate complete holistic feasibility intelligence report.
   * @param {object} userData - Complete form inputs from wizard
   * @returns {Promise<any>}
   */
  generateReport: async (userData) => {
    try {
      if (API_BASE) {
        return await request("/ai/report", {
          method: "POST",
          body: JSON.stringify(userData),
        });
      }
      await delay(500);
      return computeFullResults(userData);
    } catch (err) {
      console.error("api.generateReport error:", err);
      return computeFullResults(userData);
    }
  },

  /**
   * Chat with PragatiSahayak AI assistant in Hindi or English.
   * @param {string} message - User query
   * @param {object} [context={}] - Enterprise report context (location, business, etc.)
   * @returns {Promise<{text: string, confidence: "high" | "medium" | "low"}>}
   */
  chatWithAI: async (message, context = {}) => {
    try {
      if (API_BASE) {
        return await request("/ai/chat", {
          method: "POST",
          body: JSON.stringify({ message, context }),
        });
      }
      await delay(500);

      const q = (message || "").toLowerCase().trim();
      const categoryName = context?.category?.name || "your enterprise";
      const village = context?.formData?.village || "your village";
      const block = context?.formData?.block || "your block";
      const state = context?.formData?.state || "your state";

      // 1. Licenses & Compliance
      if (q.includes("license") || q.includes("registration") || q.includes("fssai") || q.includes("permit")) {
        return {
          text: `For establishing a ${categoryName} in ${state}:\n\n` +
            `1. 📋 Udyam MSME Registration (Free online at udyamregistration.gov.in using Aadhaar).\n` +
            `2. 🏪 Local Gram Panchayat Trade NOC / Shop & Establishment Act registration.\n` +
            `3. 🏢 Current Bank Account in your business enterprise name.\n` +
            `4. 🧾 GST Registration (Required only if annual revenue exceeds ₹40 Lakhs for goods).\n\n` +
            `💡 Tip: Having your Udyam registration certificate expedites bank credit and government subsidies.`,
          confidence: "high",
        };
      }

      // 2. Schemes & Application
      if (q.includes("scheme") || q.includes("apply") || q.includes("subsidy") || q.includes("pmegp") || q.includes("mudra")) {
        return {
          text: `To apply for government assistance for ${categoryName}:\n\n` +
            `1. 🌐 Access the official JanSamarth or PMEGP e-portal (jansamarth.in / kviconline.gov.in).\n` +
            `2. 📝 Register using Aadhaar and Mobile OTP.\n` +
            `3. 📂 Submit your Detailed Project Report (DPR) along with quotation for machinery.\n` +
            `4. 🏛️ For rural areas in ${block}, capital subsidies range from 25% to 35% under PMEGP.\n` +
            `5. 🏦 Banks release loan disbursements directly to equipment suppliers.`,
          confidence: "high",
        };
      }

      // 3. Risks & Threats
      if (q.includes("risk") || q.includes("threat") || q.includes("challenge") || q.includes("loss")) {
        return {
          text: `Key risk mitigation points for ${categoryName} in ${village}, ${block}:\n\n` +
            `1. ⚠️ Customer Credit (Udhaar): Cap informal customer credit at ₹500 to safeguard cash flows.\n` +
            `2. ⚡ Power Disruptions: Install a backup diesel generator or high-grade solar inverter for machinery continuity.\n` +
            `3. 📦 Raw Material Price Spikes: Maintain a minimum 15-day raw material buffer stock.\n` +
            `4. 🛡️ Emergency Reserve: Set aside 10% of monthly gross margins into a separate rainy day account.`,
          confidence: "high",
        };
      }

      // 4. Viability & Score
      if (q.includes("score") || q.includes("viability") || q.includes("increase")) {
        return {
          text: `To improve the commercial feasibility of your ${categoryName}:\n\n` +
            `1. 💰 Increase your own capital contribution to 20-30% to minimize monthly EMI stress.\n` +
            `2. 🤝 Pre-book forward supply contracts with 3-5 local retail shops or village schools.\n` +
            `3. 🚚 Offer delivery service to adjacent villages in ${block} to expand market reach.\n` +
            `4. ⚙️ Purchase ISI-certified energy-saving equipment to lower overhead power bills.`,
          confidence: "high",
        };
      }

      // Default contextual advice
      return {
        text: `Regarding your ${categoryName} project in ${village}, ${block}: PragatiSahayak analyzes verified block census, trade competition, and government incentives to guide you. Feel free to ask about bank loans, required licenses, machines, or market customers!`,
        confidence: "medium",
      };
    } catch (err) {
      console.error("api.chatWithAI error:", err);
      return {
        text: "I am ready to assist you with feasibility queries, loan options, and licensing guidance.",
        confidence: "low",
      };
    }
  },

  // ==========================================
  // ADMIN APIS
  // ==========================================

  /**
   * Authenticate administrator.
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise<{success: boolean, token?: string, email?: string, error?: string}>}
   */
  adminLogin: async (email, password) => {
    try {
      if (API_BASE) {
        return await request("/admin/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
      }
      await delay(500);
      const success = (email === "admin@pragatisahayak.in" || email === "admin@vyaparmitra.in") && password === "admin123";
      if (success) {
        mockSetAdminSession(email);
        return { success: true, token: "mock_jwt_token", email };
      }
      return { success: false, error: "Invalid admin credentials" };
    } catch (err) {
      console.error("api.adminLogin error:", err);
      return { success: false, error: err.message || "Login failed" };
    }
  },

  getSchemesAdmin: async () => {
    try {
      if (API_BASE) return await request("/admin/schemes");
      await delay(500);
      return mockGetAdminSchemes();
    } catch (err) {
      console.error("api.getSchemesAdmin error:", err);
      return mockGetAdminSchemes();
    }
  },

  createScheme: async (schemeData) => {
    try {
      if (API_BASE) {
        return await request("/admin/schemes", {
          method: "POST",
          body: JSON.stringify(schemeData),
        });
      }
      await delay(500);
      return mockSaveAdminScheme(schemeData);
    } catch (err) {
      console.error("api.createScheme error:", err);
      throw err;
    }
  },

  updateScheme: async (id, schemeData) => {
    try {
      if (API_BASE) {
        return await request(`/admin/schemes/${id}`, {
          method: "PUT",
          body: JSON.stringify(schemeData),
        });
      }
      await delay(500);
      return mockSaveAdminScheme({ ...schemeData, id });
    } catch (err) {
      console.error("api.updateScheme error:", err);
      throw err;
    }
  },

  deleteScheme: async (id) => {
    try {
      if (API_BASE) {
        return await request(`/admin/schemes/${id}`, { method: "DELETE" });
      }
      await delay(500);
      return mockDeleteAdminScheme(id);
    } catch (err) {
      console.error("api.deleteScheme error:", err);
      throw err;
    }
  },

  getCategoriesAdmin: async () => {
    try {
      if (API_BASE) return await request("/admin/categories");
      await delay(500);
      return mockGetAdminCategories();
    } catch (err) {
      console.error("api.getCategoriesAdmin error:", err);
      return mockGetAdminCategories();
    }
  },

  createCategory: async (categoryData) => {
    try {
      if (API_BASE) {
        return await request("/admin/categories", {
          method: "POST",
          body: JSON.stringify(categoryData),
        });
      }
      await delay(500);
      return mockSaveAdminCategory(categoryData);
    } catch (err) {
      console.error("api.createCategory error:", err);
      throw err;
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      if (API_BASE) {
        return await request(`/admin/categories/${id}`, {
          method: "PUT",
          body: JSON.stringify(categoryData),
        });
      }
      await delay(500);
      return mockSaveAdminCategory({ ...categoryData, id });
    } catch (err) {
      console.error("api.updateCategory error:", err);
      throw err;
    }
  },

  deleteCategory: async (id) => {
    try {
      if (API_BASE) {
        return await request(`/admin/categories/${id}`, { method: "DELETE" });
      }
      await delay(500);
      return mockDeleteAdminCategory(id);
    } catch (err) {
      console.error("api.deleteCategory error:", err);
      throw err;
    }
  },

  getLocationsAdmin: async () => {
    try {
      if (API_BASE) return await request("/admin/locations");
      await delay(500);
      return mockGetAdminLocations();
    } catch (err) {
      console.error("api.getLocationsAdmin error:", err);
      return mockGetAdminLocations();
    }
  },

  createLocation: async (locationData) => {
    try {
      if (API_BASE) {
        return await request("/admin/locations", {
          method: "POST",
          body: JSON.stringify(locationData),
        });
      }
      await delay(500);
      return mockAddAdminLocation(locationData);
    } catch (err) {
      console.error("api.createLocation error:", err);
      throw err;
    }
  },

  deleteLocation: async (state, district, block) => {
    try {
      if (API_BASE) {
        return await request(
          `/admin/locations?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district || "")}&block=${encodeURIComponent(block || "")}`,
          { method: "DELETE" }
        );
      }
      await delay(500);
      return mockDeleteAdminLocation(state, district, block);
    } catch (err) {
      console.error("api.deleteLocation error:", err);
      throw err;
    }
  },

  getCompetitorsAdmin: async () => {
    try {
      if (API_BASE) return await request("/admin/competitors");
      await delay(500);
      return mockGetAdminCompetitors();
    } catch (err) {
      console.error("api.getCompetitorsAdmin error:", err);
      return mockGetAdminCompetitors();
    }
  },

  createCompetitor: async (competitorData) => {
    try {
      if (API_BASE) {
        return await request("/admin/competitors", {
          method: "POST",
          body: JSON.stringify(competitorData),
        });
      }
      await delay(500);
      return mockSaveAdminCompetitor(competitorData);
    } catch (err) {
      console.error("api.createCompetitor error:", err);
      throw err;
    }
  },

  updateCompetitor: async (id, competitorData) => {
    try {
      if (API_BASE) {
        return await request(`/admin/competitors/${id}`, {
          method: "PUT",
          body: JSON.stringify(competitorData),
        });
      }
      await delay(500);
      return mockSaveAdminCompetitor({ ...competitorData, id });
    } catch (err) {
      console.error("api.updateCompetitor error:", err);
      throw err;
    }
  },

  deleteCompetitor: async (id) => {
    try {
      if (API_BASE) {
        return await request(`/admin/competitors/${id}`, { method: "DELETE" });
      }
      await delay(500);
      return mockDeleteAdminCompetitor(id);
    } catch (err) {
      console.error("api.deleteCompetitor error:", err);
      throw err;
    }
  },

  // ==========================================
  // REPORT APIS
  // ==========================================

  /**
   * Generate comprehensive feasibility analysis report for input business parameters.
   * @param {object} formData - Form questionnaire input data
   * @returns {Promise<object>} Full results dataset
   */
  generateReport: async (formData) => {
    try {
      if (API_BASE) {
        return await request("/reports/generate", {
          method: "POST",
          body: JSON.stringify(formData),
        });
      }
      await delay(400);
      return computeFullResults(formData);
    } catch (err) {
      console.error("api.generateReport error:", err);
      return computeFullResults(formData);
    }
  },

  /**
   * Export report data as downloadable PDF document.
   * @param {object} reportData - Full results report dataset
   * @returns {Promise<boolean>}
   */
  generatePDF: async (reportData) => {
    try {
      if (API_BASE) {
        const blob = await request("/reports/pdf", {
          method: "POST",
          body: JSON.stringify(reportData),
          headers: { Accept: "application/pdf" },
        });
        return Boolean(blob);
      }
      await delay(500);
      const user = reportData?.formData || reportData?.user || {};
      return mockGenerateReportPDF(user, reportData);
    } catch (err) {
      console.error("api.generatePDF error:", err);
      const user = reportData?.formData || reportData?.user || {};
      return mockGenerateReportPDF(user, reportData);
    }
  },

  // ==========================================
  // USER APIS
  // ==========================================

  /**
   * Register a new rural entrepreneur account.
   * @param {object} userData - Registration payload
   * @returns {Promise<{success: boolean, user: object}>}
   */
  register: async (userData) => {
    try {
      if (API_BASE) {
        return await request("/auth/register", {
          method: "POST",
          body: JSON.stringify(userData),
        });
      }
      await delay(500);
      return {
        success: true,
        user: {
          id: `user_${Date.now()}`,
          fullName: userData.fullName || "Entrepreneur",
          mobile: userData.mobile || "9876543210",
          state: userData.state || "Uttar Pradesh",
          createdAt: new Date().toISOString(),
        },
      };
    } catch (err) {
      console.error("api.register error:", err);
      throw err;
    }
  },

  /**
   * Authenticate entrepreneur via OTP or credentials.
   * @param {object} credentials - Login credentials
   * @returns {Promise<{success: boolean, token: string, user: object}>}
   */
  login: async (credentials) => {
    try {
      if (API_BASE) {
        return await request("/auth/login", {
          method: "POST",
          body: JSON.stringify(credentials),
        });
      }
      await delay(500);
      return {
        success: true,
        token: `token_${Date.now()}`,
        user: {
          id: "usr_default",
          fullName: credentials.mobile || "Entrepreneur",
        },
      };
    } catch (err) {
      console.error("api.login error:", err);
      throw err;
    }
  },

  /**
   * Retrieve generated reports history for a user.
   * @param {string} userId - User account identifier
   * @returns {Promise<Array<any>>}
   */
  getReportHistory: async (userId) => {
    try {
      if (API_BASE) {
        return await request(`/users/${userId}/reports`);
      }
      await delay(500);
      if (typeof window === "undefined") return [];
      const historyRaw = localStorage.getItem("pragatisahayak_history") || localStorage.getItem("vyaparmitra_history");
      return historyRaw ? JSON.parse(historyRaw) : [];
    } catch (err) {
      console.error("api.getReportHistory error:", err);
      return [];
    }
  },
};

export default api;
