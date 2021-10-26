import { EAuthorize } from 'src/app/modules/auth/services/authorizes';
import { IMenuConfigItem } from './menu-config';

export const DynamicAsideMenuConfig: { items: IMenuConfigItem[] } = {
	items: [
		{
			title: 'Dashboard',
			root: true,
			icon: 'fas fa-layer-group',
			page: '/dashboard',
			translate: 'MENU.DASHBOARD',
			bullet: 'dot',
			permissionKey: ''
		},
		{
			title: 'Quản lý trạm xăng',
			icon: 'fa fa-gas-pump',
			root: true,
			page: '/tram-xang',
			bullet: 'dot',
			submenu: [
				{
					title: 'Danh sách trạm',
					bullet: 'dot',
					page: 'tram-xang/danh-sach',
					notChild: true,
					submenu: [
						{
							title: 'Thêm trạm',
							bullet: 'dot',
							page: 'tram-xang/danh-sach/them-tram',
							permissionKey: EAuthorize.CREATE_GAS_STATION_BUTTON
						}
					],
					permissionKey: EAuthorize.MENU_GAS_STAION_MANAGEMENT
				}
			],
		},
		{
			title: 'Quản lý sản phẩm',
			icon: 'fas fa-cubes',
			root: true,
			page: '/san-pham',
			bullet: 'dot',
			submenu: [
				{
					title: 'Quản lý nhóm sản phẩm',
					bullet: 'dot',
					page: 'san-pham/nhom-san-pham',
					notChild: true,
					permissionKey: EAuthorize.VIEW_CATEGORY_SCREEN
				},
				{
					title: 'Sản phẩm nhiên liệu',
					bullet: 'dot',
					page: 'san-pham/san-pham-nhien-lieu',
					notChild: true,
					permissionKey: EAuthorize.VIEW_OIL_LIST_SCREEN
				},
				{
					title: 'Sản phẩm khác',
					bullet: 'dot',
					page: 'san-pham/san-pham-khac',
					notChild: true,
					permissionKey: EAuthorize.VIEW_OTHER_PRODUCT_SCREEN
				}
			],
			permissionKey: ''
		},
		{
			title: 'Quản lý hợp đồng',
			icon: 'fas fa-file-contract',
			root: true,
			page: '/hop-dong',
			bullet: 'dot',
			permissionKey: EAuthorize.VIEW_CONTRACT_LIST_SCREEN
		},
		{
			title: 'Quản lý QR code',
			root: true,
			bullet: 'dot',
			page: '/qr-code',
			icon: 'fas fa-qrcode',
			submenu: [
				{
					title: 'Qr code sản phẩm',
					bullet: 'dot',
					page: 'qr-code/qr-san-pham',
					notChild: true,
					permissionKey: EAuthorize.VIEW_PRODUCT_QR_LIST_SCREEN
				},
				{
					title: 'Qr code vòi bơm',
					bullet: 'dot',
					page: 'qr-code/qr-voi',
					notChild: true,
					permissionKey: EAuthorize.VIEW_PUMP_POLE_QR_LIST_SCREEN
				}
			],
		},
		{
			title: 'Báo cáo',
			root: true,
			bullet: 'dot',
			page: '/bao-cao',
			icon: 'fas fa-file-alt',
			permissionKey: ''
		},
		{
			title: 'Quản lý nhân viên',
			root: true,
			bullet: 'dot',
			page: '/nhan-vien',
			icon: 'fas fa-user',
			permissionKey: EAuthorize.VIEW_EMPLOYEE_LIST_SCREEN
		},
		{
			title: 'Quản lý tài khoản',
			root: true,
			bullet: 'dot',
			page: '/tai-khoan',
			icon: 'fas fa-user-shield',
			permissionKey: EAuthorize.VIEW_ACCOUNT_LIST_SCREEN
		},
		{
			title: 'Quản lý phân quyền',
			root: true,
			bullet: 'dot',
			page: '/phan-quyen',
			icon: 'fas fa-lock',
			permissionKey: EAuthorize.VIEW_ROLE_LIST_SCREEN
		},
		{
			title: 'Quản lý ca làm việc',
			root: true,
			bullet: 'dot',
			page: '/ca-lam-viec',
			icon: 'fas fa-calendar-check',
			submenu: [
				{
					title: 'Cấu hình ca',
					bullet: 'dot',
					page: 'ca-lam-viec/cauhinh-ca',
					notChild: true,
					permissionKey: EAuthorize.VIEW_SHIFT_CONFIG_SCREEN
				},
				{
					title: 'Lên lịch làm việc',
					bullet: 'dot',
					page: 'ca-lam-viec/lich-lam-viec',
					notChild: true,
					permissionKey: EAuthorize.VIEW_CALENDAR_SCREEN
				},
				{
					title: 'Đổi ca',
					bullet: 'dot',
					page: 'ca-lam-viec/doi-ca',
					notChild: true,
					permissionKey: EAuthorize.VIEW_SWAP_SHIFT_SCREEN
				},
				{
					title: 'Lịch sử chốt ca',
					bullet: 'dot',
					page: 'ca-lam-viec/lich-su-chot-ca',
					notChild: true,
					permissionKey: ''
				}
			],
		},
		{
			title: 'Quản lý khách hàng',
			root: true,
			bullet: 'dot',
			page: '/khach-hang',
			icon: 'fas fa-users',
			permissionKey: EAuthorize.VIEW_DRIVER_LIST_SCREEN
		},
		{
			title: 'Quản lý cấu hình',
			icon: 'fas fa-hand-holding-usd',
			root: true,
			page: '/cau-hinh',
			bullet: 'dot',
			submenu: [
				{
					title: 'Cấu hình tích điểm',
					bullet: 'dot',
					page: 'cau-hinh/tich-diem',
					notChild: true,
					permissionKey: EAuthorize.VIEW_POINT_LIST_SCREEN
				},
				{
					title: 'Cấu hình chiết khấu',
					bullet: 'dot',
					page: 'cau-hinh/chiet-khau',
					notChild: true,
					permissionKey: EAuthorize.VIEW_DISCOUNT_LIST_SCREEN
				},
				{
					title: 'Cấu hình hạng',
					bullet: 'dot',
					page: 'cau-hinh/hang',
					notChild: true,
					permissionKey: EAuthorize.VIEW_RANK_LIST_SCREEN
				},
				{
					title: 'Cấu hình khuyến mãi',
					bullet: 'dot',
					page: 'cau-hinh/khuyen-mai',
					notChild: true,
					permissionKey: EAuthorize.VIEW_PROMOTION_LIST_SCREEN
				}
			],
		},
		{
			title: 'Quản lý kho',
			root: true,
			bullet: 'dot',
			page: '/kho',
			icon: 'fas fa-warehouse',
			permissionKey: ''
		},
		{
			title: 'Lịch sử giao dịch',
			root: true,
			bullet: 'dot',
			page: '/lich-su-giao-dich',
			icon: 'fas fa-history',
			permissionKey: EAuthorize.VIEW_TRANSACTION_HISTORY_MENU
		}
	]
};
