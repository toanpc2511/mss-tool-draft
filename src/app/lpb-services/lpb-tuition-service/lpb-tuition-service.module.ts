import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared.module';
import {LpbTuitionServiceRoutingModule} from './lpb-tuition-service-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ListComponent} from './list/list.component';
import {ApproveUploadFileComponent} from './approve-upload-file/approve-upload-file.component';
import {EditPayTuitionComponent} from './edit-pay-tuition/edit-pay-tuition.component';
import {ApprovePayTuitionComponent} from './approve-pay-tuition/approve-pay-tuition.component';
import {ReportComponent} from './report/report.component';
////

import { NgSelectModule } from '@ng-select/ng-select';
import { AngularMaterialModule } from 'src/app/angular-material.module';
// import { WaterAutoPaySignUpComponent } from './water-automatic-payment/water-auto-pay-sign-up/water-auto-pay-sign-up.component';
// import { WaterClearDebtsComponent } from './water-payment-at-counter/water-clear-debts/water-clear-debts.component';
// import { WaterViewTransactionComponent } from './water-payment-at-counter/water-view-transaction/water-view-transaction.component';
// import { WaterAutoViewComponent } from './water-automatic-payment/water-auto-view/water-auto-view.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {SpinnerInterceptor} from '../../shared/interceptors/spinner.interceptor';
import { TuitionEditCancelTransactionComponent } from './pay-tuition/tuition-edit-cancel-transaction/tuition-edit-cancel-transaction.component';
import { TuitionViewTransactionComponent } from './pay-tuition/tuition-view-transaction/tuition-view-transaction.component';
import {ListFileUploadComponent} from './list-file-upload/list-file-upload.component';
import {UploadFileComponent} from './list-file-upload/upload-file/upload-file.component';
import {
  CreateTuitionTransactionComponent
} from './pay-tuition/create-tuition-transaction/create-tuition-transaction.component';
import {TuitionApprovePaymentComponent} from './pay-tuition/tuition-approve-payment/tuition-approve-payment.component';
import {LvbisSharedModule} from './shared/lvbis-shared.module';
// import { CrossCheckingComponent } from './cross-checking/cross-checking.component';
// import { CrossCheckingReportComponent } from './cross-checking-report/cross-checking-report.component';

@NgModule({
  declarations: [ListComponent,
    ApproveUploadFileComponent,
    EditPayTuitionComponent,
    ApprovePayTuitionComponent,
    ReportComponent,
    ListFileUploadComponent,
    UploadFileComponent,
    TuitionEditCancelTransactionComponent,
    TuitionViewTransactionComponent,
    CreateTuitionTransactionComponent,
    TuitionApprovePaymentComponent,
    ApprovePayTuitionComponent
],
  exports: [
    UploadFileComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        LpbTuitionServiceRoutingModule,
        NgSelectModule,
        AngularMaterialModule,
        LvbisSharedModule
    ]

})
export class LpbTuitionServiceModule {
}
