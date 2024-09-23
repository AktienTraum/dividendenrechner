import {ChangeDetectionStrategy, Component, numberAttribute} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatStep, MatStepper} from "@angular/material/stepper";
import {MAT_DIALOG_DEFAULT_OPTIONS} from "@angular/material/dialog";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {MatFabButton} from "@angular/material/button";
import {NgIf} from "@angular/common";

export interface Share {
  purchasePrice: number,
  currentPrice: number,
  priceIncrease: number,
  dividendPercentage: number,
  dividendPayout: number,
}

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatStep, MatStepper, ReactiveFormsModule, FormsModule, MatSlider, MatSliderThumb, MatFabButton, NgIf],
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

  getUntilYear() {
    return this.currentYear + this.getYears();
  }

  getYears(): number {
    return this.calculatorForm.controls['years'].value;
  }

  doCalculate() {
    console.log('calculate!');
    this.showResult = true;
  }
}
