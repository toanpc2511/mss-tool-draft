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
import { CreateWarehouseOrderComponent } from './warehouse-order-list/create-warehouse-order/create-warehouse-order.component';
import { ExportInventoryComponent } from './export-inventory/export-inventory.component';
import { ImportInventoryComponent } from './import-inventory/import-inventory.component';
import { ExportInventoryDetailComponent } from './export-inventory/export-inventory-detail/export-inventory-detail.component';
import { ImportingInventoryDetailComponent } from './import-inventory/importing-inventory-detail/importing-inventory-detail.component';
import { ReportMeasureTankComponent } from './report-measure-tank/report-measure-tank.component';
import { ReportMinTankComponent } from './report-min-tank/report-min-tank.component';
import { ModalReportMeasureTankComponent } from './report-measure-tank/modal-report-measure-tank/modal-report-measure-tank.component';
import { ModalReportMinTankComponent } from './report-min-tank/modal-report-min-tank/modal-report-min-tank.component';
import { UpdateOrderComponent } from './order-request-list/update-order/update-order.component';
import { CreateExportInventoryComponent } from './export-inventory/create-export-inventory/create-export-inventory.component';

@NgModule({
  declarations: [InventoryManagementComponent, OrderRequestListComponent, OrderDetailsComponent, CreateOrderComponent, WareHouseOrderListComponent, WareHouseOrderDetailComponent, CreateWarehouseOrderComponent, ExportInventoryComponent, ImportInventoryComponent, ImportingInventoryDetailComponent, ExportInventoryDetailComponent, ReportMeasureTankComponent, ReportMinTankComponent, ModalReportMeasureTankComponent, ModalReportMinTankComponent, UpdateOrderComponent, CreateExportInventoryComponent],
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
