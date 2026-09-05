import { calculateViabilityScore } from '../src/services/viabilityScorer.js';
import { matchSchemes } from '../src/services/schemeMatcher.js';
import { calculateLoanDetails } from '../src/services/loanCalculator.js';
import { CATEGORIES, getCategoryByName, getCategoryById } from '../src/data/categories.js';
import { getBlockMeta, getVillageMeta, getVillages } from '../src/data/locations.js';
import { getCompetitors, countCompetitors } from '../src/data/competitors.js';

console.log('Testing raw functions...');

const form1 = {
  fullName: "Ramesh Kumar",
  language: "English",
  state: "Uttar Pradesh",
  district: "Lucknow",
  block: "Malihabad",
  village: "Rasoolpur",
  category: "Flour Mill",
  capital: 60000,
};

const category = getCategoryByName(form1.category) || CATEGORIES[0];
console.log('Category found:', category.name);

const blockMeta = getBlockMeta(form1.state, form1.district, form1.block) || {
  population: 4500,
  literacy_rate: 65,
  primary_occupation: "Agriculture",
  nearest_city_km: 25,
};
console.log('BlockMeta:', blockMeta);

const competitors = getCompetitors({
  state: form1.state,
  district: form1.district,
  block: form1.block,
  categoryId: category.id,
});
console.log('Competitors count:', competitors.length);

const viability = calculateViabilityScore({
  blockMeta,
  category,
  capital: form1.capital,
  competitorCount: competitors.length,
});
console.log('Viability score:', viability.totalScore);

const matched = matchSchemes({
  sector: category.sector,
  projectCost: Math.max(category.min_investment, form1.capital * 4),
  capital: form1.capital,
  categoryId: category.id,
  categoryName: category.name,
  socialCategory: "General",
  gender: "Male",
  isRural: true,
  age: 30,
});
console.log('Matched schemes count:', matched.length);

const loan = calculateLoanDetails({
  projectCost: Math.max(category.min_investment, form1.capital * 3.5),
  ownCapital: form1.capital,
  subsidyPercent: 25,
  annualRate: 10.5,
  months: 60,
});
console.log('Loan details EMI:', loan.monthlyEMI);

console.log('All functions succeeded!');
