import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InlineSVGModule } from 'ng-inline-svg';
import { ClipboardModule } from 'ngx-clipboard';
// Highlight JS
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { ToastrModule } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/services/auth.service';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { DestroyService } from './shared/services/destroy.service';
// #fake-start#
import { FakeAPIService } from './_fake/fake-api.service';
import { SplashScreenModule } from './_metronic/partials/layout/splash-screen/splash-screen.module';
// #fake-end#

function appInitializer(authService: AuthService, router: Router) {
  return () => {
    return new Promise((resolve) => {
      authService.getLoggedUser().subscribe().add(resolve);
    });
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SplashScreenModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    HighlightModule,
    ClipboardModule,
    // #fake-start#
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forRoot(FakeAPIService, {
          passThruUnknownUrl: true,
          dataEncapsulation: false
        })
      : [],
    // #fake-end#
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    ToastrModule.forRoot({
      closeButton: true,
      progressBar: true,
      timeOut: 3000,
      positionClass: 'toast-bottom-right'
    })
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService, Router]
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          xml: () => import('highlight.js/lib/languages/xml'),
          typescript: () => import('highlight.js/lib/languages/typescript'),
          scss: () => import('highlight.js/lib/languages/scss'),
          json: () => import('highlight.js/lib/languages/json')
        }
      }
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    DestroyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
