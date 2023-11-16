import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LpbBaseServiceComponentComponent} from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';
import {CardServiceSearchEbsComponent} from '../../manager-smart-form/card-services/card-service-search-ebs/card-service-search-ebs.component';
import {CardLostDamagedRequestComponent} from '../../manager-smart-form/card-services/card-lost-damaged-request/card-lost-damaged-request.component';
import {CardServicesApproveExtendComponent} from '../../manager-smart-form/card-services/card-services-approve-extend/card-services-approve-extend.component';
import {ReportCardTransactionComponent} from '../../manager-smart-form/card-services/report-card-transaction/report-card-transaction.component';
import {CardServicesApproveComponent} from 'src/app/manager-smart-form/card-services/card-services-approve/card-services-approve.component';

const routes: Routes = [
  {
    path: '', component: LpbBaseServiceComponentComponent, children: [
      {path: 'return-card', component: CardServiceSearchEbsComponent},
      {path: 'lost-card', component: CardLostDamagedRequestComponent},
      {path: 'approve-original', component: CardServicesApproveComponent},
      {path: 'approve', component: CardServicesApproveExtendComponent},
      {path: 'report', component: ReportCardTransactionComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpbRequestCardServiceRoutingModule { }
