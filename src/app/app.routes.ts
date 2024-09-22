import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from "./app.component";
import {NgModule} from "@angular/core";

export const routes: Routes = [
  {path: '', component: AppComponent}, //default route
  {path: 'calculator', component: AppComponent},
  {path: 'imprint', component: AppComponent},
  {path: 'privacy-policy', component: AppComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
