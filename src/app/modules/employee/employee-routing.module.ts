import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeDetailModalComponent } from './employee-detail-modal/employee-detail-modal.component';
import { EmployeeModalComponent } from './employee-modal/employee-modal.component';
import { ListEmployeeComponent } from './list-employee/list-employee.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'danh-sach',
		pathMatch: 'full'
	},
	{
		path: 'danh-sach',
		children: [
			{
				path: '',
				component: ListEmployeeComponent
			},
			{
				path: 'them-moi',
				component: EmployeeModalComponent
			},
			{
				path: 'sua-nhan-vien/:id',
				component: EmployeeModalComponent
			},
			{
				path: 'chi-tiet/:id',
				component: EmployeeDetailModalComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class EmployeeRoutingModule {}
