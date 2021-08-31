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
				path: 'hop-dong',
				loadChildren: () =>
					import('../modules/contract/contract.module').then((m) => m.ContractModule)
			},
			{
				path: 'tai-xe',
				loadChildren: () => import('../modules/partner/partner.module').then((m) => m.PartnerModule)
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
