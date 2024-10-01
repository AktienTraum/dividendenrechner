import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {CalculatorComponent} from "./calculator/calculator.component";
import {MatIcon} from "@angular/material/icon";
import {ImprintComponent} from "./imprint/imprint.component";
import {PrivacyPolicyComponent} from "./privacy-policy/privacy-policy.component";
import {registerLocaleData} from "@angular/common";
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {CommunityComponent} from "./community/community.component";
import {NewsComponent} from "./news/news.component";
import {DocumentationComponent} from "./documentation/documentation.component";
import {TranslateService} from "@ngx-translate/core";
import {NgxTranslateModule} from "./translate/translate.module";
import {NgToastModule, ToasterPosition} from "ng-angular-popup";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgToastModule, NgxTranslateModule, RouterOutlet, CalculatorComponent, MatIcon, ImprintComponent, PrivacyPolicyComponent, CommunityComponent, NewsComponent, DocumentationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  ToasterPosition = ToasterPosition;

  constructor(private router: Router, private translate: TranslateService) {
    registerLocaleData(localeDe, 'de-DE', localeDeExtra);
  }

  ngOnInit(): void {
    this.switchToGerman();
  }

  switchToGerman() {
    this.translate.use('de');
    this.translate.get('dialog.save.title').subscribe((translated: string) => {
    });
  }

  switchToEnglish() {
    this.translate.use('en');
  }

  showCalculator() {
    this.router.navigate(['/calculator']);
  }

  showCommunity() {
    this.router.navigate(['/community']);
  }

  showNews() {
    this.router.navigate(['/news']);
  }

  showDocumentation() {
    this.router.navigate(['/documentation']);
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

  newsPage() {
    return this.router.url.includes('news');
  }

  documentationPage() {
    return this.router.url.includes('documentation');
  }

  imprintPage() {
    return this.router.url.includes('imprint');
  }

  privacyPolicyPage() {
    return this.router.url.includes('privacy-policy');
  }
}
