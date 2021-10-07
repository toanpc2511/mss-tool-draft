export const DynamicAsideMenuConfig = {
	items: [
		{
			title: 'Dashboard',
			root: true,
			icon: 'fas fa-layer-group',
			page: '/dashboard',
			translate: 'MENU.DASHBOARD',
			bullet: 'dot'
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
							hidden: true
						}
					]
				}
			]
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
					notChild: true
				},
				{
					title: 'Sản phẩm nhiên liệu',
					bullet: 'dot',
					page: 'san-pham/san-pham-nhien-lieu',
					notChild: true
				},
				{
					title: 'Sản phẩm khác',
					bullet: 'dot',
					page: 'san-pham/san-pham-khac',
					notChild: true
				}
			]
		},
		{
			title: 'Quản lý hợp đồng',
			icon: 'fas fa-file-contract',
			root: true,
			page: '/hop-dong',
			bullet: 'dot'
		},
		{
			title: 'Quản lý QR code',
			root: true,
			bullet: 'dot',
			page: '/qrcode',
			icon: 'fas fa-qrcode'
		},
		{
			title: 'Báo cáo',
			root: true,
			bullet: 'dot',
			page: '/bao-cao',
			icon: 'fas fa-file-alt'
		},
		{
			title: 'Quản lý nhân viên',
			root: true,
			bullet: 'dot',
			page: '/nhan-vien',
			icon: 'fas fa-user'
		},
		{
			title: 'Quản lý tài khoản',
			root: true,
			bullet: 'dot',
			page: '/tai-khoan',
			icon: 'fas fa-user-shield'
		},
		{
			title: 'Quản lý phân quyền',
			root: true,
			bullet: 'dot',
			page: '/phan-quyen',
			icon: 'fas fa-lock'
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
					notChild: true
				},
				{
					title: 'Lên lịch làm việc',
					bullet: 'dot',
					page: 'ca-lam-viec/lich-lam-viec',
					notChild: true
				},
				{
					title: 'Đổi ca',
					bullet: 'dot',
					page: 'ca-lam-viec/doi-ca',
					notChild: true
				}
			]
		},
		{
			title: 'Quản lý khách hàng',
			root: true,
			bullet: 'dot',
			page: '/khach-hang',
			icon: 'fas fa-users'
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
					notChild: true
				},
				{
					title: 'Cấu hình chiết khấu',
					bullet: 'dot',
					page: 'cau-hinh/chiet-khau',
					notChild: true
				},
				{
					title: 'Cấu hình hạng',
					bullet: 'dot',
					page: 'cau-hinh/hang',
					notChild: true
				},
				{
					title: 'Cấu hình khuyến mãi',
					bullet: 'dot',
					page: 'cau-hinh/khuyen-mai',
					notChild: true
				}
			]
		},
		{
			title: 'Quản lý kho',
			root: true,
			bullet: 'dot',
			page: '/kho',
			icon: 'fas fa-warehouse'
		},
		{
			title: 'Lịch sử giao dịch',
			root: true,
			bullet: 'dot',
			page: '/lich-su-giao-dich',
			icon: 'fas fa-history'
		}
	]
};
