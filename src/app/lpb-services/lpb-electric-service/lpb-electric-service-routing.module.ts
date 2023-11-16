import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LpbBaseServiceComponentComponent } from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';
import { ElectricPaymentAtCounterComponent } from './electric-payment-at-counter/electric-payment-at-counter.component';
import { ElectricAutomaticPaymentComponent } from './electric-automatic-payment/electric-automatic-payment.component';
import { ElectricReportComponent } from './electric-report/electric-report.component';
import { ElectricCreatePaymentComponent } from './electric-payment-at-counter/electric-create-payment/electric-create-payment.component';
import { ElectricViewTransactionComponent } from './electric-payment-at-counter/electric-view-transaction/electric-view-transaction.component';
import { ElectricApprovePaymentComponent } from './electric-payment-at-counter/electric-approve-payment/electric-approve-payment.component';
import { ElectricPaymentByFileComponent } from './electric-payment-by-file/electric-payment-by-file.component';
import { CreateTransactionComponent } from './electric-payment-by-file/create-transaction/create-transaction.component';
import { DetailTransactionComponent } from './electric-payment-by-file/detail-transaction/detail-transaction.component';
import { ApprovedTransactionComponent } from './electric-payment-by-file/approved-transaction/approved-transaction.component';
import { ApprovedFileDetailComponent } from './electric-payment-by-file/approved-transaction/approved-file-detail/approved-file-detail.component';
import {
  RegisterTransactionAutoPaymentComponent
} from './electric-automatic-payment/register-transaction-auto-payment/register-transaction-auto-payment.component';
import {CustomerRegisterComponent} from './electric-automatic-payment/customer-register/customer-register.component';
import {
  DetailCustomerRegisterComponent
} from "./electric-automatic-payment/customer-register/detail-customer-register/detail-customer-register.component";
import { ElectricAutoPayApproveComponent } from './electric-automatic-payment/electric-auto-pay-approve/electric-auto-pay-approve.component';
import { DetailTransactionAutoPaymentComponent } from './electric-automatic-payment/detail-transaction-auto-payment/detail-transaction-auto-payment.component';
import { UpdateCustomerRegisterComponent } from './electric-automatic-payment/customer-register/update-customer-register/update-customer-register.component';
import {ImportFromLvbisComponent} from './electric-automatic-payment/import-from-lvbis/import-from-lvbis.component';

const routes: Routes = [
  {
    path: '', component: LpbBaseServiceComponentComponent, children: [
      {
        path: 'pay-at-counter',
        children: [
          { path: '', component: ElectricPaymentAtCounterComponent },
          { path: 'create', component: ElectricCreatePaymentComponent },
          { path: 'view', component: ElectricViewTransactionComponent },
          { path: 'approve', component: ElectricApprovePaymentComponent },
          { path: 'change-debt-implements', component: null },
          { path: 'view-status', component: null }
        ]
      },
      {
        path: 'auto-payment',
        children: [
          { path: '', redirectTo: 'transactions', pathMatch: 'full' },
          { path: 'transactions', component: ElectricAutomaticPaymentComponent },
          {
            path: 'list-customer',
            children: [
              { path: '', component: CustomerRegisterComponent},
              { path: 'detail', component: DetailCustomerRegisterComponent},
              { path: 'update', component: UpdateCustomerRegisterComponent}
            ]
          },
          { path: 'approve', component: ElectricAutoPayApproveComponent },
          { path: 'create', component: RegisterTransactionAutoPaymentComponent },
          { path: 'approve/view', component: DetailTransactionAutoPaymentComponent },
          { path: 'detail', component: DetailTransactionAutoPaymentComponent },
          { path: 'import-from-lvbis', component: ImportFromLvbisComponent },
        ]
      },
      {
        path: 'pay-at-file',
        children: [
          { path: '', redirectTo: 'transactions', pathMatch: 'full' },
          { path: 'transactions', component: ElectricPaymentByFileComponent },
          { path: 'create', component: CreateTransactionComponent },
          { path: 'detail', component: DetailTransactionComponent },
          { path: 'approve', component: ApprovedTransactionComponent },
          { path: 'approve/detail', component: ApprovedFileDetailComponent },
        ]
      },

      { path: 'report', component: ElectricReportComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpbElectricServiceRoutingModule {
}
