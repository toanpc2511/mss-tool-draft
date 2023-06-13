import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderManagementComponent } from './order-management.component';
import { OrderManagementRoutingModule } from './order-management-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewProductComponent } from './view-product/view-product.component';

@NgModule({
	declarations: [OrderManagementComponent, ViewProductComponent],
	imports: [CommonModule, OrderManagementRoutingModule, SharedModule]
})
export class OrderManagementModule {}
