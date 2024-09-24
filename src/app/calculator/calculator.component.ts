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
import {CalculatorService} from "./calculator.service";
import {ParameterIF} from "../common/parameter-if";
import {CalculationIF} from "../common/calculation-if";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatTooltip} from "@angular/material/tooltip";


@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatStep, MatStepper, ReactiveFormsModule, FormsModule, MatSlider, MatSliderThumb, MatFabButton, NgIf, NgForOf, DecimalPipe, MatSlideToggle, MatTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css',
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {panelClass: 'mat-field-inside-dialog-workaround'}},
  ]
})

export class CalculatorComponent {

  calculatorForm!: FormGroup;
  showResult = false;
  showStockColumns = false;

  currentYear!: number;

  result: CalculationIF[] = [];

  constructor(private calculatorService: CalculatorService) {
    this.currentYear = new Date().getFullYear();
    this.initForm();

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
    } as ParameterIF);
  }

  getUntilYear() {
    return this.currentYear + this.getYears();
  }

  getYears(): number {
    return this.calculatorForm.controls['years'].value;
  }
}
