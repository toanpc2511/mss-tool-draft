import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LpbBaseServiceComponentComponent} from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';
// import {CardIssuanceRequestComponent}
//   from '../../manager-smart-form/card-services/card-issuance-request/card-issuance-request.component';
import {
  CardLostDamagedRequestComponent
} from '../../manager-smart-form/card-services/card-lost-damaged-request/card-lost-damaged-request.component';
import {
  CardServicesApproveExtendComponent
} from '../../manager-smart-form/card-services/card-services-approve-extend/card-services-approve-extend.component';
import {
  ReportCardTransactionComponent
} from '../../manager-smart-form/card-services/report-card-transaction/report-card-transaction.component';
import {CardServicesExtendComponent} from '../../manager-smart-form/card-services/card-services-extend/card-services-extend.component';

const routes: Routes = [
  {
    path: '', component: LpbBaseServiceComponentComponent, children: [
      {path: 'card-services-extend', component: CardServicesExtendComponent},
      {path: 'approve', component: CardServicesApproveExtendComponent},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpbSupportCardServiceRoutingModule { }
