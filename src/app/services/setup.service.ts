import {Injectable} from '@angular/core';
import {CalculationIF} from "../calculator/interfaces/calculation-if";
import {FunctionsService} from "./functions.service";
import {ParameterIF} from "../calculator/interfaces/parameter-if";

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
        payment: parameters.initialInvestment,
        stockAmount: initialStockAmount,
        stocksBoughtFromDividends: 0,
        purchasePrice: currentStockPrice,
        averagePurchasePrice: currentStockPrice,
        dividendPayout: initialStockAmount * currentDividendPerShare,
      },
      kpis: {
        accumulatedStockAmount: initialStockAmount,
        dividendPayout: dividendPayout,
        dividendPayoutReinvested: dividendPayout,
        dividendPercentage: parameters.initialDividendPercentage,
        accumulatedDividendPayout: dividendPayout,
        accumulatedPayments: parameters.initialInvestment,
        accumulatedPaymentsIncludingDividends: parameters.initialInvestment,
        yearlyInvestmentToReinvestedDividendFactor: 0,
        yearlyAbsoluteDividendGrowth: 0,
        year: parameters.currentYear,
      }
    } as CalculationIF;
  }
}
