import {Injectable} from '@angular/core';
import {CalculationIF} from "../common/calculation-if";
import {ParameterIF} from "../common/parameter-if";


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

    let stockAmount = result[0].shares.stockAmount;
    let accumulatedDividendPayout = result[0].kpis.accumulatedDividendPayout;
    let accumulatedPayments = result[0].kpis.accumulatedPayments
    let investedSumPerYear = parameters.yearlyInvestment;

    for (let i = 1; i <= parameters.years; i++) {
      accumulatedPayments += investedSumPerYear;

      currentDividendPercentage = this.calculateDividendPercentage(
        currentDividendPercentage,
        parameters.yearlyDividendPercentageIncrease);

      stockAmount += investedSumPerYear / currentStockPrice;

      let dividendPayout = this.calculateDividendPayout(stockAmount, currentStockPrice, currentDividendPercentage);
      accumulatedDividendPayout += dividendPayout;

      result[i] = {
        shares: {
          payment: investedSumPerYear,
          stockAmount: stockAmount,
          purchasePrice: currentStockPrice
        },
        kpis: {
          stockAmount: stockAmount,
          dividendPayout: dividendPayout,
          dividendPercentage: currentDividendPercentage,
          accumulatedPayments: accumulatedPayments,
          accumulatedDividendPayout: accumulatedDividendPayout,
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
        purchasePrice: currentStockPrice,
      },
      kpis: {
        stockAmount: initialStockAmount,
        dividendPayout: dividendPayout,
        dividendPercentage: dividendPercentage,
        accumulatedDividendPayout: dividendPayout,
        accumulatedPayments: initialInvestment,
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
}
