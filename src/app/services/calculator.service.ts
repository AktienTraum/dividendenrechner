import {Injectable} from '@angular/core';
import {CalculationIF} from "../calculator/interfaces/calculation-if";
import {ParameterIF} from "../calculator/interfaces/parameter-if";
import {SetupService} from "./setup.service";
import {FunctionsService} from "./functions.service";


@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  constructor(
    private functions: FunctionsService,
    private setup: SetupService,) {
  }


  calculate(parameters: ParameterIF): CalculationIF[] {
    let currentStockPrice = SetupService.INITIAL_STOCK_PRICE;
    let currentDividendPercentage = parameters.initialDividendPercentage;
    let currentDividendPerShare = currentStockPrice * currentDividendPercentage / 100;

    let result: CalculationIF[] = [];

    result[0] = this.setup.calculateCurrentYear(
      parameters,
      currentStockPrice,
      currentDividendPerShare);

    let accumulatedStockAmount = result[0].shares.stockAmount;
    let accumulatedPayments = result[0].kpis.accumulatedPayments;
    let accumulatedPaymentsIncludingDividends = accumulatedPayments;
    let investedSumPerYear = parameters.yearlyInvestment;

    for (let i = 1; i <= parameters.years; i++) {
      currentStockPrice = currentStockPrice + (currentStockPrice * parameters.priceGainPercentage / 100);
      currentDividendPerShare = currentDividendPerShare + (currentDividendPerShare * parameters.yearlyDividendPercentageIncrease / 100);

      accumulatedPayments += investedSumPerYear;
      accumulatedPaymentsIncludingDividends += investedSumPerYear;

      let yearlyStockAmount = this.functions.calculateStockAmount(investedSumPerYear, currentStockPrice);
      accumulatedStockAmount += yearlyStockAmount + result[i - 1].shares.stocksBoughtFromDividends;

      let dividendPayout = this.functions.calculateDividendPayout(accumulatedStockAmount, currentDividendPerShare);
      let stocksBoughtFromDividens = this.functions.calculateStockAmount(dividendPayout, currentStockPrice);
      let investedDividends = this.functions.calculateInvestedDividendsFactor(dividendPayout, parameters.dividendReinvestmentPercentage);

      accumulatedPaymentsIncludingDividends += dividendPayout;

      let averageStockPrice = (result[i - 1].shares.averagePurchasePrice * result[i - 1].kpis.accumulatedStockAmount
        + yearlyStockAmount * currentStockPrice) / (result[i - 1].kpis.accumulatedStockAmount + yearlyStockAmount);

      currentDividendPercentage = currentDividendPerShare / currentStockPrice * 100;

      result[i] = {
        dividend: {
          currentDividendPerShare: currentDividendPerShare,
        },
        shares: {
          payment: investedSumPerYear,
          stockAmount: yearlyStockAmount,
          stocksBoughtFromDividends: stocksBoughtFromDividens,
          purchasePrice: currentStockPrice,
          averagePurchasePrice: averageStockPrice,
          dividendPayout: yearlyStockAmount * currentDividendPerShare,
        },
        kpis: {
          accumulatedStockAmount: accumulatedStockAmount,
          dividendPayout: dividendPayout,
          dividendPayoutReinvested: investedDividends,
          dividendPercentage: currentDividendPercentage,
          accumulatedPayments: accumulatedPayments,
          accumulatedPaymentsIncludingDividends: accumulatedPaymentsIncludingDividends,
          yearlyInvestmentToReinvestedDividendFactor: investedDividends / investedSumPerYear,
          yearlyAbsoluteDividendGrowth: dividendPayout - result[i - 1].kpis.dividendPayout,
          year: parameters.currentYear + i,
        }
      } as CalculationIF;

      investedSumPerYear += parameters.yearlyInvestmentIncrease;
    }

    return result;
  }
}
