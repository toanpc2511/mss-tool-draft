import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LpbBaseServiceComponentComponent} from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';
import {CreateComponent} from './create/create.component';
import {ApproveComponent} from './approve/approve.component';
import {ListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', component: LpbBaseServiceComponentComponent, children: [
      {path: '', component: ListComponent},
      {path: 'create', component: CreateComponent},
      {path: 'approve', component: ApproveComponent},
      {path: 'list', component: ListComponent},
      {path: 'detail', component: ApproveComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpbDepositServiceRoutingModule {
}
