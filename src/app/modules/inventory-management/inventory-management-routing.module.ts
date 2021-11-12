
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderRequestListComponent } from './order-request-list/order-request-list.component';
import { OrderDetailsComponent } from './order-request-list/order-details/order-details.component';
import { CreateOrderComponent } from './order-request-list/create-order/create-order.component';
import { WareHouseOrderListComponent } from './warehouse-order-list/warehouse-order-list.component';
import { WareHouseOrderDetailComponent } from './warehouse-order-list/warehouse-order-detail/warehouse-order-detail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'kho',
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
        path: 'sua-hop-dong/:id',
        component: OrderDetailsComponent
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryManagementRoutingModule {}
