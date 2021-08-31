import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListContractComponent } from './list-contract/list-contract.component';
import { CreateContractComponent } from './create-contract/create-contract.component';
import { DetailsContractComponent } from './details-contract/details-contract.component';

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
        component: ListContractComponent
      },
      {
        path: 'them-moi',
        component: CreateContractComponent
      },
      {
        path: 'chi-tiet/:contractId',
        component: DetailsContractComponent
      },
      {
        path: 'sua-hop-dong/:id',
        component: CreateContractComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractRoutingModule {}
