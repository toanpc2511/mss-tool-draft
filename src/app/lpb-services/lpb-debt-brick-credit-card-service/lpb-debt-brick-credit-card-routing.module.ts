import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LpbBaseServiceComponentComponent} from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';

import {HistoryComponent} from '../lpb-water-service/history/history.component';
import {CrossCheckingComponent} from '../../manager-smart-form/cross-checking-automation/cross-checking/cross-checking.component';
import {ApproveCrossCheckingComponent} from '../../manager-smart-form/cross-checking-automation/approve-cross-checking/approve-cross-checking.component';
import {ReportCrossCheckingComponent} from '../../manager-smart-form/cross-checking-automation/report-cross-checking/report-cross-checking.component';

const routes: Routes = [
  {
    path: '', component: LpbBaseServiceComponentComponent, children: [
      {path: 'create', component: CrossCheckingComponent},
      {path: 'approve', component: ApproveCrossCheckingComponent},
      {path: 'report', component: ReportCrossCheckingComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpbDebtBrickCreditCardRoutingModule { }
