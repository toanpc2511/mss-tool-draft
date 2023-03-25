import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductManagementComponent } from './product-management.component';
import { ProductManagementRoutingModule } from './product-management-routing.module';
import { ViewProductComponent } from './view-product/view-product.component';
import { ProductComponent } from './product/product.component';

@NgModule({
	declarations: [ProductManagementComponent, ViewProductComponent, ProductComponent],
	imports: [CommonModule, SharedModule, ProductManagementRoutingModule]
})
export class ProductManagementModule {}
