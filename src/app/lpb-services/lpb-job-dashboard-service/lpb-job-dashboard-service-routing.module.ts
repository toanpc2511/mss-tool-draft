import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LpbBaseServiceComponentComponent} from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';
import {ListComponent as RecurringJobsListComponent} from './recurring-jobs/list/list.component';
import {ListComponent as JobsListComponent} from './jobs/list/list.component';
import {ListComponent as ServerListComponent} from './servers/list/list.component';



const routes: Routes = [
  {
    path: '', component: LpbBaseServiceComponentComponent, children: [
      {
        path: 'recurring-jobs', children: [
          {path: '', component: RecurringJobsListComponent}
        ]
      },
      {
        path: 'jobs', children: [
          {path: '', component: JobsListComponent}
        ]
      },
      {
        path: 'servers', children: [
          {path: '', component: ServerListComponent}
        ]
      }
    ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpbJobDashboardServiceRoutingModule { }
