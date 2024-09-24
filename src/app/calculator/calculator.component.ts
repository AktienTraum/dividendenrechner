import {ChangeDetectionStrategy, Component, numberAttribute} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatStep, MatStepper} from "@angular/material/stepper";
import {MAT_DIALOG_DEFAULT_OPTIONS} from "@angular/material/dialog";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {MatFabButton} from "@angular/material/button";
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";

export interface ShareSimulation {
  payment: number,
  amount: number,
  purchasePrice: number,
}

export interface YearlyKPIs {
  stockAmount: number,
  dividendPayout: number,
  dividendPercentage: number,
  accumulatedPayments: number,
  accumulatedDividendPayout: number,
}

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatStep, MatStepper, ReactiveFormsModule, FormsModule, MatSlider, MatSliderThumb, MatFabButton, NgIf, NgForOf, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css',
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {panelClass: 'mat-field-inside-dialog-workaround'}},
  ]
})


export class CalculatorComponent {

  calculatorForm!: FormGroup;

  currentYear!: number;
  showResult = false;

  initialStockPrice = 50;

  simulationPerYear: ShareSimulation[] = [];
  kpisPerYear: YearlyKPIs[] = [];

  constructor() {
    this.currentYear = new Date().getFullYear();
    this.initForm();

  }

  initForm() {
    this.calculatorForm = new FormGroup({
      initialInvestment: new FormControl(numberAttribute(10000)),
      yearlyInvestment: new FormControl(numberAttribute(1000)),
      yearlyIncrease: new FormControl(numberAttribute(100)),
      dividendReinvestmentPercentage: new FormControl(numberAttribute(100)),
      dividendPercentage: new FormControl(numberAttribute(3.5)),
      dividendPercentageIncrease: new FormControl(numberAttribute(5)),
      years: new FormControl(numberAttribute(10)),
    });
  }

  doCalculate() {
    this.showResult = true;

    let accumulatedPayment = this.getInitialInvestment();
    let currentStockPrice = this.initialStockPrice;
    let currentDividendPercentage = this.getDividendPercentage();

    this.simulationPerYear[0] = this.getInitialShares();
    this.kpisPerYear[0] = {
      stockAmount: this.simulationPerYear[0].amount,
      dividendPayout: this.simulationPerYear[0].amount * this.simulationPerYear[0].purchasePrice * currentDividendPercentage / 100,
      dividendPercentage: currentDividendPercentage,
      accumulatedPayments: accumulatedPayment,
      accumulatedDividendPayout: this.simulationPerYear[0].amount * this.simulationPerYear[0].purchasePrice * currentDividendPercentage / 100,
    } as YearlyKPIs;

    let stockAmount = this.simulationPerYear[0].amount;
    let accumulatedDividendPayout = this.kpisPerYear[0].accumulatedDividendPayout;

    let investedSumPerYear = this.getYearlyInvestment()
    for (let i = 1; i <= this.getYears(); i++) {
      currentDividendPercentage = currentDividendPercentage * (1 + (this.getDividendPercentageIncrease() / 100));

      accumulatedPayment += investedSumPerYear;

      this.simulationPerYear[i] = {
        payment: investedSumPerYear,
        amount: investedSumPerYear / currentStockPrice,
        purchasePrice: currentStockPrice,
      } as ShareSimulation;

      stockAmount += this.simulationPerYear[i].amount;
      accumulatedDividendPayout += stockAmount * this.simulationPerYear[i].purchasePrice * currentDividendPercentage / 100;

      this.kpisPerYear[i] = {
        stockAmount: stockAmount,
        dividendPayout: stockAmount * this.simulationPerYear[i].purchasePrice * currentDividendPercentage / 100,
        dividendPercentage: currentDividendPercentage,
        accumulatedPayments: accumulatedPayment,
        accumulatedDividendPayout: accumulatedDividendPayout,
      } as YearlyKPIs;

      investedSumPerYear += this.getYearlyIncrease();
    }
  }

  getInitialShares() {
    return {
      payment: this.getInitialInvestment(),
      amount: this.getInitialInvestment() / this.initialStockPrice,
      purchasePrice: this.initialStockPrice,
      currentPrice: this.initialStockPrice,
      priceIncrease: 0,
      dividendPercentage: this.getDividendPercentage(),
      dividendPayout: this.getInitialInvestment() / this.initialStockPrice * this.getDividendPercentage() / 100,
    } as ShareSimulation;
  }

  getUntilYear() {
    return this.currentYear + this.getYears();
  }

  getYears(): number {
    return this.calculatorForm.controls['years'].value;
  }

  getInitialInvestment(): number {
    return this.calculatorForm.controls['initialInvestment'].value;
  }

  getYearlyInvestment(): number {
    return this.calculatorForm.controls['yearlyInvestment'].value;
  }

  getYearlyIncrease(): number {
    return this.calculatorForm.controls['yearlyIncrease'].value;
  }

  getDividendReinvestmentPercentage(): number {
    return this.calculatorForm.controls['dividendReinvestmentPercentage'].value;
  }

  getDividendPercentage(): number {
    return this.calculatorForm.controls['dividendPercentage'].value;
  }

  getDividendPercentageIncrease(): number {
    return this.calculatorForm.controls['dividendPercentageIncrease'].value;
  }
}
