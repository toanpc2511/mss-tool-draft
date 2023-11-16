import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProgressSpinnerModule } from 'src/app/progress-spinner/progress-spinner.module';
import { SharedModule } from 'src/app/shared.module';
import { SpinnerInterceptor } from '../../shared/interceptors/spinner.interceptor';
import { ApproveComponent } from './approve/approve.component';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { LpbDepositServiceRoutingModule } from './lpb-deposit-service-routing.module';
import { DepositFormComponent } from './shared/components/deposit-form/deposit-form.component';
import { SearchTransactionsFormComponent } from './shared/components/search-transactions-form/search-transactions-form.component';
import { TransactionStatusPipe } from './shared/pipes/transaction-status.pipe';
import { SignatureListComponent } from './shared/components/signature-list/signature-list.component';
import { IdentityCertificationComponent } from './shared/components/identity-certification/identity-certification.component';
import { CurrentAccFormPrintComponent } from './shared/components/current-acc-form-print/current-acc-form-print.component';

@NgModule({
  declarations: [
    CreateComponent,
    ApproveComponent,
    ListComponent,
    DepositFormComponent,
    SearchTransactionsFormComponent,
    TransactionStatusPipe,
    SignatureListComponent,
    IdentityCertificationComponent,
    CurrentAccFormPrintComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedModule,
    ProgressSpinnerModule,
    LpbDepositServiceRoutingModule,
    MatIconModule,
    MatTabsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    SearchTransactionsFormComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
  ],
})
export class LpbDepositServiceModule {}
