import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LpbVietlottServiceRoutingModule } from './lpb-vietlott-service-routing.module';
import { ListRechargeComponent } from './list-recharge/list-recharge.component';
import { RechargeDetailComponent } from './list-recharge/recharge-detail/recharge-detail.component';
import { RechargeCreateComponent } from './list-recharge/recharge-create/recharge-create.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared.module';
import {TransactionInfoComponent} from './shared/components/transaction-info/transaction-info.component';
import {AngularMaterialModule} from '../../angular-material.module';
import { RechargeRetryComponent } from './list-recharge/recharge-retry/recharge-retry.component';
import { ReportComponent } from './report/report.component';
import { AuthorizeManageComponent } from './authorize-manage/authorize-manage.component';
import { QueryTransactionComponent } from './query-transaction/query-transaction.component';
import { RechargeApproveComponent } from './list-recharge/recharge-approve/recharge-approve.component';
import {ConfigFeeComponent} from './config-fee/config-fee.component';
import {UpdateConfigFeeComponent} from './config-fee/view-update-config-fee/view-update-config-fee.component';


@NgModule({
  declarations: [ListRechargeComponent,
    RechargeDetailComponent,
    RechargeCreateComponent,
    TransactionInfoComponent,
    RechargeRetryComponent,
    ReportComponent,
    AuthorizeManageComponent,
    QueryTransactionComponent,
    RechargeApproveComponent,
    ConfigFeeComponent,
    UpdateConfigFeeComponent],
  imports: [
    CommonModule,
    LpbVietlottServiceRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    AngularMaterialModule,
  ]
})
export class LpbVietlottServiceModule { }
