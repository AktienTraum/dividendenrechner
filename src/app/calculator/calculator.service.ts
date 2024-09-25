import {Injectable} from '@angular/core';
import {CalculationIF} from "./interfaces/calculation-if";
import {ParameterIF} from "./interfaces/parameter-if";


@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  constructor() {
  }


  calculate(parameters: ParameterIF): CalculationIF[] {
    let currentStockPrice = 50;
    let currentDividendPercentage = parameters.initialDividendPercentage;

    let result: CalculationIF[] = [];

    result[0] = this.calculateCurrentYear(
      parameters.initialInvestment,
      parameters.initialDividendPercentage,
      currentStockPrice);

    let accumulatedStockAmount = result[0].shares.stockAmount;
    let accumulatedPayments = result[0].kpis.accumulatedPayments;
    let accumulatedPaymentsIncludingDividends = accumulatedPayments;
    let investedSumPerYear = parameters.yearlyInvestment;

    for (let i = 1; i <= parameters.years; i++) {
      accumulatedPayments += investedSumPerYear;
      accumulatedPaymentsIncludingDividends += investedSumPerYear;

      currentDividendPercentage = this.calculateDividendPercentage(
        currentDividendPercentage,
        parameters.yearlyDividendPercentageIncrease);

      let yearlyStockAmount = this.calculateStockAmount(investedSumPerYear, currentStockPrice);
      accumulatedStockAmount += yearlyStockAmount + result[i - 1].shares.stocksBoughtFromDividends;

      let dividendPayout = this.calculateDividendPayout(accumulatedStockAmount, currentStockPrice, currentDividendPercentage);
      let dividendPayoutWithPreviousDividendPercentage =
        this.calculateDividendPayout(accumulatedStockAmount, currentStockPrice, result[i - 1].kpis.dividendPercentage);
      let stocksBoughtFromDividens = this.calculateStockAmount(dividendPayout, currentStockPrice);
      let investedDividends = this.calculateInvestedDividends(dividendPayout, parameters.dividendReinvestmentPercentage);

      accumulatedPaymentsIncludingDividends += dividendPayout;

      result[i] = {
        shares: {
          payment: investedSumPerYear,
          stockAmount: yearlyStockAmount,
          stocksBoughtFromDividends: stocksBoughtFromDividens,
          purchasePrice: currentStockPrice
        },
        kpis: {
          accumulatedStockAmount: accumulatedStockAmount,
          dividendPayout: dividendPayout,
          dividendPayoutReinvested: investedDividends,
          dividendPercentage: currentDividendPercentage,
          accumulatedPayments: accumulatedPayments,
          accumulatedPaymentsIncludingDividends: accumulatedPaymentsIncludingDividends,
          yearlyInvestmentToReinvestedDividendFactor: investedDividends / investedSumPerYear,
          yearlyAbsoluteDividendGrowth: dividendPayout - dividendPayoutWithPreviousDividendPercentage,
        }
      } as CalculationIF;

      investedSumPerYear += parameters.yearlyInvestmentIncrease;
    }

    return result;
  }

  private calculateCurrentYear(initialInvestment: number,
                               dividendPercentage: number,
                               currentStockPrice: number): CalculationIF {

    const initialStockAmount = this.calculateStockAmount(initialInvestment, currentStockPrice);
    const dividendPayout = this.calculateDividendPayout(initialStockAmount, currentStockPrice, dividendPercentage);

    return {
      shares: {
        payment: initialInvestment,
        stockAmount: initialStockAmount,
        stocksBoughtFromDividends: 0,
        purchasePrice: currentStockPrice,
      },
      kpis: {
        accumulatedStockAmount: initialStockAmount,
        dividendPayout: dividendPayout,
        dividendPayoutReinvested: dividendPayout,
        dividendPercentage: dividendPercentage,
        accumulatedDividendPayout: dividendPayout,
        accumulatedPayments: initialInvestment,
        accumulatedPaymentsIncludingDividends: initialInvestment,
        yearlyInvestmentToReinvestedDividendFactor: 0,
        yearlyAbsoluteDividendGrowth: 0,
      }
    } as CalculationIF;
  }

  private calculateStockAmount(investment: number, stockPrice: number) {
    return investment / stockPrice;
  }

  private calculateDividendPayout(stockAmount: number, stockPrice: number, dividendPercentage: number) {
    return stockAmount * stockPrice * dividendPercentage / 100;
  }

  private calculateDividendPercentage(currentDividendPercentage: number, dividendPercentageIncrease: number) {
    return currentDividendPercentage * (1 + (dividendPercentageIncrease / 100));
  }

  private calculateInvestedDividends(dividendPayout: number, dividendReinvestmentPercentage: number) {
    return dividendPayout * dividendReinvestmentPercentage / 100;
  }
}
