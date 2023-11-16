import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {
  LpbBaseServiceComponentComponent
} from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';
import {ListTransactionComponent} from './list-transaction/list-transaction.component';
import {TransactionDetailComponent} from './list-transaction/transaction-detail/transaction-detail.component';
import {TransactionCreateComponent} from './list-transaction/transaction-create/transaction-create.component';
import {VtpApprovePaymentComponent} from './payment-transaction/vtp-approve-payment.component';
import {
  ViewDetailTransactionComponent
} from './payment-transaction/view-detail-transaction/view-detail-transaction.component';
import {ReportComponent} from './report-transaction/report.component';

const routes: Routes = [
  {
    path: '', component: LpbBaseServiceComponentComponent, children: [
      {
        path: 'list-transaction',
        children: [
          {path: '', component: ListTransactionComponent},
          {path: 'create', component: TransactionCreateComponent},
          {path: 'view', component: TransactionDetailComponent},
        ]
      },
      {
        path: 'payment-transaction', children: [
          {path: '', component: VtpApprovePaymentComponent},
          {path: 'view-detail-transaction', component: ViewDetailTransactionComponent},
        ]
      },
      {
        path: 'report-transaction', children: [
          {path: '', component: ReportComponent},
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpbViettelPostServiceRoutingModule {
}
