import {ChangeDetectionStrategy, Component, numberAttribute, OnInit} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatStep, MatStepper} from "@angular/material/stepper";
import {MAT_DIALOG_DEFAULT_OPTIONS} from "@angular/material/dialog";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {MatFabButton} from "@angular/material/button";
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {CalculatorService} from "./calculator.service";
import {ParameterIF} from "./interfaces/parameter-if";
import {CalculationIF} from "./interfaces/calculation-if";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatTooltip} from "@angular/material/tooltip";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {BarChartModule, LineChartModule} from "@swimlane/ngx-charts";
import {SeriesIF} from "./interfaces/series-if";
import {NewsComponent} from "../news/news.component";


@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatStep, MatStepper, ReactiveFormsModule, FormsModule, MatSlider, MatSliderThumb, MatFabButton, NgIf, NgForOf, DecimalPipe, MatSlideToggle, MatTooltip, MatCard, MatCardContent, MatCardHeader, BarChartModule, LineChartModule, NewsComponent],
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
  legendTitle = 'Legende';

  constructor(private calculatorService: CalculatorService) {
    this.currentYear = new Date().getFullYear();
    this.initForm();
  }

  ngOnInit(): void {
    this.calculatorForm.valueChanges.subscribe(value => {
      this.showResult = false;
    });
  }

  initForm() {
    this.calculatorForm = new FormGroup({
      initialInvestment: new FormControl(numberAttribute(10000)),
      yearlyInvestment: new FormControl(numberAttribute(1000)),
      yearlyInvestmentIncrease: new FormControl(numberAttribute(100)),
      dividendReinvestmentPercentage: new FormControl(numberAttribute(100)),
      initialDividendPercentage: new FormControl(numberAttribute(3.5)),
      yearlyDividendPercentageIncrease: new FormControl(numberAttribute(5)),
      years: new FormControl(numberAttribute(10)),
      priceGainPercentage: new FormControl(numberAttribute(3)),
    });
  }

  doCalculate() {
    this.showResult = true;
    this.result = this.calculatorService.calculate({
      initialInvestment: this.calculatorForm.controls['initialInvestment'].value,
      yearlyInvestment: this.calculatorForm.controls['yearlyInvestment'].value,
      yearlyInvestmentIncrease: this.calculatorForm.controls['yearlyInvestmentIncrease'].value,
      dividendReinvestmentPercentage: this.calculatorForm.controls['dividendReinvestmentPercentage'].value,
      initialDividendPercentage: this.calculatorForm.controls['initialDividendPercentage'].value,
      yearlyDividendPercentageIncrease: this.calculatorForm.controls['yearlyDividendPercentageIncrease'].value,
      years: this.calculatorForm.controls['years'].value,
      currentYear: this.currentYear,
      priceGainPercentage: this.calculatorForm.controls['priceGainPercentage'].value,
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
        name: "Dividenden",
        series: dividendSeries
      },
      {
        name: "Investiert",
        series: investedSeries
      },
    ];
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
    return this.calculatorService.calculateDividendPercentage(
      this.result[this.getYears()].kpis.dividendPercentage,
      this.calculatorForm.controls['yearlyDividendPercentageIncrease'].value);
  }

  getFinalDividendIncome() {
    return this.calculatorService.calculateDividendPayout(
      this.result[this.getYears()].kpis.accumulatedStockAmount + this.result[this.getYears()].shares.stocksBoughtFromDividends,
      this.result[this.getYears()].dividend.currentDividendPerShare);
  }

  currencyFormatterLC(moneyAmount: any): string {
    const currencyFormat = new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    });
    return currencyFormat.format(moneyAmount);
  }
}
