import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LpbJobDashboardServiceRoutingModule} from './lpb-job-dashboard-service-routing.module';
import {ListComponent as RecurringJobListComponent} from './recurring-jobs/list/list.component';
import {ListComponent as JobListComponent} from './jobs/list/list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {SharedModule} from '../../shared.module';
import { ListComponent as ServersListComponent } from './servers/list/list.component';


@NgModule({
  declarations: [RecurringJobListComponent, JobListComponent, ServersListComponent],
  imports: [
    CommonModule,
    LpbJobDashboardServiceRoutingModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class LpbJobDashboardServiceModule {
}
