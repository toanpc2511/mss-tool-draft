export const DynamicAsideMenuConfig = {
  items: [
    {
      title: 'Dashboard',
      root: true,
      icon: 'fa-gas-pump',
      svg: './assets/media/svg/icons/Design/Layers.svg',
      page: '/dashboard',
      translate: 'MENU.DASHBOARD',
      bullet: 'dot'
    },
    {
      title: 'Quản lý trạm xăng',
      icon: 'fa-gas-pump',
      root: true,
      page: '/tram-xang',
      bullet: 'dot',
      svg: './assets/media/svg/icons/Design/Layers.svg',
      submenu: [
        {
          title: 'Danh sách trạm',
          bullet: 'dot',
          page: 'tram-xang/danh-sach',
          submenu: [
            {
              title: 'Thêm trạm',
              bullet: 'dot',
              page: 'tram-xang/danh-sach/them-tram'
            }
          ]
        }
      ]
    }
    // {
    //   title: 'Quản lý nhóm sản phẩm',
    //   root: true,
    //   bullet: 'dot',
    //   page: '/nhom-san-pham',
    //   icon: '	fa-cubes',
    //   svg: './assets/media/svg/icons/Design/Layers.svg'
    // },
    // {
    //   title: 'Quản lý QR code',
    //   root: true,
    //   bullet: 'dot',
    //   page: '/nhom-san-pham',
    //   icon: '	fa-cubes',
    //   svg: './assets/media/svg/icons/Design/Layers.svg'
    // },
    // {
    //   title: 'Báo cáo',
    //   root: true,
    //   bullet: 'dot',
    //   page: '/nhom-san-pham',
    //   icon: '	fa-cubes',
    //   svg: './assets/media/svg/icons/Design/Layers.svg'
    // },
    // {
    //   title: 'Quản lý User',
    //   root: true,
    //   bullet: 'dot',
    //   page: '/nhom-san-pham',
    //   icon: '	fa-cubes',
    //   svg: './assets/media/svg/icons/Design/Layers.svg'
    // },
    // {
    //   title: 'Quản lý ca làm việc',
    //   root: true,
    //   bullet: 'dot',
    //   page: '/nhom-san-pham',
    //   icon: '	fa-cubes',
    //   svg: './assets/media/svg/icons/Design/Layers.svg'
    // },
    // {
    //   title: 'Quản lý khách hàng',
    //   root: true,
    //   bullet: 'dot',
    //   page: '/nhom-san-pham',
    //   icon: '	fa-cubes',
    //   svg: './assets/media/svg/icons/Design/Layers.svg'
    // },
    // {
    //   title: 'Quản lý chiết khấu',
    //   root: true,
    //   bullet: 'dot',
    //   page: '/nhom-san-pham',
    //   icon: '	fa-cubes',
    //   svg: './assets/media/svg/icons/Design/Layers.svg'
    // },
    // {
    //   title: 'Quản lý kho',
    //   root: true,
    //   bullet: 'dot',
    //   page: '/nhom-san-pham',
    //   icon: '	fa-cubes',
    //   svg: './assets/media/svg/icons/Design/Layers.svg'
    // }
  ]
};
