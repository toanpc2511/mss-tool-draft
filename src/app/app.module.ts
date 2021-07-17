import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { SplashScreenModule } from './_metronic/partials/layout/splash-screen/splash-screen.module';
import { ToastrModule } from 'ngx-toastr';
import { AuthService } from './modules/auth/services/auth.service';
import { DestroyService } from './shared/services/destroy.service';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

function appInitializer(authService: AuthService, router: Router) {
  return () => {
    return new Promise((resolve) => {
      authService.getLoggedUser().subscribe(
        (currentUser) => {
          if (currentUser?.changePassword) {
            router.navigate(['/auth/first-login']);
          }
          resolve(true);
        },
        finalize(() => resolve(false))
      );
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
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    ToastrModule.forRoot({
      closeButton: true,
      progressBar: true,
      timeOut: 3000,
      positionClass: 'toast-bottom-right'
    }),
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
