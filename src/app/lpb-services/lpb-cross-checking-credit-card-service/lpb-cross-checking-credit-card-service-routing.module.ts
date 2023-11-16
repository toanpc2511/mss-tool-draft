import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LpbBaseServiceComponentComponent} from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';
import {ListComponent as BankPaymentListComponent} from './bank-payment/list/list.component';
import {ListComponent as CreditCardPaymentListComponent} from './credit-card-payment/list/list.component';
import {ListComponent as ReportListComponent} from './report/list/list.component';

const routes: Routes = [
  {
    path: '', component: LpbBaseServiceComponentComponent, children: [
      {
        path: 'bank-payment', children: [
          {path: '', component: BankPaymentListComponent}
        ]
      },
      {
        path: 'credit-card-payment', children: [
          {path: '', component: CreditCardPaymentListComponent}
        ]
      },
      {
        path: 'report', children: [
          {path: '', component: ReportListComponent}
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpbCrossCheckingCreditCardServiceRoutingModule {
}
