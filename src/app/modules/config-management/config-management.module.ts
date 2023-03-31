import { ModalBrandComponent } from './brand-management/modal-brand/modal-brand.component';
import { BrandManagementComponent } from './brand-management/brand-management.component';
import { ConfigManagementRoutingModule } from './config-management-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigManagementComponent } from './config-management.component';
import { PropertyManagementComponent } from './property-management/property-management.component';
import { ModalPropertyComponent } from './property-management/modal-property/modal-property.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	declarations: [
		ConfigManagementComponent,
		PropertyManagementComponent,
		ModalPropertyComponent,
		BrandManagementComponent,
		ModalBrandComponent
	],
	imports: [CommonModule, SharedModule, ConfigManagementRoutingModule]
})
export class ConfigManagementModule {}
