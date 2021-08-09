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
      title: 'Quản lý tài khoản',
      root: true,
      bullet: 'dot',
      page: '/tai-khoan',
      icon: 'fas fa-user'
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
