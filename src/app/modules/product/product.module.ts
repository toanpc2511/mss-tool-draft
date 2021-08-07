import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { InputTrimModule } from 'ng2-trim-directive';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { DecimalMaskDirective } from '../../shared/directives/decimal-mask.directive';
import { ListProductFuelModalComponent } from './list-product-fuel-modal/list-product-fuel-modal.component';
import { ListProductFuelComponent } from './list-product-fuel/list-product-fuel.component';
import { ProductModalComponent } from './product-modal/product-modal.component';
import { ProductRoutingModule } from './product-routing.module';
import { ProductTypeComponent } from './product-type/product-type.component';
import { ProductComponent } from './product.component';

@NgModule({
  declarations: [
    ProductComponent,
    ProductModalComponent,
    ProductTypeComponent,
    ListProductFuelComponent,
    ListProductFuelModalComponent,
    DecimalMaskDirective
  ],
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
