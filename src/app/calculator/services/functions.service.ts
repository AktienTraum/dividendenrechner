import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor() {
  }

  public currentYear() {
    return new Date().getFullYear();
  }

  public calculateDividendPayout(stockAmount: number, currentDividendPerShare: number) {
    return stockAmount * currentDividendPerShare;
  }

  public calculateStockAmount(investment: number, stockPrice: number) {
    return investment / stockPrice;
  }

  public calculateInvestedDividendsFactor(dividendPayout: number, dividendReinvestmentPercentage: number) {
    return dividendPayout * dividendReinvestmentPercentage / 100;
  }

  public calculateTaxPayment(dividendPayout: number, taxPercentage: number, yearlyTaxFreeSum: number) {
    let taxRelevantSum = dividendPayout - yearlyTaxFreeSum;
    return taxRelevantSum * taxPercentage / 100;
  }
}
