import {WaterAutoPaymentApproveComponent} from './water-automatic-payment/water-auto-payment-approve/water-auto-payment-approve.component';
import {
  ViewStatusTransactionApproveComponent
} from './water-payment-at-counter/view-status-transaction-approve/view-status-transaction-approve.component';
import {WaterApprovePaymentComponent} from './water-payment-at-counter/water-approve-payment/water-approve-payment.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LpbBaseServiceComponentComponent} from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';
import {HistoryComponent} from './history/history.component';
import {WaterCreatePaymentComponent} from './water-payment-at-counter/water-create-payment/water-create-payment.component';
import {
  WaterEditCancelTransactionComponent
} from './water-payment-at-counter/water-edit-cancel-transaction/water-edit-cancel-transaction.component';
import {WaterAutomaticPaymentComponent} from './water-automatic-payment/water-automatic-payment.component';
import {WaterClearDebtsComponent} from './water-payment-at-counter/water-clear-debts/water-clear-debts.component';
import {WaterViewTransactionComponent} from './water-payment-at-counter/water-view-transaction/water-view-transaction.component';
import {WaterAutoPaySignUpComponent} from './water-automatic-payment/water-auto-pay-sign-up/water-auto-pay-sign-up.component';
import {WaterAutoViewComponent} from './water-automatic-payment/water-auto-view/water-auto-view.component';
import {WaterReportComponent} from './water-report/water-report.component';
import {CrossCheckingReportComponent} from './cross-checking-report/cross-checking-report.component';
import {CrossCheckingComponent} from './cross-checking/cross-checking.component';
import {WaterAutoCancelComponent} from './water-automatic-payment/water-auto-cancel/water-auto-cancel.component';
import {SearchBillCustomerComponent} from './search-bill-customer/search-bill-customer.component';
import {WaterOfflineComponent} from './water-offline/water-offline.component';
import {WaterOfflineUploadComponent} from './water-offline/water-offline-upload/water-offline-upload.component';
import {WaterOfflineDetailComponent} from './water-offline/water-offline-detail/water-offline-detail.component';
import {GuideLineComponent} from './guide-line/guide-line.component';


const routes: Routes = [
  {
    path: '', component: LpbBaseServiceComponentComponent, children: [
      {
        path: 'pay-at-counter',
        children: [
          {path: '', component: WaterEditCancelTransactionComponent},
          {path: 'create', component: WaterCreatePaymentComponent},
          {path: 'view', component: WaterViewTransactionComponent},
          {path: 'approve', component: WaterApprovePaymentComponent},
          {path: 'change-debt-implements', component: WaterClearDebtsComponent},
          {path: 'view-status', component: ViewStatusTransactionApproveComponent},
        ]
      },
      {
        path: 'auto-payment',
        children: [
          {path: '', component: WaterAutomaticPaymentComponent},
          {path: 'approve', component: WaterAutoPaymentApproveComponent},
          {path: 'create', component: WaterAutoPaySignUpComponent},
          {path: 'view', component: WaterAutoViewComponent},
          {path: 'cancel', component: WaterAutoCancelComponent},
        ]
      },
      {path: 'history', component: HistoryComponent},
      {path: 'report', component: WaterReportComponent},
      {path: 'cross-checking', component: CrossCheckingComponent},
      {path: 'cross-checking-report', component: CrossCheckingReportComponent},
      {path: 'search-bill-customer', component: SearchBillCustomerComponent},
      {path: 'guide-line', component: GuideLineComponent},
      {
        path: 'data-offline',
        children: [
          {path: '', component: WaterOfflineComponent},
          {path: 'create', component: WaterOfflineUploadComponent},
          {path: 'view', component: WaterOfflineDetailComponent}
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpbWaterServiceRoutingModule {
}
