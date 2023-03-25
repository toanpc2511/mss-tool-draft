import { BrandManagementComponent } from './brand-management.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		component: BrandManagementComponent,
		data: {
			title: 'Quản lý hãng sản xuất'
		}
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class BrandManagementRoutingModule {}
