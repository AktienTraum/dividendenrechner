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
  amount: number,
  purchaseValue: number,
  currentValue: number,
  priceIncrease: number,
  dividendPercentage: number,
  dividendPayout: number,
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
  yearCounter!: number;
  showResult = false;

  initialShareValue = 50;

  simulationPerYear: ShareSimulation[] = [];

  constructor() {
    this.currentYear = new Date().getFullYear();
    this.yearCounter = this.currentYear;
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
    this.simulationPerYear[0] = this.getInitialShares();

    let investedSumPerYear = this.getYearlyInvestment()
    for (let i = 1; i <= this.getYears(); i++) {
      let share = {
        amount: investedSumPerYear / this.initialShareValue,
        purchaseValue: this.initialShareValue,
        currentValue: this.initialShareValue,
        priceIncrease: 0,
        dividendPercentage: this.getDividendPercentage(),
        dividendPayout: investedSumPerYear * this.getDividendPercentage() / 100,
      } as ShareSimulation;

      this.simulationPerYear[i] = share;

      investedSumPerYear += this.getYearlyIncrease();
    }
  }

  getInitialShares() {
    return {
      amount: this.getInitialInvestment() / this.initialShareValue,
      purchaseValue: this.initialShareValue,
      currentValue: this.initialShareValue,
      priceIncrease: 0,
      dividendPercentage: this.getDividendPercentage(),
      dividendPayout: this.getInitialInvestment() * this.getDividendPercentage() / 100,
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


  getAndIncreaseYear() {
    return this.yearCounter++;
  }
}
