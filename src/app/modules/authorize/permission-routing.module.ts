import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPermissionComponent } from './list-permission/list-permission.component';
import { PermissionModalComponent } from './permission-modal/permission-modal.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'danh-sach',
		pathMatch: 'full'
	},
	{
		path: 'danh-sach',
		component: ListPermissionComponent
	},
	{
		path: 'them-nhom-quyen',
		component: PermissionModalComponent
	},
	{
		path: 'sua-nhom-quyen/:id',
		component: PermissionModalComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ProductTypeRoutingModule {}
