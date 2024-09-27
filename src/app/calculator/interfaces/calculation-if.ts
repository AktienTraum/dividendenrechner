import {SharesIF} from "./shares-if";
import {KpiIF} from "./kpi-if";
import {DividendIF} from "./dividend-if";

export interface CalculationIF {
  dividend: DividendIF,
  shares: SharesIF,
  kpis: KpiIF,
}
