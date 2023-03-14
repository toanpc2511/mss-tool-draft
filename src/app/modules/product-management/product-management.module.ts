import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductManagementComponent } from './product-management.component';
import { ProductManagementRoutingModule } from './product-management-routing.module';
import { ModalProductComponent } from './modal-product/modal-product.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { ProductComponent } from './product/product.component';

@NgModule({
  declarations: [ProductManagementComponent, ModalProductComponent, ViewProductComponent, ProductComponent],
  imports: [CommonModule, SharedModule, ProductManagementRoutingModule]
})
export class ProductManagementModule {}
