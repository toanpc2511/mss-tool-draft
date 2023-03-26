import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../_metronic/core';

@Component({
	selector: 'app-header-mobile',
	templateUrl: './header-mobile.component.html',
	styleUrls: ['./header-mobile.component.scss']
})
export class HeaderMobileComponent implements OnInit {
	headerLogo = '';
	asideSelfDisplay = true;
	headerMenuSelfDisplay = true;
	headerMobileClasses = '';
	headerMobileAttributes = {};
	constructor(private layout: LayoutService) {}

	ngOnInit(): void {
		// build view by layout config settings
		this.headerMobileClasses = this.layout.getStringCSSClasses('header_mobile');
		this.headerMobileAttributes = this.layout.getHTMLAttributes('header_mobile');

		this.headerLogo = this.getLogoUrl();
		this.asideSelfDisplay = this.layout.getProp('aside.self.display');
		this.headerMenuSelfDisplay = this.layout.getProp('header.menu.self.display');
	}

	private getLogoUrl() {
		const headerSelfTheme = this.layout.getProp('header.self.theme') || '';
		const brandSelfTheme = this.layout.getProp('brand.self.theme') || '';
		let result = 'VP.png';
		if (!this.asideSelfDisplay) {
			if (headerSelfTheme === 'light') {
				result = 'logo-dark.png';
			}
		} else {
			if (brandSelfTheme === 'light') {
				result = 'logo-dark.png';
			}
		}
		return `./assets/media/logos/${result}`;
	}
}
