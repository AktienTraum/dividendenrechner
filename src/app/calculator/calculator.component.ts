import {ChangeDetectionStrategy, Component, numberAttribute, OnInit} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MAT_DIALOG_DEFAULT_OPTIONS} from "@angular/material/dialog";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {MatFabButton} from "@angular/material/button";
import {DecimalPipe, NgClass, NgForOf, NgIf, ViewportScroller} from "@angular/common";
import {CalculatorService} from "./services/calculator.service";
import {ParameterIF} from "./interfaces/parameter-if";
import {CalculationIF} from "./interfaces/calculation-if";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatTooltip} from "@angular/material/tooltip";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {BarChartModule, LineChartModule} from "@swimlane/ngx-charts";
import {SeriesIF} from "./interfaces/series-if";
import {NewsComponent} from "../news/news.component";
import {FunctionsService} from "./services/functions.service";
import {NgxTranslateModule} from "../translate/translate.module";
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule, FormsModule, MatSlider, MatSliderThumb, MatFabButton, NgIf, NgForOf, DecimalPipe, MatSlideToggle, MatTooltip, MatCard, MatCardContent, MatCardHeader, BarChartModule, LineChartModule, NewsComponent, NgClass, NgxTranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css',
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {panelClass: 'mat-field-inside-dialog-workaround'}},
  ]
})

export class CalculatorComponent implements OnInit {

  calculatorForm!: FormGroup;
  showResult = false;
  showStockColumns = false;

  currentYear!: number;

  result: CalculationIF[] = [];

  data: any;
  view: [number, number] = [900, 450];

  constructor(
    functions: FunctionsService,
    private translate: TranslateService,
    private calculatorService: CalculatorService,
    private viewportScroller: ViewportScroller) {
    this.currentYear = functions.currentYear();
    this.initForm();
  }

  ngOnInit(): void {
    this.calculatorForm.valueChanges.subscribe(value => {
      this.showResult = false;
    });

    // Just to load the translation
    this.translate.get('calculator.result.firstrow-tt').subscribe((translated: string) => {
    });
    this.translate.get('calculator.graph.legend').subscribe((translated: string) => {
    });
    this.translate.get('calculator.graph.value-1').subscribe((translated: string) => {
    });
    this.translate.get('calculator.graph.value-2').subscribe((translated: string) => {
    });
  }

  initForm() {
    this.calculatorForm = new FormGroup({
      initialInvestment: new FormControl(numberAttribute(10000)),
      initialPriceGains: new FormControl(numberAttribute(300)),
      yearlyInvestment: new FormControl(numberAttribute(1000)),
      yearlyInvestmentIncrease: new FormControl(numberAttribute(100)),
      dividendReinvestmentPercentage: new FormControl(numberAttribute(100)),
      initialDividendPercentage: new FormControl(numberAttribute(3.5)),
      yearlyDividendPercentageIncrease: new FormControl(numberAttribute(5)),
      years: new FormControl(numberAttribute(10)),
      priceGainPercentage: new FormControl(numberAttribute(3)),
      taxPercentage: new FormControl(numberAttribute(26, 375)),
      yearlyTaxFreeSum: new FormControl(numberAttribute(1000)),
    });
  }

  doCalculate() {
    this.showResult = true;
    this.result = this.calculatorService.calculate({
      initialInvestment: this.calculatorForm.controls['initialInvestment'].value,
      initialPriceGains: this.calculatorForm.controls['initialPriceGains'].value,
      yearlyInvestment: this.calculatorForm.controls['yearlyInvestment'].value,
      yearlyInvestmentIncrease: this.calculatorForm.controls['yearlyInvestmentIncrease'].value,
      dividendReinvestmentPercentage: this.calculatorForm.controls['dividendReinvestmentPercentage'].value,
      initialDividendPercentage: this.calculatorForm.controls['initialDividendPercentage'].value,
      yearlyDividendPercentageIncrease: this.calculatorForm.controls['yearlyDividendPercentageIncrease'].value,
      years: this.calculatorForm.controls['years'].value,
      currentYear: this.currentYear,
      priceGainPercentage: this.calculatorForm.controls['priceGainPercentage'].value,
      taxPercentage: this.calculatorForm.controls['taxPercentage'].value,
      yearlyTaxFreeSum: this.calculatorForm.controls['yearlyTaxFreeSum'].value,
    } as ParameterIF);

    let dividendSeries = this.result
      .filter(x => x.kpis.year != this.currentYear)
      .map(x => ({
        value: x.kpis.dividendPayout,
        name: x.kpis.year.toString()
      } as SeriesIF));

    let investedSeries = this.result
      .filter(x => x.kpis.year != this.currentYear)
      .map(x => ({
        value: x.shares.payment,
        name: x.kpis.year.toString()
      } as SeriesIF));

    this.data = [
      {
        name: this.translate.instant('calculator.graph.value-1'),
        series: dividendSeries
      },
      {
        name: this.translate.instant('calculator.graph.value-2'),
        series: investedSeries
      },
    ];

    this.viewportScroller.scrollToPosition([0, 0]);
  }

  getUntilYear() {
    return this.currentYear + this.getYears();
  }

  getYears(): number {
    return this.calculatorForm.controls['years'].value;
  }

  getAccumulatedDividends() {
    let sum = 0;
    this.result.forEach(y => sum += y.kpis.dividendPayout);
    return sum;
  }

  getAccumulatedDividendsReinvested() {
    let sum = 0;
    this.result.forEach(y => sum += y.kpis.dividendPayoutReinvested);
    return sum;
  }

  getFinalDividendPercentage() {
    return this.result[this.getYears()].kpis.dividendPercentage;
  }

  getFinalDividendIncome() {
    return this.result[this.getYears()].kpis.dividendPayout;
  }

  currencyFormatterLC(moneyAmount: any): string {
    const currencyFormat = new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    });
    return currencyFormat.format(moneyAmount);
  }

  contentRowTooltip(rowNum: number) {
    if (rowNum == 0) {
      return this.translate.instant('calculator.result.firstrow-tt');
    } else {
      return '';
    }
  }

  graphLegend() {
    return this.translate.instant('calculator.graph.legend');
  }

}
