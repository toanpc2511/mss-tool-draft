import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LpbBaseServiceComponentComponent } from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';
import { PersonalTaxComponent } from './personal-tax/personal-tax.component';
import { BusinessTaxComponent } from './business-tax/business-tax.component';
import { CreatePersonalTaxComponent } from './personal-tax/create-personal-tax/create-personal-tax.component';
import { CreateSeflCollectedTaxComponent } from './personal-tax/create-sefl-collected-tax/create-sefl-collected-tax.component';
import {DetailPersonalTaxComponent} from './personal-tax/detail-personal-tax/detail-personal-tax.component';
import {ApproveTransactionExtralComponent} from './approve-transaction-extral/approve-transaction-extral.component';


const routes: Routes = [
  {
    path: '', component: LpbBaseServiceComponentComponent, children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'personal-tax'
      },
      {
        path: 'personal-tax',
        children: [
          {
            path: '',
            component: PersonalTaxComponent
          },
          {
            path: 'create',
            component: CreatePersonalTaxComponent
          },
          {
            path: 'detail',
            component: DetailPersonalTaxComponent
          },
          {
            path: 'create-self-collected-tax',
            component: CreateSeflCollectedTaxComponent
          }
        ]
      },
      {
        path: 'business-tax',
        component: BusinessTaxComponent
      },
      {
        path: 'approve-transaction',
        component: ApproveTransactionExtralComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpbTaxServiceRoutingModule {
}
