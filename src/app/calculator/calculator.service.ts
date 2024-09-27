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
    let currentDividendPerShare = currentStockPrice * currentDividendPercentage / 100;

    let result: CalculationIF[] = [];

    result[0] = this.calculateCurrentYear(
      parameters.initialInvestment,
      parameters.initialDividendPercentage,
      currentStockPrice,
      currentDividendPerShare,
      parameters.currentYear);

    let accumulatedStockAmount = result[0].shares.stockAmount;
    let accumulatedPayments = result[0].kpis.accumulatedPayments;
    let accumulatedPaymentsIncludingDividends = accumulatedPayments;
    let investedSumPerYear = parameters.yearlyInvestment;

    for (let i = 1; i <= parameters.years; i++) {
      currentStockPrice = currentStockPrice + (currentStockPrice * parameters.priceGainPercentage / 100);
      currentDividendPerShare = currentDividendPerShare + (currentDividendPerShare * parameters.yearlyDividendPercentageIncrease / 100);

      accumulatedPayments += investedSumPerYear;
      accumulatedPaymentsIncludingDividends += investedSumPerYear;

      let yearlyStockAmount = this.calculateStockAmount(investedSumPerYear, currentStockPrice);
      accumulatedStockAmount += yearlyStockAmount + result[i - 1].shares.stocksBoughtFromDividends;

      let dividendPayout = this.calculateDividendPayout(accumulatedStockAmount, currentDividendPerShare);
      let stocksBoughtFromDividens = this.calculateStockAmount(dividendPayout, currentStockPrice);
      let investedDividends = this.calculateInvestedDividends(dividendPayout, parameters.dividendReinvestmentPercentage);

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

  public calculateDividendPercentage(currentDividendPercentage: number, dividendPercentageIncrease: number) {
    return currentDividendPercentage * (1 + (dividendPercentageIncrease / 100));
  }

  public calculateDividendPayout(stockAmount: number, currentDividendPerShare: number) {
    return stockAmount * currentDividendPerShare;
  }

  private calculateCurrentYear(initialInvestment: number,
                               dividendPercentage: number,
                               currentStockPrice: number,
                               currentDividendPerShare: number,
                               currentYear: number): CalculationIF {

    const initialStockAmount = this.calculateStockAmount(initialInvestment, currentStockPrice);
    const dividendPayout = this.calculateDividendPayout(initialStockAmount, currentDividendPerShare);

    return {
      dividend: {
        currentDividendPerShare: currentDividendPerShare,
      },
      shares: {
        payment: initialInvestment,
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
        dividendPercentage: dividendPercentage,
        accumulatedDividendPayout: dividendPayout,
        accumulatedPayments: initialInvestment,
        accumulatedPaymentsIncludingDividends: initialInvestment,
        yearlyInvestmentToReinvestedDividendFactor: 0,
        yearlyAbsoluteDividendGrowth: 0,
        year: currentYear,
      }
    } as CalculationIF;
  }

  private calculateStockAmount(investment: number, stockPrice: number) {
    return investment / stockPrice;
  }

  private calculateInvestedDividends(dividendPayout: number, dividendReinvestmentPercentage: number) {
    return dividendPayout * dividendReinvestmentPercentage / 100;
  }
}
