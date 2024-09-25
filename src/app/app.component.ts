import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {CalculatorComponent} from "./calculator/calculator.component";
import {MatIcon} from "@angular/material/icon";
import {ImprintComponent} from "./imprint/imprint.component";
import {PrivacyPolicyComponent} from "./privacy-policy/privacy-policy.component";
import {registerLocaleData} from "@angular/common";
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {CommunityComponent} from "./community/community.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CalculatorComponent, MatIcon, ImprintComponent, PrivacyPolicyComponent, CommunityComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private router: Router) {
    registerLocaleData(localeDe, 'de-DE', localeDeExtra);
  }

  openGithub() {
    window.open('https://github.com/AktienTraum/dividendenrechner', '_blank');
  }

  showCalculator() {
    this.router.navigate(['/calculator']);
  }

  showCommunity() {
    this.router.navigate(['/community']);
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

  communityPage() {
    return this.router.url.includes('community');
  }

  imprintPage() {
    return this.router.url.includes('imprint');
  }

  privacyPolicyPage() {
    return this.router.url.includes('privacy-policy');
  }
}
