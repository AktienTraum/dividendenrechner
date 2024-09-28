import {Component} from '@angular/core';
import {NgxTranslateModule} from "../translate/translate.module";

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [
    NgxTranslateModule
  ],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.css'
})
export class PrivacyPolicyComponent {

}
