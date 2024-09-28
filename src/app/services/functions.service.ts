import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor() {
  }

  public calculateDividendPercentage(currentDividendPercentage: number, dividendPercentageIncrease: number) {
    return currentDividendPercentage * (1 + (dividendPercentageIncrease / 100));
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
}
