import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftWorkComponent } from './shift-work/shift-work.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'danh-sach',
		pathMatch: 'full'
	},
	{
		path: 'lich-lam-viec',
		component: ShiftWorkComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class EmployeeRoutingModule {}
