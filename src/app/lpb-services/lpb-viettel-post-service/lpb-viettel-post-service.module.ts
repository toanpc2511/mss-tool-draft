import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LpbViettelPostServiceRoutingModule } from './lpb-viettel-post-service-routing.module';
import { ListTransactionComponent } from './list-transaction/list-transaction.component';
import { TransactionCreateComponent } from './list-transaction/transaction-create/transaction-create.component';
import { TransactionDetailComponent } from './list-transaction/transaction-detail/transaction-detail.component';
import {SharedModule} from '../../shared.module';
import { TransactionInfoComponent } from './shared/components/transaction-info/transaction-info.component';
import {VtpApprovePaymentComponent} from './payment-transaction/vtp-approve-payment.component';
import {
  ViewDetailTransactionComponent
} from './payment-transaction/view-detail-transaction/view-detail-transaction.component';
import {ReportComponent} from './report-transaction/report.component';


@NgModule({
  declarations: [ListTransactionComponent,
    TransactionCreateComponent,
    TransactionDetailComponent,
    TransactionInfoComponent,
    VtpApprovePaymentComponent,
    ViewDetailTransactionComponent,
    ReportComponent],
  imports: [
    CommonModule,
    LpbViettelPostServiceRoutingModule,
    SharedModule,
  ]
})
export class LpbViettelPostServiceModule { }
