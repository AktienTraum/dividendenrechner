import {Injectable} from '@angular/core';
import {CalculationIF} from "../interfaces/calculation-if";
import {FunctionsService} from "./functions.service";
import {ParameterIF} from "../interfaces/parameter-if";

@Injectable({
  providedIn: 'root'
})
export class SetupService {

  public static INITIAL_STOCK_PRICE = 50;

  constructor(private functions: FunctionsService) {
  }

  public calculateCurrentYear(parameters: ParameterIF,
                              currentStockPrice: number,
                              currentDividendPerShare: number): CalculationIF {

    const initialStockAmount = this.functions.calculateStockAmount(parameters.initialInvestment, currentStockPrice);
    const dividendPayout = this.functions.calculateDividendPayout(initialStockAmount, currentDividendPerShare);

    return {
      dividend: {
        currentDividendPerShare: currentDividendPerShare,
      },
      shares: {
        stockAmount: initialStockAmount,
        purchasePrice: currentStockPrice,
        averagePurchasePrice: currentStockPrice,
        dividendPayout: dividendPayout,
      },
      kpis: {
        investedSumPerYear: parameters.initialInvestment,
        accumulatedStockAmount: initialStockAmount,
        dividendPayout: dividendPayout,
        dividendPayoutReinvested: dividendPayout,
        dividendPercentage: parameters.initialDividendPercentage,
        accumulatedDividendPayout: dividendPayout,
        accumulatedPayments: parameters.initialInvestment - parameters.initialDividends,
        accumulatedPaymentsIncludingDividends: parameters.initialInvestment,
        accumulatedAssetsInclundingPriceGains: parameters.initialInvestment + parameters.initialPriceGains,
        yearlyInvestmentToReinvestedDividendFactor: 0,
        yearlyAbsoluteDividendGrowth: 0,
        year: parameters.currentYear,
        accumulatedPriceGains: parameters.initialPriceGains,
      }
    } as CalculationIF;
  }
}
