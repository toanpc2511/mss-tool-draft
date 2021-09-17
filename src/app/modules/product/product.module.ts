import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { InputTrimModule } from 'ng2-trim-directive';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { ListProductFuelModalComponent } from './list-product-fuel-modal/list-product-fuel-modal.component';
import { ListProductFuelComponent } from './list-product-fuel/list-product-fuel.component';
import { ProductModalComponent } from './product-modal/product-modal.component';
import { ProductRoutingModule } from './product-routing.module';
import { ProductTypeComponent } from './product-type/product-type.component';
import { ProductComponent } from './product.component';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { ListProductOtherComponent } from './list-product-other/list-product-other.component';
import { ListProductOtherModalComponent } from './list-product-other-modal/list-product-other-modal.component';

@NgModule({
  declarations: [
    ProductComponent,
    ProductModalComponent,
    ProductTypeComponent,
    ListProductFuelComponent,
    ListProductFuelModalComponent,
    ListProductOtherComponent,
    ListProductOtherModalComponent
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
    InputTrimModule,
    DirectivesModule
  ]
})
export class ProductModule {}
