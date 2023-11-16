import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProgressSpinnerModule } from 'src/app/progress-spinner/progress-spinner.module';
import { SharedModule } from 'src/app/shared.module';

import { MatTabsModule } from '@angular/material/tabs';
import { LpbDepositServiceModule } from '../lpb-deposit-service/lpb-deposit-service.module';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { LpbWithdrawServiceRoutingModule } from './lpb-withdraw-service-routing.module';
import { WithdrawFormComponent } from './shared/components/withdraw-form/withdraw-form.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SpinnerInterceptor } from 'src/app/shared/interceptors/spinner.interceptor';
import { ApproveComponent } from './approve/approve.component';


@NgModule({
  declarations: [WithdrawFormComponent, ListComponent, ApproveComponent, CreateComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedModule,
    ProgressSpinnerModule,
    LpbWithdrawServiceRoutingModule,
    MatIconModule,
    MatTabsModule,
    LpbDepositServiceModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
  ]
})
export class LpbWithdrawServiceModule {}
