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
				path: 'don-hang',
				loadChildren: () =>
					import('../modules/order-management/order-management.module').then(
						(m) => m.OrderManagementModule
					)
			},
			{
				path: 'san-pham',
				loadChildren: () =>
					import('./../modules/product-management/product-management.module').then(
						(m) => m.ProductManagementModule
					)
			},
			{
				path: 'danh-muc',
				loadChildren: () =>
					import('./../modules/category-management/category-management.module').then(
						(m) => m.CategoryManagementModule
					)
			},
			{
				path: 'quang-cao',
				loadChildren: () =>
					import('../modules/banner-management/banner-management.module').then(
						(m) => m.BannerManagementModule
					)
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
