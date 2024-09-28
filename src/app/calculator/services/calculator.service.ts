import {Injectable} from '@angular/core';
import {CalculationIF} from "../interfaces/calculation-if";
import {ParameterIF} from "../interfaces/parameter-if";
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
    let accumulatedAssetsInclundingPriceGains = result[0].kpis.accumulatedAssetsInclundingPriceGains;
    let accumulatedPriceGains = result[0].kpis.accumulatedPriceGains;
    let investedSumPerYear = parameters.yearlyInvestment;

    for (let i = 1; i <= parameters.years; i++) {
      currentStockPrice += currentStockPrice * parameters.priceGainPercentage / 100;
      currentDividendPerShare += currentDividendPerShare * parameters.yearlyDividendPercentageIncrease / 100;

      let yearlyStockAmount =
        this.functions.calculateStockAmount(investedSumPerYear, currentStockPrice);
      accumulatedStockAmount += yearlyStockAmount;
      let dividendPayout =
        this.functions.calculateDividendPayout(accumulatedStockAmount, currentDividendPerShare);

      let stocksBoughtFromDividens =
        this.functions.calculateStockAmount(dividendPayout, currentStockPrice);
      let dividendPayoutFromStocksBoughtFromDividends =
        this.functions.calculateDividendPayout(stocksBoughtFromDividens, currentDividendPerShare);

      dividendPayout += dividendPayoutFromStocksBoughtFromDividends;
      accumulatedStockAmount += stocksBoughtFromDividens;
      yearlyStockAmount += stocksBoughtFromDividens

      let investedDividends =
        this.functions.calculateInvestedDividendsFactor(dividendPayout, parameters.dividendReinvestmentPercentage);

      let averageStockPrice = (result[i - 1].shares.averagePurchasePrice * result[i - 1].kpis.accumulatedStockAmount
        + yearlyStockAmount * currentStockPrice) / (result[i - 1].kpis.accumulatedStockAmount + yearlyStockAmount);

      accumulatedPriceGains =
        parameters.initialPriceGains + (averageStockPrice * accumulatedStockAmount * parameters.priceGainPercentage / 100);
      accumulatedPayments += investedSumPerYear;
      accumulatedPaymentsIncludingDividends += investedSumPerYear + dividendPayout;
      accumulatedAssetsInclundingPriceGains = accumulatedPaymentsIncludingDividends + accumulatedPriceGains

      currentDividendPercentage = currentDividendPerShare / currentStockPrice * 100;

      result[i] = {
        dividend: {
          currentDividendPerShare: currentDividendPerShare,
        },
        shares: {
          payment: investedSumPerYear,
          stockAmount: yearlyStockAmount,
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
          accumulatedAssetsInclundingPriceGains: accumulatedAssetsInclundingPriceGains,
          yearlyInvestmentToReinvestedDividendFactor: investedDividends / investedSumPerYear,
          yearlyAbsoluteDividendGrowth: dividendPayout - result[i - 1].kpis.dividendPayout,
          year: parameters.currentYear + i,
          accumulatedPriceGains: accumulatedPriceGains,
        }
      } as CalculationIF;

      investedSumPerYear += parameters.yearlyInvestmentIncrease;
    }

    return result;
  }
}
