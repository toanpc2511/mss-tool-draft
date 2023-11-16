import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LpbCrossCheckingCreditCardServiceRoutingModule } from './lpb-cross-checking-credit-card-service-routing.module';
import { ListComponent as BankPaymentListComponent} from './bank-payment/list/list.component';
import { ListComponent as CreditCardPaymentListComponent} from './credit-card-payment/list/list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared.module';
import { ListComponent } from './report/list/list.component';



@NgModule({
  declarations: [BankPaymentListComponent, CreditCardPaymentListComponent, ListComponent],
  imports: [
    CommonModule,
    LpbCrossCheckingCreditCardServiceRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule
  ]
})
export class LpbCrossCheckingCreditCardServiceModule { }
