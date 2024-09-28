import {Component} from '@angular/core';
import {NgxTranslateModule} from "../translate/translate.module";

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [
    NgxTranslateModule
  ],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.css'
})
export class ImprintComponent {

}
