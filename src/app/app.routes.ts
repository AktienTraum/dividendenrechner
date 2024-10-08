import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from "./app.component";
import {NgModule} from "@angular/core";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {NgxTranslateModule} from "./translate/translate.module";
import {MatDialogRef} from "@angular/material/dialog";
import {NgToastModule} from "ng-angular-popup";

export const routes: Routes = [
  {path: '', component: AppComponent}, //default route
  {path: 'calculator', component: AppComponent},
  {path: 'community', component: AppComponent},
  {path: 'news', component: AppComponent},
  {path: 'documentation', component: AppComponent},
  {path: 'imprint', component: AppComponent},
  {path: 'privacy-policy', component: AppComponent},
  {path: '**', component: AppComponent},
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, {scrollPositionRestoration: "enabled"}),
    NgxChartsModule,
    NgxTranslateModule,
    NgToastModule,
  ],
  exports: [RouterModule, NgxTranslateModule],
  providers: [MatDialogRef]
})

export class AppRoutingModule {
}
