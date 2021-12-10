import { IMenuConfigItem } from '../../../_metronic/configs/menu-config';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { DynamicAsideMenuConfig } from 'src/app/_metronic/configs/dynamic-aside-menu.config';
import { AuthService } from './auth.service';
import { EAuthorize } from './authorizes';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router) {
    if (!this.authService.getCurrentUserValue().accountAuth.verifyOtp) {
      this.authService.logout().subscribe();
    }
  }

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
		this.authService.logout().subscribe();
		return false;
	}
}

type SpecialUrl = {
	url: string;
	permissionKey: EAuthorize;
};

const SPECIAL_URL: SpecialUrl[] = [
	{ url: '/hop-dong/danh-sach', permissionKey: EAuthorize.VIEW_CONTRACT_LIST_SCREEN },
	{ url: '/hop-dong/danh-sach/them-moi', permissionKey: EAuthorize.CREATE_CONTRACT_BUTTON },
	{ url: '/hop-dong/danh-sach/them-moi', permissionKey: EAuthorize.CREATE_CONTRACT_PLAN_BUTTON },
	{
		url: '/hop-dong/danh-sach/chi-tiet',
		permissionKey: EAuthorize.VIEW_CONTRACT_DETAIL_BUTTON
	},
	{ url: '/hop-dong/danh-sach/sua-hop-dong', permissionKey: EAuthorize.UPDATE_CONTRACT_BUTTON },
	{
		url: '/hop-dong/danh-sach/sua-hop-dong',
		permissionKey: EAuthorize.UPDATE_CONTRACT_PLAN_BUTTON
	},
	{
		url: '/tram-xang/danh-sach/sua-tram',
		permissionKey: EAuthorize.UPDATE_GAS_STATION_BUTTON
	},
	{
		url: '/nhan-vien/danh-sach',
		permissionKey: EAuthorize.VIEW_EMPLOYEE_LIST_SCREEN
	},
	{
		url: '/nhan-vien/danh-sach/them-moi',
		permissionKey: EAuthorize.CREATE_EMPLOYEE_BUTTON
	},
	{
		url: '/nhan-vien/danh-sach/chi-tiet',
		permissionKey: EAuthorize.VIEW_EMPLOYEE_DETAIL_SCREEN
	},
	{
		url: '/nhan-vien/danh-sach/sua-nhan-vien',
		permissionKey: EAuthorize.UPDATE_EMPLOYEE_BUTTON
	},
	{
		url: '/phan-quyen',
		permissionKey: EAuthorize.VIEW_ROLE_LIST_SCREEN
	},
	{
		url: '/phan-quyen/them-nhom-quyen',
		permissionKey: EAuthorize.CREATE_ROLE_BUTTON
	},
	{
		url: '/phan-quyen/sua-nhom-quyen',
		permissionKey: EAuthorize.UPDATE_ROLE_BUTTON
	},
	{
		url: '/ca-lam-viec/doi-ca',
		permissionKey: EAuthorize.VIEW_SWAP_SHIFT_SCREEN
	},
	{
		url: '/ca-lam-viec/doi-ca/chi-tiet-doi-ca',
		permissionKey: EAuthorize.VIEW_SWAP_SHIFT_SCREEN
	},
	{
		url: '/ca-lam-viec/lich-su-chot-ca',
		permissionKey: EAuthorize.VIEW_LOCK_SHIFT_LIST_SCREEN
	},
	{
		url: '/ca-lam-viec/lich-su-chot-ca/chi-tiet',
		permissionKey: EAuthorize.VIEW_SWAP_SHIFT_SCREEN
	},
	{
		url: '/khach-hang/danh-sach',
		permissionKey: EAuthorize.VIEW_DRIVER_LIST_SCREEN
	},
	{
		url: '/khach-hang/danh-sach/chi-tiet',
		permissionKey: EAuthorize.VIEW_DRIVER_DETAIL_SCREEN
	},
  {
    url: '/doi-diem/chi-tiet',
    permissionKey: EAuthorize.TRANSFER_POINT_BUTTON
  },
  {
    url: '/doi-diem/lich-su',
    permissionKey: EAuthorize.VIEW_TRANSFER_POINT_HISTORY_MENU
  },
  {
    url: '/cau-hinh/banner',
    permissionKey: EAuthorize.VIEW_BANNERS_SCREEN
  },
  {
    url: '/quan-ly-qr-code/qr-san-pham',
    permissionKey: EAuthorize.VIEW_PRODUCT_QR_LIST_SCREEN
  },
  {
    url: '/quan-ly-qr-code/qr-voi',
    permissionKey: EAuthorize.VIEW_PUMP_HOSE_QR_LIST_SCREEN
  },
  {
    url: '/kho/yeu-cau-dat-hang',
    permissionKey: EAuthorize.CREATE_IMPORT_REQUEST
  },
  {
    url: '/kho/yeu-cau-dat-hang/them-moi',
    permissionKey: EAuthorize.CREATE_IMPORT_REQUEST
  },
  {
    url: '/kho/yeu-cau-dat-hang/chi-tiet',
    permissionKey: EAuthorize.VIEW_DETAIL_IMPORT_REQUEST
  },
  {
    url: '/kho/yeu-cau-dat-hang/sua-yeu-cau',
    permissionKey: EAuthorize.UPDATE_IMPORT_REQUEST
  },
  {
    url: '/kho/don-dat-kho',
    permissionKey: EAuthorize.VIEW_WAREHOUSE_ORDERS_SCREEN
  },
  {
    url: '/kho/xuat-kho',
    permissionKey: EAuthorize.VIEW_WAREHOUSE_EXPORT_LIST_SCREEN
  },
  {
    url: '/kho/nhap-kho',
    permissionKey: EAuthorize.VIEW_WAREHOUSE_IMPORT_LIST_SCREEN
  },
  {
    url: '/cau-hinh/tin-tuc',
    permissionKey: EAuthorize.VIEW_LIST_NEWS_SCREEN
  },
  {
    url:'/cau-hinh/tin-tuc/them-moi',
    permissionKey: EAuthorize.CREATE_NEWS_BUTTON
  },
  {
    url: '/cau-hinh/tin-tuc/cap-nhat',
    permissionKey: EAuthorize.UPDATE_NEWS_BUTTON
  },
  {
    url: '/kho/tinh-kho-kich-bom',
    permissionKey: EAuthorize.VIEW_LIST_SHALLOW_SCREEN
  },
  {
    url: '/kho/nhap-kho/chi-tiet',
    permissionKey: EAuthorize.VIEW_WAREHOUSE_IMPORT_DETAIL_SCREEN
  },
  {
    url: '/kho/tinh-kho-do-be',
    permissionKey: EAuthorize.VIEW_MEASURES_SCREEN
  },
  {
    url: '/lich-su-su-dung-diem/danh-sach',
    permissionKey: EAuthorize.VIEW_HISTORY_ACCUMULATE_SCREEN
  },
  {
    url: '/cau-hinh/tich-diem',
    permissionKey: EAuthorize.VIEW_POINT_LIST_SCREEN
  },
  {
    url: '/cau-hinh/chiet-khau',
    permissionKey: EAuthorize.VIEW_DISCOUNT_LIST_SCREEN
  },
  {
    url: '/cau-hinh/hang',
    permissionKey: EAuthorize.VIEW_RANK_LIST_SCREEN
  },
  {
    url: '/cau-hinh/khuyen-mai',
    permissionKey: EAuthorize.VIEW_PROMOTION_LIST_SCREEN
  },
  {
    url: '/lich-su-giao-dich/danh-sach',
    permissionKey: EAuthorize.VIEW_TRANSACTION_HISTORY_MENU
  },
  {
    url: '/ca-lam-viec/cauhinh-ca',
    permissionKey: EAuthorize.VIEW_SHIFT_CONFIG_SCREEN
  },
  {
    url: '/ca-lam-viec/lich-lam-viec',
    permissionKey: EAuthorize.VIEW_CALENDAR_SCREEN
  },
  {
    url: '/tai-khoan/danh-sach',
    permissionKey: EAuthorize.VIEW_ACCOUNT_LIST_SCREEN
  },
  {
    url: '/san-pham/nhom-san-pham',
    permissionKey: EAuthorize.VIEW_CATEGORY_SCREEN
  },
  {
    url: '/san-pham/san-pham-nhien-lieu',
    permissionKey: EAuthorize.VIEW_OIL_LIST_SCREEN
  },
  {
    url: '/san-pham/san-pham-khac',
    permissionKey: EAuthorize.VIEW_OTHER_PRODUCT_SCREEN
  },





	/* thêm tạm thời */
	{
		url: '/kho/don-dat-kho/chi-tiet',
		permissionKey: EAuthorize.VIEW_DRIVER_DETAIL_SCREEN
	},
	{
		url: '/kho/don-dat-kho/tao-yeu-cau',
		permissionKey: EAuthorize.VIEW_DRIVER_DETAIL_SCREEN
	},
	/*End*/
];

@Injectable({ providedIn: 'root' })
export class AuthorizeGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		if (state.url === '/dashboard') {
			return true;
		}
		const currentUser = this.authService.getCurrentUserValue();
		const actions = currentUser.actions || [];
		const indexOfSpecialUrl = SPECIAL_URL.findIndex((su) => state.url.includes(su.url));
		console.log(state.url);
		if (indexOfSpecialUrl >= 0) {
			console.log(
				`SPECIAL URL: ${SPECIAL_URL[indexOfSpecialUrl].url} - KEY: ${SPECIAL_URL[indexOfSpecialUrl].permissionKey}`
			);
		}
		if (
			indexOfSpecialUrl >= 0 &&
			actions.some((a) => a === SPECIAL_URL[indexOfSpecialUrl].permissionKey)
		) {
			return true;
		}

		for (const menuItem of DynamicAsideMenuConfig.items) {
			if (menuItem.submenu?.length > 0) {
				for (const submenuItem of menuItem.submenu) {
					const check = this.checkPermission(submenuItem, state, actions);
					if (check) {
						return true;
					}
				}
			} else {
				const check = this.checkPermission(menuItem, state, actions);
				if (check) {
					return true;
				}
			}
		}
		this.router.navigate(['/error/error-authorize']);
		return false;
	}

	checkPermission(
		menuItem: IMenuConfigItem,
		state: RouterStateSnapshot,
		actions: string[]
	): boolean {
		if (menuItem.page === state.url && menuItem && actions.includes(menuItem?.permissionKey)) {
			return true;
		}
		return false;
	}
}
