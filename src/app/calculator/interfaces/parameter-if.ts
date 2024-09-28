export interface ParameterIF {
  initialInvestment: number,
  initialPriceGains: number,
  yearlyInvestment: number,
  yearlyInvestmentIncrease: number,
  dividendReinvestmentPercentage: number,
  initialDividendPercentage: number,
  yearlyDividendPercentageIncrease: number,
  years: number,
  currentYear: number,
  priceGainPercentage: number,
  taxPercentage: number,
  yearlyTaxFreeSum: number,
}
