import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { ClipboardModule } from 'ngx-clipboard';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/services/auth.service';
import { NgSelectModule } from './shared/components/ng-select/public-api';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { LoadingInterceptor } from './shared/interceptors/loading.interceptor';
import { SplashScreenModule } from './_metronic/partials/layout/splash-screen/splash-screen.module';

import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import localeViExtra from '@angular/common/locales/extra/vi';
import { CustomAdapter, CustomDateParserFormatter } from './shared/helpers/datepicker-adapter';
import { TextMaskModule } from 'angular2-text-mask';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import timeGridPlugin from '@fullcalendar/timegrid';

registerLocaleData(localeVi, 'vi', localeViExtra);

FullCalendarModule.registerPlugins([bootstrapPlugin, dayGridPlugin, timeGridPlugin]);

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
			timeOut: 3500,
			maxOpened: 4,
			positionClass: 'toast-bottom-right',
			preventDuplicates: true
		}),
		NgxSpinnerModule,
		NgSelectModule,
		FormsModule,
		TextMaskModule,
		FullCalendarModule
	],
	providers: [
		{ provide: LOCALE_ID, useValue: 'vi' },
		{ provide: NgbDateAdapter, useClass: CustomAdapter },
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
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
		{
			provide: HTTP_INTERCEPTORS,
			useClass: LoadingInterceptor,
			multi: true
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
