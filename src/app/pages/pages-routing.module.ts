import { AuthorizeGuard } from './../modules/auth/services/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout.component';
import { HistoryOfUsingPointsModule } from '../modules/history-of-using-points/history-of-using-points.module';
import { InventoryManagementModule } from '../modules/inventory-management/inventory-management.module';

const routes: Routes = [
	{
		path: '',
		component: LayoutComponent,
		children: [
			{
				path: 'dashboard',
				loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
				canActivate: [AuthorizeGuard]
			},
			{
				path: 'builder',
				loadChildren: () => import('./builder/builder.module').then((m) => m.BuilderModule),
				canActivate: [AuthorizeGuard]
			},
			{
				path: 'user-profile',
				loadChildren: () =>
					import('../modules/user-profile/user-profile.module').then((m) => m.UserProfileModule),
				canActivate: [AuthorizeGuard]
			},

			// feature page
			{
				path: 'tram-xang',
				loadChildren: () =>
					import('../modules/gas-station/gas-station.module').then((m) => m.GasStationModule),
				canActivate: [AuthorizeGuard]
			},
			{
				path: 'san-pham',
				loadChildren: () =>
					import('../modules/product/product.module').then((m) => m.ProductModule),
				canActivate: [AuthorizeGuard]
			},
			{
				path: 'hop-dong',
				loadChildren: () =>
					import('../modules/contract/contract.module').then((m) => m.ContractModule),
				canActivate: [AuthorizeGuard]
			},
			{
				path: 'quan-ly-qr-code',
				loadChildren: () => import('../modules/qr-code/qr-code.module').then((m) => m.QrCodeModule),
				canActivate: [AuthorizeGuard]
			},
			{
				path: 'khach-hang',
				loadChildren: () =>
					import('../modules/customer-management/customer-management.module').then(
						(m) => m.CustomerManagementModule
					),
				canActivate: [AuthorizeGuard]
			},
			{
				path: 'nhan-vien',
				loadChildren: () =>
					import('../modules/employee/employee.module').then((m) => m.EmployeeModule),
				canActivate: [AuthorizeGuard]
			},
			{
				path: 'tai-khoan',
				loadChildren: () => import('../modules/user/user.module').then((m) => m.UserModule),
				canActivate: [AuthorizeGuard]
			},
			{
				path: 'phan-quyen',
				loadChildren: () =>
					import('../modules/authorize/permission.module').then((m) => m.PermissionModule),
				canActivate: [AuthorizeGuard]
			},
			{
				path: 'ca-lam-viec',
				loadChildren: () => import('../modules/shift/shift.module').then((m) => m.ShiftModule),
				canActivate: [AuthorizeGuard]
			},
			{
				path: 'cau-hinh',
				loadChildren: () =>
					import('../modules/configuration-management/configuration-management.module').then(
						(m) => m.ConfigurationManagementModule
					),
				canActivate: [AuthorizeGuard]
			},
			{
				path: 'lich-su-giao-dich',
				loadChildren: () =>
					import('../modules/transaction/transaction.module').then((m) => m.TransactionModule),
				canActivate: [AuthorizeGuard]
			},
			{
				path: 'qr-code',
				loadChildren: () => import('../modules/qr-code/qr-code.module').then((m) => m.QrCodeModule),
				canActivate: [AuthorizeGuard]
			},
			{
				path: 'lich-su-su-dung-diem',
				loadChildren: () =>
					import('../modules/history-of-using-points/history-of-using-points.module').then(
						(m) => m.HistoryOfUsingPointsModule
					),
				canActivate: [AuthorizeGuard]
			},
			{
				path: 'kho',
				loadChildren: () =>
					import('../modules/inventory-management/inventory-management.module').then(
						(m) => m.InventoryManagementModule
					),
				canActivate: [AuthorizeGuard]
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
