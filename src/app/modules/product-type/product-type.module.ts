import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListProductTypeComponent } from './list-product-type/list-product-type.component';
import { ProductTypeModalComponent } from './product-type-modal/product-type-modal.component';
import { ProductTypeRoutingModule } from './product-type-routing.module';
import { ProductTypeComponent } from './product-type.component';

@NgModule({
  declarations: [ProductTypeComponent, ListProductTypeComponent, ProductTypeModalComponent],
  imports: [CommonModule, ProductTypeRoutingModule]
})
export class ProductTypeModule {}
