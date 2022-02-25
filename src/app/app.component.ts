import firebase from 'firebase/app';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	OnDestroy,
	OnInit
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslationService } from './modules/i18n/translation.service';
// language list
import { locale as enLang } from './modules/i18n/vocabs/en';
import { locale as viLang } from './modules/i18n/vocabs/vi';
import { SplashScreenService } from './_metronic/partials/layout/splash-screen/splash-screen.service';
import { TableExtendedService } from './_metronic/shared/crud-table';
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'body[root]',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
	private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	constructor(
		private translationService: TranslationService,
		private splashScreenService: SplashScreenService,
		private router: Router,
		private tableService: TableExtendedService
	) {
		// register translations
		this.translationService.loadTranslations(viLang, enLang);
	}
	ngAfterViewInit(): void {
		setTimeout(() => {
			firebase.auth().languageCode = 'vi';
		}, 3000);
	}

	ngOnInit() {
		const routerSubscription = this.router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				// clear filtration paginations and others
				this.tableService.setDefaults();
				// hide splash screen
				this.splashScreenService.hide();

				// scroll to top on every route change
				window.scrollTo(0, 0);

				// to display back the body content
				setTimeout(() => {
					document.body.classList.add('page-loaded');
				}, 200);
			}
		});
		this.unsubscribe.push(routerSubscription);
	}

	ngOnDestroy() {
		this.unsubscribe.forEach((sb) => sb.unsubscribe());
	}
}
