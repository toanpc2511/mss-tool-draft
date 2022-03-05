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
			title: 'Quản lý hợp đồng',
			icon: 'fas fa-file-contract',
			root: true,
			page: '/hop-dong',
			bullet: 'dot'
		},
		{
			title: 'Quản lý tài xế',
			icon: 'fas fa-users',
			root: true,
			page: '/tai-xe',
			bullet: 'dot'
		},
		// {
		// 	title: 'Báo cáo',
		// 	root: true,
		// 	bullet: 'dot',
		// 	page: '/bao-cao',
		// 	icon: 'fas fa-file-alt'
		// },
		{
			title: 'Lịch sử giao dịch',
			root: true,
			bullet: 'dot',
			page: '/lich-su-giao-dich',
			icon: 'fas fa-history'
		  },
		{
			title: 'Lịch sử sử dụng điểm',
			root: true,
			bullet: 'dot',
			page: '/lich-su-su-dung-diem',
			icon: 'fas fa-business-time'
    }
	]
};
