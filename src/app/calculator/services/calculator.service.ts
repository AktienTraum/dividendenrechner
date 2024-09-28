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
    let currentDividendPerShare = currentStockPrice * parameters.initialDividendPercentage / 100;

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

      // Adjust to shares bought (we assume we can buy them during the year and not only at the end)
      dividendPayout += dividendPayoutFromStocksBoughtFromDividends;
      accumulatedStockAmount += stocksBoughtFromDividens;
      yearlyStockAmount += stocksBoughtFromDividens

      // Adjust to taxes on dividends
      if (dividendPayout > parameters.yearlyTaxFreeSum) {
        let taxRelevantSum = dividendPayout - parameters.yearlyTaxFreeSum;
        let taxPayment = taxRelevantSum * parameters.taxPercentage / 100;
        let stocksBoughtFromTaxPayment = this.functions.calculateStockAmount(taxPayment, currentStockPrice);

        dividendPayout -= taxPayment;
        accumulatedStockAmount -= stocksBoughtFromTaxPayment;
        yearlyStockAmount -= stocksBoughtFromTaxPayment;
      }

      let investedDividendFactor =
        this.functions.calculateInvestedDividendsFactor(dividendPayout, parameters.dividendReinvestmentPercentage);

      let averageStockPrice = (result[i - 1].shares.averagePurchasePrice * result[i - 1].kpis.accumulatedStockAmount
        + yearlyStockAmount * currentStockPrice) / (result[i - 1].kpis.accumulatedStockAmount + yearlyStockAmount);

      accumulatedPriceGains =
        parameters.initialPriceGains + (averageStockPrice * accumulatedStockAmount * parameters.priceGainPercentage / 100);
      accumulatedPayments += investedSumPerYear;
      accumulatedPaymentsIncludingDividends += investedSumPerYear + dividendPayout;
      accumulatedAssetsInclundingPriceGains = accumulatedPaymentsIncludingDividends + accumulatedPriceGains

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
          dividendPayoutReinvested: investedDividendFactor,
          dividendPercentage: currentDividendPerShare / currentStockPrice * 100,
          accumulatedPayments: accumulatedPayments,
          accumulatedPaymentsIncludingDividends: accumulatedPaymentsIncludingDividends,
          accumulatedAssetsInclundingPriceGains: accumulatedAssetsInclundingPriceGains,
          yearlyInvestmentToReinvestedDividendFactor: investedDividendFactor / investedSumPerYear,
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
