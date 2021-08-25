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
		}
	]
};
