import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCustomerComponent } from './list-customer/list-customer.component';
import { DetailCustomerComponent } from './detail-customer/detail-customer.component';
import { DetailsContractComponent } from '../contract/details-contract/details-contract.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'danh-sach',
    pathMatch: 'full'
  },
  {
    path: 'danh-sach',
    children: [
      {
        path: '',
        component: ListCustomerComponent
      },
      {
        path: 'chi-tiet/:customerId',
        children: [
          {
            path: '',
            component: DetailCustomerComponent
          },
          {
            path: 'chi-tiet-hop-dong/:contractId',
            component: DetailsContractComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerManagementRoutingModule {}
