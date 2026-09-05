// Weighted 0-100 viability score. Pure math, no AI.

const WEIGHTS = {
  demand: 0.3,
  competition: 0.25,
  capital: 0.2,
  infrastructure: 0.15,
  risk: 0.1,
};

function clamp(v, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

export function getLabel(score) {
  if (score <= 30) return "Poor";
  if (score <= 50) return "Below Average";
  if (score <= 70) return "Good";
  if (score <= 85) return "Very Good";
  return "Excellent";
}

/**
 * @param {object} input
 * @param {object} input.blockMeta { population, literacy_rate, primary_occupation, nearest_city_km }
 * @param {object} input.category  category record from src/data/categories.js
 * @param {number} input.capital   available margin capital
 * @param {number} input.competitorCount competitors in the block for this category
 */
export function calculateViabilityScore({ blockMeta, category, capital = 0, competitorCount = 0 }) {
  const meta = blockMeta ?? {};
  const population = Number(meta.population) || 0;
  const literacy = Number(meta.literacy_rate) || 0;
  const cityKm = Number(meta.nearest_city_km) || 0;

  // Demand (30%): population size + literacy + occupation fit
  const populationScore = clamp(((population - 2000) / 6000) * 100);
  const literacyScore = clamp(((literacy - 40) / 35) * 100);
  const occupationFit = (() => {
    const occ = meta.primary_occupation;
    const sector = category?.sector;
    if (occ === "Agriculture")
      return sector === "Agriculture" || sector === "Manufacturing" ? 90 : 60;
    if (occ === "Labor") return sector === "Manufacturing" ? 80 : 55;
    return 75; // Mixed
  })();
  const demand = clamp(populationScore * 0.5 + literacyScore * 0.2 + occupationFit * 0.3);

  // Competition (25%): fewer competitors is better
  const competition = clamp(100 - competitorCount * 22);

  // Capital (20%): fit against the category's investment range
  const min = Number(category?.min_investment) || 0;
  const max = Number(category?.max_investment) || Math.max(min, 1);
  const capitalScore = (() => {
    if (capital <= 0) return 0;
    if (capital >= min && capital <= max) {
      const position = (capital - min) / Math.max(1, max - min);
      return 70 + position * 30; // 70-100 inside the range
    }
    if (capital > max) return 95;
    const ratio = capital / Math.max(1, min);
    return clamp(ratio * 70); // below range, proportional
  })();
  const capitalFactor = clamp(capitalScore);

  // Infrastructure (15%): closer to a city is better
  const infrastructure = clamp(100 - ((cityKm - 5) / 35) * 70);

  // Risk (10%)
  const riskMap = { Low: 90, Medium: 65, High: 35 };
  const risk = riskMap[category?.risk_level] ?? 60;

  const breakdown = {
    demand: Math.round(demand),
    competition: Math.round(competition),
    capital: Math.round(capitalFactor),
    infrastructure: Math.round(infrastructure),
    risk: Math.round(risk),
  };

  const totalScore = Math.round(
    breakdown.demand * WEIGHTS.demand +
      breakdown.competition * WEIGHTS.competition +
      breakdown.capital * WEIGHTS.capital +
      breakdown.infrastructure * WEIGHTS.infrastructure +
      breakdown.risk * WEIGHTS.risk,
  );

  return { totalScore, breakdown, label: getLabel(totalScore), weights: WEIGHTS };
}

export default calculateViabilityScore;
