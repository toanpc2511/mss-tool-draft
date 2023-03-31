export const DynamicAsideMenuConfig = {
	items: [
		{
			title: 'Trang chủ',
			root: true,
			icon: 'fas fa-layer-group',
			page: '/dashboard',
			translate: 'MENU.DASHBOARD',
			bullet: 'dot'
		},
		{
			title: 'Quản lý đơn hàng',
			root: true,
			icon: 'flaticon2-expand',
			svg: './assets/media/svg/icons/Shopping/Cart1.svg',
			page: '/don-hang'
		},
		{
			title: 'Quản lý danh mục',
			root: true,
			icon: 'flaticon2-expand',
			svg: './assets/media/svg/icons/Home/Book.svg',
			page: '/danh-muc'
		},
		{
			title: 'Quản lý sản phẩm',
			root: true,
			icon: 'flaticon2-expand',
			svg: './assets/media/svg/icons/Shopping/Box2.svg',
			page: '/san-pham'
		},
		{
			title: 'Quản lý quảng cáo',
			root: true,
			icon: 'flaticon2-expand',
			svg: './assets/media/svg/icons/Shopping/Chart-line1.svg',
			page: '/quang-cao'
		},
		{
			title: 'Quản lý cấu hình',
			icon: 'flaticon2-expand',
			svg: './assets/media/svg/icons/Shopping/Chart-line1.svg',
			root: true,
			bullet: 'dot',
			page: '/cau-hinh',
			submenu: [
				{
					title: 'Danh sách hãng sản xuất',
					bullet: 'dot',
					page: '/cau-hinh/hang-san-xuat'
				},
				{
					title: 'Danh sách thuộc tính',
					bullet: 'dot',
					page: '/cau-hinh/thuoc-tinh'
				}
			]
		}
	]
};
