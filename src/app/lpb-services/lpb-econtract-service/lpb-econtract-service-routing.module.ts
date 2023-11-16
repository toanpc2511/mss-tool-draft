import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LpbBaseServiceComponentComponent} from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';
import {ListComponent} from './list/list.component';
import {ReportComponent} from './report/report.component';
import {ApproveComponent} from './approve/approve.component';


const routes: Routes = [{
  path: '', component: LpbBaseServiceComponentComponent, children: [
    {
      path: 'list', children: [
        {path: '', component: ListComponent},
        {path: 'create', component: ListComponent},
      ]
    },
    {
      path: 'report', children: [
        {path: '', component: ReportComponent},
      ]
    },
    {
      path: 'approve', children: [
        {path: '', component: ApproveComponent},
      ]
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpbEcontractServiceRoutingModule {
}
