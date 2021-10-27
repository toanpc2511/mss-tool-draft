import { IMenuConfigItem } from './../../../_metronic/configs/menu-config';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { DynamicAsideMenuConfig } from 'src/app/_metronic/configs/dynamic-aside-menu.config';
import { AuthService } from './auth.service';
import { isNumber } from 'lodash';
import { EAuthorize } from './authorizes';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		const currentUser = this.authService.getCurrentUserValue();
		if (currentUser) {
			if (!currentUser.changePassword) {
				return true;
			} else {
				this.router.navigate(['/auth/first-login']);
				return false;
			}
		}
		this.authService.logout();
		return false;
	}
}

type SpecialUrl = {
	url: string,
	permissionKey: EAuthorize;
}

const SPECIAL_URL: SpecialUrl[] = [{
	url: '',
	permissionKey: EAuthorize.VIEW_CONTRACT_DETAIL_BUTTON
}]

@Injectable({ providedIn: 'root' })
export class AuthorizeGuard implements CanActivate {
	isDisaled = true;
	constructor(private authService: AuthService, private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		const currentUser = this.authService.getCurrentUserValue();
		let menuItemByRoute: IMenuConfigItem;

		// Remove params, query params from url
		const urlPart = state.url.split('/');
		const originUrlPart =
			isNumber(urlPart[urlPart.length - 1]) || urlPart[urlPart.length - 1].includes('?')
				? [...urlPart]
				: [...urlPart];
		const originUrl = originUrlPart.join('/');

		for (const menuItem of DynamicAsideMenuConfig.items) {
			if (menuItem.submenu?.length > 0) {
				for (const submenuItem of menuItem.submenu) {
					if (submenuItem.page === state.url) {
						menuItemByRoute = submenuItem;
						break;
					}
				}
			} else {
				if (menuItem.page === state.url) {
					menuItemByRoute = menuItem;
					break;
				}
			}
		}

		if (currentUser.actions.includes(menuItemByRoute?.permissionKey)) {
			return true;
		}
		if(!this.isDisaled) {
			this.router.navigate(['/error/404']);
			return false;
		}
		return true;
	}
}
