
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
import { ReportInventoryComponent } from './report-inventory/report-inventory.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
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
        component: CreateOrderComponent
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
      }
    ]
  },
  {
    path: 'nhap-kho',
    children: [
      {
        path: '',
        component: ImportInventoryComponent,
      }
    ]
  },
  {
    path: 'tinh-kho-do-be',
    children: [
      {
        path: '',
        component: ReportInventoryComponent
      }
    ]
  },
  {
    path: 'tinh-kho-kich-bom',
    children: [
      {
        path: '',
        component: ReportInventoryComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryManagementRoutingModule {}
