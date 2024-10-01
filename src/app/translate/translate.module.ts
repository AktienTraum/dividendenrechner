import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {provideHttpClient} from "@angular/common/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {StaticTranslationLoader} from "./static-translations-loader";

//
// see https://www.codeandweb.com/babeledit/tutorials/how-to-translate-your-angular-app-with-ngx-translate
//

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      defaultLanguage: 'de',
      loader: {
        provide: TranslateLoader,
        useClass: StaticTranslationLoader,
      },
    }),
  ],
  providers: [provideHttpClient()],
  exports: [TranslateModule],
})

export class NgxTranslateModule {
}
