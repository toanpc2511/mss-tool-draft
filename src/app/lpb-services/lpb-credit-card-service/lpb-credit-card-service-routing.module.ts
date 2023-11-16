import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LpbBaseServiceComponentComponent } from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';
import {HistoryComponent} from './history/history.component';
import {RegisterReleaseComponent} from './register-release/register-release.component';
import {QuantityRequestedComponent} from './quantity-requested/quantity-requested.component';
import {ApproveNhsComponent} from './approve-nhs/approve-nhs.component';
import {DetailsComponent} from './details/details.component';
import {ApproveKsvComponent} from './approve-ksv/approve-ksv.component';
import {ReportComponent} from './report/report.component';

const routes: Routes = [
  {
    path: '', component: LpbBaseServiceComponentComponent, children: [
      {path: 'history', component: HistoryComponent},
      {path: 'register-release', component: RegisterReleaseComponent},
      {path: 'quantity-requested', component: QuantityRequestedComponent},
      {path: 'headquarters-approve', component: ApproveNhsComponent},
      {path: 'details', component: DetailsComponent},
      {path: 'report', component: ReportComponent},
      {path: 'approve-credit-card', component: ApproveKsvComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpbCreditCardServiceRoutingModule { }
