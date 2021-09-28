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
				path: 'user-profile',
				loadChildren: () =>
					import('../modules/user-profile/user-profile.module').then((m) => m.UserProfileModule)
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
				path: 'khach-hang',
				loadChildren: () =>
					import('../modules/customer-management/customer-management.module').then(
						(m) => m.CustomerManagementModule
					)
			},
			{
				path: 'nhan-vien',
				loadChildren: () =>
					import('../modules/employee/employee.module').then((m) => m.EmployeeModule)
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
				path: 'cau-hinh',
				loadChildren: () =>
					import('../modules/configuration-management/configuration-management.module').then(
						(m) => m.ConfigurationManagementModule
					)
			},
      {
        path: 'lich-su-giao-dich',
        loadChildren: () => import('../modules/transaction/transaction.module').then((m) => m.TransactionModule)
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
