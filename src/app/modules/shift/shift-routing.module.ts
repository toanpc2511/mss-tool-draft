import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftWorkComponent } from './shift-work/shift-work.component';
import { ShiftWorkConfigComponent } from './shift-work-config/shift-work-config.component';
import { ShiftChangeComponent } from './shift-change/shift-change.component';
import { ShiftChangeDetailComponent } from './shift-change-detail/shift-change-detail.component';

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
		path: 'doi-ca',
		component: ShiftChangeComponent
	},
	{
		path: 'chi-tiet-doi-ca/:id',
		component: ShiftChangeDetailComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class EmployeeRoutingModule {}
