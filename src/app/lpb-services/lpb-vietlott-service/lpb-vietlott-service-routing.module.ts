import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  LpbBaseServiceComponentComponent
} from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';
import {ListRechargeComponent} from './list-recharge/list-recharge.component';
import {RechargeCreateComponent} from './list-recharge/recharge-create/recharge-create.component';
import { RechargeDetailComponent } from './list-recharge/recharge-detail/recharge-detail.component';
import {RechargeRetryComponent} from './list-recharge/recharge-retry/recharge-retry.component';
import {ReportComponent} from './report/report.component';
import {AuthorizeManageComponent} from './authorize-manage/authorize-manage.component';
import {QueryTransactionComponent} from './query-transaction/query-transaction.component';
import {RechargeApproveComponent} from './list-recharge/recharge-approve/recharge-approve.component';
import {ConfigFeeComponent} from './config-fee/config-fee.component';

import {UpdateConfigFeeComponent} from './config-fee/view-update-config-fee/view-update-config-fee.component';

// @ts-ignore
const routes: Routes = [
  {
    path: '', component: LpbBaseServiceComponentComponent, children: [
      {
        path: 'list-recharge',
        children: [
          { path: '', component: ListRechargeComponent },
          { path: 'create', component: RechargeCreateComponent },
          { path: 'view', component: RechargeDetailComponent },
          { path: 'retry', component: RechargeRetryComponent },
        ]
      },
      {
        path: 'approve-recharge',
        children: [
          { path: '', component: RechargeApproveComponent },
          { path: 'view', component: RechargeDetailComponent },
        ]
      },
      { path: 'report', component: ReportComponent},
      { path: 'authorize-manage', component: AuthorizeManageComponent},
      { path: 'query-transaction', component: QueryTransactionComponent},
      { path: 'config-fee', children: [
          {path: '', component: ConfigFeeComponent},
          {path: 'update-config-fee', component: UpdateConfigFeeComponent},
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpbVietlottServiceRoutingModule {}

