
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderRequestListComponent } from './order-request-list/order-request-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'kho',
    pathMatch: 'full'
  },
  {
    path: 'yeu-cau-dat-hang',
    component: OrderRequestListComponent,
  },
  {
    path: 'don-dat-kho',
    component: OrderRequestListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryManagementRoutingModule {}
