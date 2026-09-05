// Pure JavaScript loan math. No AI, no network.

/**
 * Standard reducing-balance EMI.
 * @param {number} principal loan amount in rupees
 * @param {number} annualRate annual interest rate in percent (e.g. 11.5)
 * @param {number} months tenure in months
 * @returns {number} monthly EMI, rounded to nearest rupee
 */
export function calculateEMI(principal, annualRate, months) {
  const p = Number(principal) || 0;
  const n = Number(months) || 0;
  if (p <= 0 || n <= 0) return 0;

  const r = (Number(annualRate) || 0) / 12 / 100;
  if (r === 0) return Math.round(p / n);

  const factor = Math.pow(1 + r, n);
  return Math.round((p * r * factor) / (factor - 1));
}

/**
 * Full loan picture for a project.
 * @param {object} params
 * @param {number} params.projectCost total project cost
 * @param {number} params.ownCapital margin money the entrepreneur has
 * @param {number} [params.subsidyPercent] capital subsidy on project cost
 * @param {number} [params.annualRate] interest rate in percent
 * @param {number} [params.months] tenure in months
 */
export function calculateLoanDetails({
  projectCost,
  ownCapital,
  subsidyPercent = 0,
  annualRate = 11.5,
  months = 60,
}) {
  const cost = Math.max(0, Number(projectCost) || 0);
  const own = Math.max(0, Number(ownCapital) || 0);
  const subsidyAmount = Math.round((cost * (Number(subsidyPercent) || 0)) / 100);

  const loanAmount = Math.max(0, cost - own - subsidyAmount);
  const emi = calculateEMI(loanAmount, annualRate, months);
  const totalPayable = emi * months;
  const totalInterest = Math.max(0, totalPayable - loanAmount);

  return {
    projectCost: cost,
    ownCapital: own,
    ownCapitalPercent: cost > 0 ? Math.round((own / cost) * 100) : 0,
    subsidyPercent: Number(subsidyPercent) || 0,
    subsidyAmount,
    loanAmount,
    annualRate,
    months,
    emi,
    totalInterest,
    totalPayable,
  };
}
