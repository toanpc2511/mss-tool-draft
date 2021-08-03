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
      title: 'Quản lý nhóm sản phẩm',
      root: true,
      bullet: 'dot',
      page: '/nhom-san-pham',
      icon: 'fas fa-cubes'
    },
    {
      title: 'Quản lý sản phẩm',
      root: true,
      bullet: 'dot',
      page: '/danh-sach-san-pham',
      icon: 'fas fa-cube'
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
      title: 'Quản lý User',
      root: true,
      bullet: 'dot',
      page: '/nguoi-dung',
      icon: 'fas fa-user'
    },
    {
      title: 'Quản lý ca làm việc',
      root: true,
      bullet: 'dot',
      page: '/ca-lam-viec',
      icon: 'fas fa-calendar-check'
    },
    {
      title: 'Quản lý khách hàng',
      root: true,
      bullet: 'dot',
      page: '/khach-hang',
      icon: 'fas fa-users'
    },
    {
      title: 'Quản lý chiết khấu',
      root: true,
      bullet: 'dot',
      page: '/chiet-khau',
      icon: 'fas fa-hand-holding-usd'
    },
    {
      title: 'Quản lý kho',
      root: true,
      bullet: 'dot',
      page: '/kho',
      icon: 'fas fa-warehouse'
    }
  ]
};
