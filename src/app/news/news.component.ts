import {Component, Input} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {NgxTranslateModule} from "../translate/translate.module";

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [
    MatIcon,
    MatCard,
    MatCardHeader,
    MatCardContent,
    NgxTranslateModule
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent {

  @Input()
  showFull = true;

}
