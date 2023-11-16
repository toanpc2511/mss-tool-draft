import { NgSelectModule } from '@ng-select/ng-select';
import { BillInfoComponent } from './components/bill-info/bill-info.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormMessageComponent } from './components/form-message/form-message.component';
import { LpbPaginatorComponent } from '../../../shared/components/lpb-paginator/lpb-paginator.component';
import { SharedModule } from 'src/app/shared.module';
import { AccountingStatusPipe } from './pipes/water.pipe';
import { ModalStatusTransactionComponent } from './components/modal-status-transaction/modal-status-transaction.component';
import { PaymentInfoComponent } from './components/payment-info/payment-info.component';

@NgModule({
  imports: [CommonModule, MatIconModule, MatDatepickerModule, MatTooltipModule, FormsModule, NgSelectModule, ReactiveFormsModule, SharedModule],
  declarations: [FormMessageComponent, BillInfoComponent, AccountingStatusPipe, ModalStatusTransactionComponent, PaymentInfoComponent],
  exports: [BillInfoComponent, AccountingStatusPipe, ModalStatusTransactionComponent, PaymentInfoComponent],
})
export class LvbisSharedModule { }
