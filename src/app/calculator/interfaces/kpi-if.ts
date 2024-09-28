export interface KpiIF {
  dividendPayout: number,
  dividendPayoutReinvested: number,
  dividendPercentage: number,
  accumulatedStockAmount: number,
  accumulatedPayments: number,
  accumulatedPaymentsIncludingDividends: number,
  accumulatedAssetsInclundingPriceGains: number,
  yearlyInvestmentToReinvestedDividendFactor: number,
  yearlyAbsoluteDividendGrowth: number,
  year: number,
  accumulatedPriceGains: number
}
