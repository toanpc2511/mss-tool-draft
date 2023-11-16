import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {
  LpbBaseServiceComponentComponent
} from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';
import {ListComponent} from './list/list.component';
import {LpbHomeServiceComponent} from '../../shared/components/lpb-home-service/lpb-home-service.component';
import {ApproveUploadFileComponent} from './approve-upload-file/approve-upload-file.component';
import {EditPayTuitionComponent} from './edit-pay-tuition/edit-pay-tuition.component';
import {ApprovePayTuitionComponent} from './approve-pay-tuition/approve-pay-tuition.component';
import {ReportComponent} from './report/report.component';
import {
  TuitionEditCancelTransactionComponent
} from './pay-tuition/tuition-edit-cancel-transaction/tuition-edit-cancel-transaction.component';
import {
  TuitionViewTransactionComponent
} from './pay-tuition/tuition-view-transaction/tuition-view-transaction.component';
import {ListFileUploadComponent} from './list-file-upload/list-file-upload.component';
import {UploadFileComponent} from './list-file-upload/upload-file/upload-file.component';
import {TuitionApprovePaymentComponent} from './pay-tuition/tuition-approve-payment/tuition-approve-payment.component';
import {
  CreateTuitionTransactionComponent
} from './pay-tuition/create-tuition-transaction/create-tuition-transaction.component';


const routes: Routes = [
  {
    path: '', component: LpbBaseServiceComponentComponent, children: [
      // {
      //   path: 'functions', children: [
      //     { path: '', component: LpbHomeServiceComponent },
      //     { path: 'upload-file', component: UploadFileComponent },
      //     { path: 'approve-upload-file', component: ApproveUploadFileComponent },
      //     { path: 'pay-tuition', component: PayTuitionComponent },
      //     { path: 'edit-pay-tuition', component: EditPayTuitionComponent },
      //     { path: 'approve-pay-tuition', component: ApprovePayTuitionComponent },
      //     { path: 'report', component: ReportComponent },
      //   ]
      // },
      {
        path: 'list-file-upload', children: [
          {path: '', component: ListFileUploadComponent},
          {path: 'upload-file', component: UploadFileComponent},
        ]
      },
      {path: 'approve-upload-file', component: ApproveUploadFileComponent},
      {
        path: 'pay-tuition', children: [
          {path: '', component: TuitionEditCancelTransactionComponent},
          {path: 'transaction/create', component: CreateTuitionTransactionComponent},
          {path: 'view', component: TuitionViewTransactionComponent},
          // { path: 'approve', component: TuitionApprovePaymentComponent },
          // { path: 'change-debt-implements', component: WaterClearDebtsComponent },
          // { path: 'view-status', component: ViewStatusTransactionApproveComponent }
        ]
      },

      {
        path: 'approve-pay-tuition', children: [
          {path: '', component: TuitionApprovePaymentComponent},
          {path: 'view', component: TuitionViewTransactionComponent},
        ]
      },
      {
        path: 'transaction', children: [
          {path: 'create', component: CreateTuitionTransactionComponent}
        ]
      },
      {path: 'report', component: ReportComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpbTuitionServiceRoutingModule {
}
