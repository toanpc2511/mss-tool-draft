import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LpbBaseServiceComponentComponent } from 'src/app/shared/components/lpb-base-service-component/lpb-base-service-component.component';
import { CreateComponent as CreateSavingComponent } from './saving/create/create.component';
import { DetailComponent as DetailSavingComponent } from './saving/detail/detail.component';

import { CreateComponent as CreateSettlementComponent } from './finalize/create/create.component';
import { DetailComponent as DetailSettlementComponent } from './finalize/detail/detail.component';
import { ListRequestComponent } from './list/list-request/list-request.component';
import { ListPendingComponent } from './list/list-pending/list-pending.component';

const routes: Routes = [
  {
    path: '',
    component: LpbBaseServiceComponentComponent,
    children: [
      {
        path: 'transaction',
        component: ListRequestComponent,
      },
      {
        path: 'transaction',
        children: [
          { path: 'pending', component: ListPendingComponent },
          { path: 'create', component: CreateSavingComponent },
          { path: 'detail', component: DetailSavingComponent },
          {
            path: 'finalize-saving',
            children: [
              { path: 'create', component: CreateSettlementComponent },
              { path: 'detail', component: DetailSettlementComponent },
            ],
          },
        ],
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LpbSavingsServiceRoutingModule {}
