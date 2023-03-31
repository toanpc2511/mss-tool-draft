import { PropertyManagementComponent } from './property-management/property-management.component';
import { BrandManagementComponent } from './brand-management/brand-management.component';
import { ConfigManagementComponent } from './config-management.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/dashboard',
		pathMatch: 'full'
	},
	{
		path: 'hang-san-xuat',
		component: BrandManagementComponent
	},
	{
		path: 'thuoc-tinh',
		component: PropertyManagementComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ConfigManagementRoutingModule {}
