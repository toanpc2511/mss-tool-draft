import { BrandManagementComponent } from './brand-management.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandManagementRoutingModule } from './brand-management-routing.module';
import { BrandModalComponent } from './brand-modal/brand-modal.component';

@NgModule({
	declarations: [BrandModalComponent, BrandManagementComponent],
	imports: [CommonModule, SharedModule, BrandManagementRoutingModule]
})
export class BrandManagementModule {}
