import {Injectable} from '@angular/core';
import {CalculationIF} from "../interfaces/calculation-if";
import {LineseriesIf} from "../interfaces/lineseries-if";

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  constructor() {
  }

  getPaymentData(result: CalculationIF[],
                 currentYear: number,
                 legend1: string,
                 legend2: string,
                 legend3: string) {
    let dividendSeries = result
      .filter(x => x.kpis.year != currentYear)
      .map(x => ({
        value: x.kpis.dividendPayoutReinvested,
        name: x.kpis.year.toString()
      } as LineseriesIf));

    let investedSeries = result
      .filter(x => x.kpis.year != currentYear)
      .map(x => ({
        value: x.kpis.investedSumPerYear,
        name: x.kpis.year.toString()
      } as LineseriesIf));

    let totalSeries = result
      .filter(x => x.kpis.year != currentYear)
      .map(x => ({
        value: x.kpis.investedSumPerYear + x.kpis.dividendPayoutReinvested,
        name: x.kpis.year.toString()
      } as LineseriesIf));

    return [
      {
        name: legend1,
        series: dividendSeries
      },
      {
        name: legend2,
        series: investedSeries
      },
      {
        name: legend3,
        series: totalSeries
      },
    ];
  }

  getTotalAssetsData(result: CalculationIF[],
                     currentYear: number,
                     legend1: string,
                     legend2: string,
                     legend3: string) {

    let totalPayments = result
      .filter(x => x.kpis.year != currentYear)
      .map(x => ({
        value: x.kpis.accumulatedPayments,
        name: x.kpis.year.toString()
      } as LineseriesIf));

    let totalPaymentsIncludingDividendsSeries = result
      .filter(x => x.kpis.year != currentYear)
      .map(x => ({
        value: x.kpis.accumulatedPaymentsIncludingDividends,
        name: x.kpis.year.toString()
      } as LineseriesIf));

    let totalAssetsSeries = result
      .filter(x => x.kpis.year != currentYear)
      .map(x => ({
        value: x.kpis.accumulatedAssetsInclundingPriceGains,
        name: x.kpis.year.toString()
      } as LineseriesIf));

    return [
      {
        name: legend1,
        series: totalPayments
      },
      {
        name: legend2,
        series: totalPaymentsIncludingDividendsSeries
      },
      {
        name: legend3,
        series: totalAssetsSeries
      },
    ];
  }
}
