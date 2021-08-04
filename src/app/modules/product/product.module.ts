import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { InputTrimModule } from 'ng2-trim-directive';
import { ProductRoutingModule } from './product-routing.module';
import { ListProductComponent } from './list-product/list-product.component';
import { ProductComponent } from './product.component';
import { ProductModalComponent } from './product-modal/product-modal.component';
import { ProductTypeComponent } from './product-type/product-type.component';
import { ListProductFuelComponent } from './list-product-fuel/list-product-fuel.component';

@NgModule({
  declarations: [ProductComponent, ListProductComponent, ProductModalComponent, ProductTypeComponent, ListProductFuelComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,
    NgbTooltipModule,
    InlineSVGModule,
    CRUDTableModule,
    FormsModule,
    SharedComponentsModule,
    ReactiveFormsModule,
    InputTrimModule
  ]
})
export class ProductModule {}
