import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'builder',
        loadChildren: () => import('./builder/builder.module').then((m) => m.BuilderModule)
      },
      {
        path: 'user-management',
        loadChildren: () =>
          import('../modules/user-management/user-management.module').then(
            (m) => m.UserManagementModule
          )
      },
      {
        path: 'user-profile',
        loadChildren: () =>
          import('../modules/user-profile/user-profile.module').then((m) => m.UserProfileModule)
      },
      {
        path: 'ngbootstrap',
        loadChildren: () =>
          import('../modules/ngbootstrap/ngbootstrap.module').then((m) => m.NgbootstrapModule)
      },
      {
        path: 'wizards',
        loadChildren: () => import('../modules/wizards/wizards.module').then((m) => m.WizardsModule)
      },
      {
        path: 'material',
        loadChildren: () =>
          import('../modules/material/material.module').then((m) => m.MaterialModule)
      },

      // feature page
      {
        path: 'tram-xang',
        loadChildren: () =>
          import('../modules/gas-station/gas-station.module').then((m) => m.GasStationModule)
      },
      {
        path: 'san-pham',
        loadChildren: () => import('../modules/product/product.module').then((m) => m.ProductModule)
      },
      {
        path: 'hop-dong',
        loadChildren: () =>
          import('../modules/contract/contract.module').then((m) => m.ContractModule)
      },
      {
        path: 'tai-khoan',
        loadChildren: () => import('../modules/user/user.module').then((m) => m.UserModule)
      },
      {
        path: 'phan-quyen',
        loadChildren: () =>
          import('../modules/authorize/permission.module').then((m) => m.PermissionModule)
      },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'error/404'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
