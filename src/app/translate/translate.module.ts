import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient, provideHttpClient} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http,
    './i18n/',
    '.json');
}


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      defaultLanguage: 'de',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [provideHttpClient()],
  exports: [TranslateModule],
})

export class NgxTranslateModule {
}
