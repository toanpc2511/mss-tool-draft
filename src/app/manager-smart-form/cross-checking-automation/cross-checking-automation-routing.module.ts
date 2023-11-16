import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CrossCheckingComponent} from './cross-checking/cross-checking.component';
import {ReportCrossCheckingComponent} from './report-cross-checking/report-cross-checking.component';
import {ApproveCrossCheckingComponent} from './approve-cross-checking/approve-cross-checking.component';
import {ReportCrosscheckingSmsComponent} from './report-crosschecking-sms/report-crosschecking-sms.component';

const routes: Routes = [
  {
    path: 'create',
    component: CrossCheckingComponent
  },
  {
    path: 'approve',
    component: ApproveCrossCheckingComponent
  },
  {
    path: 'report',
    component: ReportCrossCheckingComponent
  },
  {
    path: 'report-sms',
    component: ReportCrosscheckingSmsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrossCheckingAutomationRoutingModule {
}
