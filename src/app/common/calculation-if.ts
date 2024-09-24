import {SharesIF} from "./shares-if";
import {KpiIF} from "./kpi-if";

export interface CalculationIF {
  shares: SharesIF,
  kpis: KpiIF,
}
