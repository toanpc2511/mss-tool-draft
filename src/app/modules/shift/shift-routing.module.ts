import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftWorkComponent } from './shift-work/shift-work.component';
import { ShiftWorkConfigComponent } from './shift-work-config/shift-work-config.component';
import { ShiftClosingHistoryComponent } from './shift-closing-history/shift-closing-history.component';
import { DetailShiftClosingHistoryComponent } from './shift-closing-history/detail-shift-closing-history/detail-shift-closing-history.component';
import { ShiftChangeComponent } from './shift-change/shift-change.component';
import { ShiftChangeDetailComponent } from './shift-change-detail/shift-change-detail.component';
import { ListLayoutComponent } from 'src/app/shared/components/list-layout/list-layout.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/dashboard',
		pathMatch: 'full'
	},
	{
		path: 'lich-lam-viec',
		component: ShiftWorkComponent
	},
	{
		path: 'cauhinh-ca',
		component: ShiftWorkConfigComponent
	},
	{
		path: 'doi-ca',
		component: ListLayoutComponent,
		children: [
			{
				path: '',
				component: ShiftChangeComponent
			},
			{
				path: 'chi-tiet-doi-ca/:id',
				component: ShiftChangeDetailComponent
			}
		]
	},

	{
		path: 'lich-su-chot-ca',
		children: [
			{
				path: '',
				component: ShiftClosingHistoryComponent
			},
			{
				path: 'chi-tiet/:lockShiftId',
				component: DetailShiftClosingHistoryComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class EmployeeRoutingModule {}
