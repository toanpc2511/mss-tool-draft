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
				path: 'lich-su-giao-dich',
				loadChildren: () => import('../modules/transaction/transaction.module').then((m) => m.TransactionModule)
      },
			{
        path: 'lich-su-su-dung-diem',
        loadChildren: () => import('../modules/using-points/using-points.module').then((m) => m.UsingPointsModule)
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
