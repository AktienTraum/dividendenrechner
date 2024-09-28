import {Component} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {NgxTranslateModule} from "../translate/translate.module";

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatIcon,
    NgxTranslateModule
  ],
  templateUrl: './documentation.component.html',
  styleUrl: './documentation.component.css'
})
export class DocumentationComponent {

}
