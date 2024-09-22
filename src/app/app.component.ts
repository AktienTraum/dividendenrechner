import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {CalculatorComponent} from "./calculator/calculator.component";
import {MatIcon} from "@angular/material/icon";
import {ImprintComponent} from "./imprint/imprint.component";
import {PrivacyPolicyComponent} from "./privacy-policy/privacy-policy.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CalculatorComponent, MatIcon, ImprintComponent, PrivacyPolicyComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  currentPage = 'calculator';

  constructor(private router: Router) {
  }

  openGithub() {
    window.open('https://github.com/AktienTraum/dividendenrechner', '_blank');
  }


  showCalculator() {
    this.router.navigate(['/calculator']);
  }

  showImpressum() {
    this.router.navigate(['/imprint']);
  }

  showPrivacyPolicy() {
    this.router.navigate(['/privacy-policy']);
  }

  calculatorPage() {
    return this.router.url.includes('calculator') || this.router.url == '/';
  }

  imprintPage() {
    return this.router.url.includes('imprint');
  }

  privacyPolicyPage() {
    return this.router.url.includes('privacy-policy');
  }
}
