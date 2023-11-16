import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LpbWaterServiceRoutingModule} from './lpb-water-service-routing.module';
import { HistoryComponent } from './history/history.component';

import { WaterCreatePaymentComponent } from './water-payment-at-counter/water-create-payment/water-create-payment.component';
import { WaterApprovePaymentComponent } from './water-payment-at-counter/water-approve-payment/water-approve-payment.component';
import { WaterBillDetailComponent } from './water-payment-at-counter/water-bill-detail/water-bill-detail.component';
import { WaterAutomaticPaymentComponent } from './water-automatic-payment/water-automatic-payment.component';
import { WaterReportComponent } from './water-report/water-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { LvbisSharedModule } from './shared/lvbis-shared.module';
import { WaterEditCancelTransactionComponent } from './water-payment-at-counter/water-edit-cancel-transaction/water-edit-cancel-transaction.component';
import { WaterAutoPaySignUpComponent } from './water-automatic-payment/water-auto-pay-sign-up/water-auto-pay-sign-up.component';
import { WaterClearDebtsComponent } from './water-payment-at-counter/water-clear-debts/water-clear-debts.component';
import { WaterViewTransactionComponent } from './water-payment-at-counter/water-view-transaction/water-view-transaction.component';
import { WaterAutoViewComponent } from './water-automatic-payment/water-auto-view/water-auto-view.component';
import { ViewStatusTransactionApproveComponent } from './water-payment-at-counter/view-status-transaction-approve/view-status-transaction-approve.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {SpinnerInterceptor} from '../../shared/interceptors/spinner.interceptor';
import { WaterAutoPaymentApproveComponent } from './water-automatic-payment/water-auto-payment-approve/water-auto-payment-approve.component';
import { WaterDetailRegisterInfoComponent } from './water-automatic-payment/water-detail-register-info/water-detail-register-info.component';
import { CrossCheckingComponent } from './cross-checking/cross-checking.component';
import { CrossCheckingReportComponent } from './cross-checking-report/cross-checking-report.component';
import { WaterAutoCancelComponent } from './water-automatic-payment/water-auto-cancel/water-auto-cancel.component';
import { SearchBillCustomerComponent } from './search-bill-customer/search-bill-customer.component';
import { WaterOfflineUploadComponent } from './water-offline/water-offline-upload/water-offline-upload.component';
import { WaterOfflineComponent } from './water-offline/water-offline.component';
import { WaterOfflineDetailComponent } from './water-offline/water-offline-detail/water-offline-detail.component';
import { GuideLineComponent } from './guide-line/guide-line.component';


@NgModule({
  declarations: [
    HistoryComponent,
    WaterCreatePaymentComponent,
    WaterApprovePaymentComponent,
    WaterBillDetailComponent,
    WaterAutomaticPaymentComponent,
    WaterReportComponent,
    WaterEditCancelTransactionComponent,    
    WaterAutoPaySignUpComponent,
    WaterClearDebtsComponent,
    WaterViewTransactionComponent,    
    WaterAutoViewComponent,
    ViewStatusTransactionApproveComponent,
    WaterAutoPaymentApproveComponent,
    WaterDetailRegisterInfoComponent,
    CrossCheckingComponent,
    CrossCheckingReportComponent,
    WaterAutoCancelComponent,
    SearchBillCustomerComponent,
    WaterOfflineUploadComponent,
    WaterOfflineComponent,
    WaterOfflineDetailComponent,
    GuideLineComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LpbWaterServiceRoutingModule,
    SharedModule,
    NgSelectModule,
    AngularMaterialModule,
    LvbisSharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
  ],
  exports: [

  ]
})
export class LpbWaterServiceModule {
}
