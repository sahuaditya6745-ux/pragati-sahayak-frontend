// Pure rule-based scheme matching. No AI involved.

import { SCHEMES } from "../data/schemes.js";

/**
 * Match government schemes to an applicant profile.
 * @param {object} profile
 * @param {string} profile.sector category sector
 * @param {number} profile.projectCost total project cost
 * @param {number} profile.capital own margin capital
 * @param {string} [profile.categoryId]
 * @param {string} [profile.categoryName]
 * @param {string} [profile.socialCategory] "General" | "SC" | "ST" | "OBC"
 * @param {string} [profile.gender] "Male" | "Female"
 * @param {boolean} [profile.isRural]
 * @param {number} [profile.age]
 * @returns {Array} matched schemes sorted by match score (desc)
 */
export function matchSchemes(profile) {
  const {
    sector,
    projectCost = 0,
    capital = 0,
    categoryId = "",
    socialCategory = "General",
    gender = "Male",
    isRural = true,
    age = 25,
  } = profile ?? {};

  const foodCategories = ["flour_mill", "oil_mill", "papad_making", "dairy_farm"];
  const results = [];

  for (const scheme of SCHEMES) {
    const reasons = [];
    let score = 0;
    let eligible = true;

    // Sector fit
    if (scheme.sectors.includes(sector)) {
      score += 30;
      reasons.push(`Covers the ${sector} sector`);
    } else {
      eligible = false;
      reasons.push(`Does not cover the ${sector} sector`);
    }

    // Project cost ceiling
    if (projectCost <= scheme.max_project_cost) {
      score += 25;
      reasons.push("Project cost is within the scheme ceiling");
    } else {
      eligible = false;
      reasons.push("Project cost exceeds the scheme ceiling");
    }

    // Own contribution
    const requiredOwn = (projectCost * scheme.min_own_contribution_percent) / 100;
    if (capital >= requiredOwn) {
      score += 20;
      reasons.push(
        `Your capital meets the ${scheme.min_own_contribution_percent}% own-contribution requirement`,
      );
    } else {
      score += 5;
      reasons.push(
        `You need at least ₹${Math.round(requiredOwn).toLocaleString("en-IN")} as own contribution`,
      );
    }

    // Age
    if (age >= (scheme.eligibility.min_age ?? 18)) {
      score += 5;
    } else {
      eligible = false;
      reasons.push("Below the minimum age for this scheme");
    }

    // Minimum loan floor (Stand-Up India)
    const neededLoan = Math.max(0, projectCost - capital);
    if (scheme.eligibility.min_loan && neededLoan < scheme.eligibility.min_loan) {
      eligible = false;
      reasons.push("Loan requirement is below the scheme's minimum ticket size");
    }

    // Target group (Stand-Up India)
    if (scheme.eligibility.target_groups) {
      const inGroup =
        scheme.eligibility.target_groups.includes(socialCategory) ||
        (gender === "Female" && scheme.eligibility.target_groups.includes("Woman"));
      if (inGroup) {
        score += 15;
        reasons.push("You belong to a priority target group");
      } else {
        eligible = false;
        reasons.push("Reserved for SC/ST and women entrepreneurs");
      }
    }

    // Urban-only schemes
    if (scheme.eligibility.urban_only && isRural) {
      eligible = false;
      reasons.push("Applies to urban areas only");
    }

    // State-specific schemes
    if (scheme.states && scheme.states.length > 0) {
      if (profile.state && !scheme.states.includes(profile.state)) {
        eligible = false;
        reasons.push(`Exclusive to enterprises located in ${scheme.states.join(", ")}`);
      } else if (profile.state && scheme.states.includes(profile.state)) {
        score += 15;
        reasons.push(`Special state-level subsidy for ${profile.state}`);
      }
    }

    // Food-processing-only schemes
    if (scheme.eligibility.food_processing_only) {
      if (foodCategories.includes(categoryId)) {
        score += 15;
        reasons.push("Your business is a food processing activity");
      } else {
        eligible = false;
        reasons.push("Limited to food processing enterprises");
      }
    }

    // Post-harvest infra only
    if (scheme.eligibility.post_harvest_infra_only && sector !== "Agriculture") {
      eligible = false;
      reasons.push("Limited to post-harvest agri-infrastructure projects");
    }

    // Benefit bonus
    const subsidy = isRural ? scheme.subsidy_percent_rural : scheme.subsidy_percent_urban;
    if (subsidy > 0) {
      score += 10;
      reasons.push(`${subsidy}% capital subsidy available`);
    }
    if (scheme.eligibility.collateral_free) {
      score += 5;
      reasons.push("Collateral-free loan");
    }

    const categoryDisplayName =
      profile.categoryName || (categoryId ? categoryId.replace(/_/g, " ") : "your chosen business");
    const whyQualify = eligible
      ? `Your business category ${categoryDisplayName} and loan requirement of ₹${neededLoan.toLocaleString("en-IN")} fall within this scheme's criteria.`
      : `Your business category ${categoryDisplayName} or loan requirements do not fully align with this scheme's mandatory eligibility parameters.`;

    results.push({
      ...scheme,
      eligible,
      matchScore: eligible ? Math.min(100, score) : Math.min(40, score),
      subsidyPercentApplied: eligible ? subsidy : 0,
      estimatedSubsidyAmount: eligible ? Math.round((projectCost * subsidy) / 100) : 0,
      reasons,
      whyQualify,
    });
  }

  return results.sort((a, b) => {
    if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
    return b.matchScore - a.matchScore;
  });
}
