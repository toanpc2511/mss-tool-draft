import { AuthModule } from './../auth/auth.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbAccordionModule,
  NgbDatepickerModule,
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { InputTrimModule } from 'ng2-trim-directive';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { NgSelectModule } from 'src/app/shared/components/ng-select/public-api';
import { InventoryManagementRoutingModule } from './inventory-management-routing.module';
import { InventoryManagementComponent } from './inventory-management.component';
import { OrderRequestListComponent } from './order-request-list/order-request-list.component';
import { OrderDetailsComponent } from './order-request-list/order-details/order-details.component';
import { CreateOrderComponent } from './order-request-list/create-order/create-order.component';
import { WareHouseOrderListComponent } from './warehouse-order-list/warehouse-order-list.component';
import { WareHouseOrderDetailComponent } from './warehouse-order-list/warehouse-order-detail/warehouse-order-detail.component';

@NgModule({
  declarations: [InventoryManagementComponent, OrderRequestListComponent, OrderDetailsComponent, CreateOrderComponent, WareHouseOrderListComponent, WareHouseOrderDetailComponent],
  imports: [
    CommonModule,
    InventoryManagementRoutingModule,
    NgbTooltipModule,
    NgbDatepickerModule,
    NgbAccordionModule,
    NgSelectModule,
    InlineSVGModule,
    CRUDTableModule,
    FormsModule,
    SharedComponentsModule,
    ReactiveFormsModule,
    InputTrimModule,
    DirectivesModule,
    PipesModule,
    AuthModule
  ]
})
export class InventoryManagementModule {}
