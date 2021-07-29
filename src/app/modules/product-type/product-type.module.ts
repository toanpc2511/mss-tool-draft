import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListProductTypeComponent } from './list-product-type/list-product-type.component';
import { ProductTypeModalComponent } from './product-type-modal/product-type-modal.component';
import { ProductTypeRoutingModule } from './product-type-routing.module';
import { ProductTypeComponent } from './product-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { InputTrimModule } from 'ng2-trim-directive';

@NgModule({
  declarations: [ProductTypeComponent, ListProductTypeComponent, ProductTypeModalComponent],
  imports: [
    CommonModule,
    ProductTypeRoutingModule,
    NgbTooltipModule,
    InlineSVGModule,
    CRUDTableModule,
    FormsModule,
    SharedComponentsModule,
    ReactiveFormsModule,
    InputTrimModule
  ]
})
export class ProductTypeModule {}
