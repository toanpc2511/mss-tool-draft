import { EAuthorize } from 'src/app/modules/auth/services/authorizes';
import { IMenuConfigItem } from './menu-config';

export const DynamicAsideMenuConfig: { items: IMenuConfigItem[] } = {
	items: [
		{
			title: 'Trang chủ',
			root: true,
			icon: 'fas fa-layer-group',
			page: '/dashboard',
			translate: 'MENU.DASHBOARD',
			bullet: 'dot',
			permissionKey: EAuthorize.DASH_BOARD
		},
		{
			title: 'Quản lý trạm xăng',
			icon: 'fa fa-gas-pump',
			root: true,
			bullet: 'dot',
			page: '/tram-xang',
			submenu: [
				{
					title: 'Danh sách trạm',
					bullet: 'dot',
					page: '/tram-xang/danh-sach',
					permissionKey: EAuthorize.MENU_GAS_STAION_MANAGEMENT
				}
			]
		},
		{
			title: 'Quản lý sản phẩm',
			icon: 'fas fa-cubes',
			root: true,
			bullet: 'dot',
			page: '/san-pham',
			submenu: [
				{
					title: 'Quản lý nhóm sản phẩm',
					bullet: 'dot',
					page: '/san-pham/nhom-san-pham',

					permissionKey: EAuthorize.VIEW_CATEGORY_SCREEN
				},
				{
					title: 'Sản phẩm nhiên liệu',
					bullet: 'dot',
					page: '/san-pham/san-pham-nhien-lieu',

					permissionKey: EAuthorize.VIEW_OIL_LIST_SCREEN
				},
				{
					title: 'Sản phẩm khác',
					bullet: 'dot',
					page: '/san-pham/san-pham-khac',

					permissionKey: EAuthorize.VIEW_OTHER_PRODUCT_SCREEN
				}
			]
		},
		{
			title: 'Quản lý hợp đồng',
			icon: 'fas fa-file-contract',
			root: true,
			page: '/hop-dong/danh-sach',
			bullet: 'dot',
			permissionKey: EAuthorize.VIEW_CONTRACT_LIST_SCREEN
		},
		{
			title: 'Quản lý QR code',
			root: true,
			bullet: 'dot',
			icon: 'fas fa-qrcode',
			page: '/quan-ly-qr-code',
			submenu: [
				{
					title: 'Qr code sản phẩm',
					bullet: 'dot',
					page: '/quan-ly-qr-code/qr-san-pham',

					permissionKey: EAuthorize.VIEW_PRODUCT_QR_LIST_SCREEN
				},
				{
					title: 'Qr code vòi bơm',
					bullet: 'dot',
					page: '/quan-ly-qr-code/qr-voi',

					permissionKey: EAuthorize.VIEW_PUMP_POLE_QR_LIST_SCREEN
				}
			]
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
			page: '/nhan-vien/danh-sach',
			icon: 'fas fa-user',
			permissionKey: EAuthorize.VIEW_EMPLOYEE_LIST_SCREEN
		},
		{
			title: 'Quản lý tài khoản',
			root: true,
			bullet: 'dot',
			page: '/tai-khoan/danh-sach',
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
      title: 'Quản lý đổi điểm',
      root: true,
      bullet: 'dot',
      page: '/doi-diem',
      icon: 'fas fa-sync',
      submenu: [
        {
          title: 'Đổi điểm',
          bullet: 'dot',
          page: '/doi-diem/chi-tiet',
          permissionKey: EAuthorize.VIEW_TRANSFER_POINT_HISTORY_MENU
        },
        {
          title: 'Lịch sử đổi điểm',
          bullet: 'dot',
          page: '/doi-diem/lich-su',
          permissionKey: EAuthorize.VIEW_POINT_LIST_SCREEN
        }
      ]
    },
		{
			title: 'Quản lý ca làm việc',
			root: true,
			bullet: 'dot',
			icon: 'fas fa-calendar-check',
			page: '/ca-lam-viec',
			submenu: [
				{
					title: 'Cấu hình ca',
					bullet: 'dot',
					page: '/ca-lam-viec/cauhinh-ca',

					permissionKey: EAuthorize.VIEW_SHIFT_CONFIG_SCREEN
				},
				{
					title: 'Lên lịch làm việc',
					bullet: 'dot',
					page: '/ca-lam-viec/lich-lam-viec',

					permissionKey: EAuthorize.VIEW_CALENDAR_SCREEN
				},
				{
					title: 'Danh sách yêu cầu đổi ca',
					bullet: 'dot',
					page: '/ca-lam-viec/doi-ca',

					permissionKey: EAuthorize.VIEW_SWAP_SHIFT_SCREEN
				},
				{
					title: 'Lịch sử chốt ca',
					bullet: 'dot',
					page: '/ca-lam-viec/lich-su-chot-ca',

					permissionKey: EAuthorize.VIEW_LOCK_SHIFT_LIST_SCREEN
				}
			]
		},
		{
			title: 'Quản lý khách hàng',
			root: true,
			bullet: 'dot',
			page: '/khach-hang/danh-sach',
			icon: 'fas fa-users',
			permissionKey: EAuthorize.VIEW_DRIVER_LIST_SCREEN
		},
		{
			title: 'Quản lý cấu hình',
			icon: 'fas fa-hand-holding-usd',
			root: true,
			bullet: 'dot',
			page: '/cau-hinh',
			submenu: [
				{
					title: 'Cấu hình tích điểm',
					bullet: 'dot',
					page: '/cau-hinh/tich-diem',

					permissionKey: EAuthorize.VIEW_POINT_LIST_SCREEN
				},
				{
					title: 'Cấu hình chiết khấu',
					bullet: 'dot',
					page: '/cau-hinh/chiet-khau',

					permissionKey: EAuthorize.VIEW_DISCOUNT_LIST_SCREEN
				},
				{
					title: 'Cấu hình hạng',
					bullet: 'dot',
					page: '/cau-hinh/hang',

					permissionKey: EAuthorize.VIEW_RANK_LIST_SCREEN
				},
				{
					title: 'Cấu hình khuyến mãi',
					bullet: 'dot',
					page: '/cau-hinh/khuyen-mai',

					permissionKey: EAuthorize.VIEW_PROMOTION_LIST_SCREEN
				}
			]
		},
		{
			title: 'Quản lý kho',
			root: true,
			bullet: 'dot',
			page: '/kho',
			icon: 'fas fa-warehouse',
			submenu: [
				{
					title: 'Yêu cầu đặt hàng',
					bullet: 'dot',
					page: '/kho/yeu-cau-dat-hang',
					permissionKey: EAuthorize.VIEW_POINT_LIST_SCREEN
				},
				{
					title: 'Yêu cầu đặt kho',
					bullet: 'dot',
					page: '/kho/don-dat-kho',
					permissionKey: EAuthorize.VIEW_POINT_LIST_SCREEN
				},
				{
					title: 'Xuất kho',
					bullet: 'dot',
					page: '/kho/xuat-kho',
					permissionKey: EAuthorize.VIEW_POINT_LIST_SCREEN
				},
				{
					title: 'Nhập kho',
					bullet: 'dot',
					page: '/kho/nhap-kho',
					permissionKey: EAuthorize.VIEW_POINT_LIST_SCREEN
				},
				{
					title: 'Tịnh kho',
					bullet: 'dot',
					page: '/kho/tinh-kho',
					permissionKey: EAuthorize.VIEW_POINT_LIST_SCREEN
				}
			]
		},
		{
			title: 'Lịch sử giao dịch',
			root: true,
			bullet: 'dot',
			page: '/lich-su-giao-dich/danh-sach',
			icon: 'fas fa-history',
			permissionKey: EAuthorize.VIEW_TRANSACTION_HISTORY_MENU
		},
		{
			title: 'Lịch sử sử dụng điểm',
			root: true,
			bullet: 'dot',
			page: '/lich-su-su-dung-diem/danh-sach',
			icon: 'fas fa-business-time',
			permissionKey: EAuthorize.VIEW_ROLE_LIST_SCREEN
		}
	]
};
