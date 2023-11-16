import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LpbLogServiceRoutingModule } from './lpb-log-service-routing.module';
import { HistoryComponent } from './history/history.component';
import {SharedModule} from '../../shared.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {SpinnerInterceptor} from '../../shared/interceptors/spinner.interceptor';


@NgModule({
  declarations: [HistoryComponent],
  imports: [
    CommonModule,
    LpbLogServiceRoutingModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
  ],
})
export class LpbLogServiceModule { }
