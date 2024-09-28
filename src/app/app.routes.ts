import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from "./app.component";
import {NgModule} from "@angular/core";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {NgxTranslateModule} from "./translate/translate.module";

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
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
