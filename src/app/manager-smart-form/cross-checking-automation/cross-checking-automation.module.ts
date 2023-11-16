import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrossCheckingAutomationRoutingModule } from './cross-checking-automation-routing.module';
import { CrossCheckingComponent } from './cross-checking/cross-checking.component';
import { ReportCrossCheckingComponent } from './report-cross-checking/report-cross-checking.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {SharedModule} from '../../shared.module';
import { ApproveCrossCheckingComponent } from './approve-cross-checking/approve-cross-checking.component';
import {ProgressSpinnerModule} from '../../progress-spinner/progress-spinner.module';
import { ReportCrosscheckingSmsComponent } from './report-crosschecking-sms/report-crosschecking-sms.component';


@NgModule({
  declarations: [CrossCheckingComponent, ReportCrossCheckingComponent, ApproveCrossCheckingComponent, ReportCrosscheckingSmsComponent],
    imports: [
        CommonModule,
        CrossCheckingAutomationRoutingModule,
        FormsModule,
        NgSelectModule,
        SharedModule,
        ReactiveFormsModule,
        ProgressSpinnerModule
    ]
})
export class CrossCheckingAutomationModule { }
