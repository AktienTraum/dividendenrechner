export interface KpiIF {
  dividendPayout: number,
  dividendPayoutReinvested: number,
  dividendPercentage: number,
  accumulatedStockAmount: number,
  accumulatedPayments: number,
  accumulatedPaymentsIncludingDividends: number,
  yearlyInvestmentToReinvestedDividendFactor: number,
  yearlyAbsoluteDividendGrowth: number,
}
