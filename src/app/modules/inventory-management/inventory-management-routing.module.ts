
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { UpdateOrderComponent } from './order-request-list/update-order/update-order.component';
import { CreateExportInventoryComponent } from './export-inventory/create-export-inventory/create-export-inventory.component';
import {FuelInventoryListComponent} from "./fuel-inventory-list/fuel-inventory-list.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'ton-kho-nhien-lieu',
    component: FuelInventoryListComponent
  },
  {
    path: 'yeu-cau-dat-hang',
    children: [
      {
        path: '',
        component: OrderRequestListComponent
      },
      {
        path: 'them-moi',
        component: CreateOrderComponent
      },
      {
        path: 'chi-tiet/:id',
        component: OrderDetailsComponent
      },
      {
        path: 'sua-yeu-cau/:id',
        component: UpdateOrderComponent
      }
    ]
  },
  {
    path: 'don-dat-kho',
    children: [
      {
        path: '',
        component: WareHouseOrderListComponent,
      },
      {
        path: 'chi-tiet/:id',
        component: WareHouseOrderDetailComponent,
      },
      {
        path: 'tao-yeu-cau/:id',
        component: CreateWarehouseOrderComponent,
      }
    ]
  },
  {
    path: 'xuat-kho',
    children: [
      {
        path: '',
        component: ExportInventoryComponent,
      },
      {
        path: 'chi-tiet/:id',
        component: ExportInventoryDetailComponent,
      },
      {
        path: 'tao-moi',
        component: CreateExportInventoryComponent,
      },
    ]
  },
  {
    path: 'nhap-kho',
    children: [
      {
        path: '',
        component: ImportInventoryComponent,
      },
      {
        path: 'chi-tiet/:id',
        component: ImportingInventoryDetailComponent
      }
    ]
  },
  {
    path: 'tinh-kho-do-be',
    children: [
      {
        path: '',
        component: ReportMeasureTankComponent
      }
    ]
  },
  {
    path: 'tinh-kho-kich-bom',
    children: [
      {
        path: '',
        component: ReportMinTankComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryManagementRoutingModule {}
