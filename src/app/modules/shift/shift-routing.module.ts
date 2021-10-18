import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftWorkComponent } from './shift-work/shift-work.component';
import { ShiftWorkConfigComponent } from './shift-work-config/shift-work-config.component';
import { ShiftClosingHistoryComponent } from './shift-closing-history/shift-closing-history.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'danh-sach',
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
		path: 'lich-su-chot-ca',
		component: ShiftClosingHistoryComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class EmployeeRoutingModule {}
