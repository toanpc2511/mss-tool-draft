import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularMaterialModule } from 'src/app/angular-material.module';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SpinnerInterceptor } from '../../shared/interceptors/spinner.interceptor';
import { LpbElectricServiceRoutingModule } from './lpb-electric-service-routing.module';
import { ElectricPaymentAtCounterComponent } from './electric-payment-at-counter/electric-payment-at-counter.component';
import { ElectricAutomaticPaymentComponent } from './electric-automatic-payment/electric-automatic-payment.component';
import { ElectricReportComponent } from './electric-report/electric-report.component';
import { ElectricCreatePaymentComponent } from './electric-payment-at-counter/electric-create-payment/electric-create-payment.component';
import { ElectricViewTransactionComponent } from './electric-payment-at-counter/electric-view-transaction/electric-view-transaction.component';
import { ElectricSharedModule } from './shared/electric-shared.module';
import { ElectricApprovePaymentComponent } from './electric-payment-at-counter/electric-approve-payment/electric-approve-payment.component';
import {CreateTransactionComponent} from './electric-payment-by-file/create-transaction/create-transaction.component';
import {DetailTransactionComponent} from './electric-payment-by-file/detail-transaction/detail-transaction.component';
import {ElectricPaymentByFileComponent} from './electric-payment-by-file/electric-payment-by-file.component';
import { UploadFileComponent } from './electric-payment-by-file/create-transaction/upload-file/upload-file.component';
import { TransactionChangeDebtComponent } from './electric-payment-by-file/create-transaction/transaction-change-debt/transaction-change-debt.component';
import { TransactionRetailTranferComponent } from './electric-payment-by-file/create-transaction/transaction-retail-tranfer/transaction-retail-tranfer.component';
import { TransactionCompletedComponent } from './electric-payment-by-file/create-transaction/transaction-completed/transaction-completed.component';
import {MatStepperModule} from "@angular/material/stepper";
import { ApprovedTransactionComponent } from './electric-payment-by-file/approved-transaction/approved-transaction.component';
import { TabOneComponent } from './electric-payment-by-file/detail-transaction/tab-one/tab-one.component';
import { TabTwoComponent } from './electric-payment-by-file/detail-transaction/tab-two/tab-two.component';
import { ApprovedFileDetailComponent } from './electric-payment-by-file/approved-transaction/approved-file-detail/approved-file-detail.component';
import { ApprovedFileStepOneComponent } from './electric-payment-by-file/approved-transaction/approved-file-step-one/approved-file-step-one.component';
import { ApprovedFileStepTwoComponent } from './electric-payment-by-file/approved-transaction/approved-file-step-two/approved-file-step-two.component';
import { ApprovedFileStepThreeComponent } from './electric-payment-by-file/approved-transaction/approved-file-step-three/approved-file-step-three.component';
import { ApprovedFileStepFourComponent } from './electric-payment-by-file/approved-transaction/approved-file-step-four/approved-file-step-four.component';
import {DestroyService} from '../../shared/services/destroy.service';
import { RegisterTransactionAutoPaymentComponent } from './electric-automatic-payment/register-transaction-auto-payment/register-transaction-auto-payment.component';
import { CustomerRegisterComponent } from './electric-automatic-payment/customer-register/customer-register.component';
import { DetailCustomerRegisterComponent } from './electric-automatic-payment/customer-register/detail-customer-register/detail-customer-register.component';
import { ElectricAutoPayApproveComponent } from './electric-automatic-payment/electric-auto-pay-approve/electric-auto-pay-approve.component';
import { ElectricDetailRegisterInfoComponent } from './electric-automatic-payment/electric-detail-register-info/electric-detail-register-info.component';
import { ElectricAutoViewComponent } from './electric-automatic-payment/electric-auto-view/electric-auto-view.component';
import { DetailTransactionAutoPaymentComponent } from './electric-automatic-payment/detail-transaction-auto-payment/detail-transaction-auto-payment.component';
import { ElectricRevertComponent } from './electric-payment-at-counter/electric-revert/electric-revert.component';
import { ElectricReportCrossCheckingComponent } from './electric-report/electric-report-cross-checking/electric-report-cross-checking.component';
import { UpdateCustomerRegisterComponent } from './electric-automatic-payment/customer-register/update-customer-register/update-customer-register.component';
import { ImportFromLvbisComponent } from './electric-automatic-payment/import-from-lvbis/import-from-lvbis.component';

@NgModule({
  declarations: [
    ElectricPaymentAtCounterComponent,
    ElectricAutomaticPaymentComponent,
    ElectricReportComponent,
    ElectricCreatePaymentComponent,
    ElectricViewTransactionComponent,
    ElectricApprovePaymentComponent,
    ElectricPaymentByFileComponent,
    CreateTransactionComponent,
    DetailTransactionComponent,
    UploadFileComponent,
    TransactionChangeDebtComponent,
    TransactionRetailTranferComponent,
    TransactionCompletedComponent,
    ApprovedTransactionComponent,
    TabOneComponent,
    TabTwoComponent,
    ApprovedFileDetailComponent,
    ApprovedFileStepOneComponent,
    ApprovedFileStepTwoComponent,
    ApprovedFileStepThreeComponent,
    ApprovedFileStepFourComponent,
    RegisterTransactionAutoPaymentComponent,
    CustomerRegisterComponent,
    DetailCustomerRegisterComponent,
    ElectricAutoPayApproveComponent,
    ElectricDetailRegisterInfoComponent,
    ElectricAutoViewComponent,
    DetailTransactionAutoPaymentComponent,
    ElectricRevertComponent,
    ElectricReportCrossCheckingComponent,
    UpdateCustomerRegisterComponent,
    ImportFromLvbisComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LpbElectricServiceRoutingModule,
        SharedModule,
        NgSelectModule,
        AngularMaterialModule,
        ElectricSharedModule,
        MatStepperModule
    ],
  providers: [
    DestroyService,
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
  ],
    exports: [
        CreateTransactionComponent

    ]
})
export class LpbElectricServiceModule {
}
