import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LpbBaseServiceComponentComponent} from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';
import {CardRequestUpdatePhoneNumberComponent} from '../../manager-smart-form/card-services/card-request-update-phone-number/card-request-update-phone-number.component';
import {CardApproveUpdatePhoneNumberComponent} from '../../manager-smart-form/card-services/card-approve-update-phone-number/card-approve-update-phone-number.component';
import {ReportUpdateCifToSvboComponent} from '../../manager-smart-form/card-services/report-update-cif-to-svbo/report-update-cif-to-svbo.component';

const routes: Routes = [
  {
    path: '', component: LpbBaseServiceComponentComponent, children: [
      {path: 'create-request', component: CardRequestUpdatePhoneNumberComponent},
      {path: 'approve', component: CardApproveUpdatePhoneNumberComponent},
      {path: 'report', component: ReportUpdateCifToSvboComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpbUpdatePhoneToSvboRoutingModule { }
