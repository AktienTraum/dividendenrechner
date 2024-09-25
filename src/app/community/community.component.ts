import {Component} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [
    MatIcon,
    MatCard,
    MatCardContent,
    MatCardHeader
  ],
  templateUrl: './community.component.html',
  styleUrl: './community.component.css'
})
export class CommunityComponent {

}
