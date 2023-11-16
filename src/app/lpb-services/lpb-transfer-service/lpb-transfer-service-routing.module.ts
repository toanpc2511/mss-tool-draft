import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LpbBaseServiceComponentComponent } from 'src/app/shared/components/lpb-base-service-component/lpb-base-service-component.component';

import { ListComponent as InternalListComponent } from './internal/list/list.component';
import { CreateComponent as InternalCreateComponent } from './internal/create/create.component';
import { DetailComponent as InternalDetailComponent } from './internal/detail/detail.component';

import { CreateComponent as CitadCreateComponent } from './citad/create/create.component';
import { DetailComponent as CitadDetailComponent } from './citad/detail/detail.component';

import { CreateComponent as NapasCreateComponent } from './napas/create/create.component';
import { DetailComponent as NapasDetailComponent } from './napas/detail/detail.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: LpbBaseServiceComponentComponent,
    children: [
      {
        path: 'internal',
        component: HomeComponent,
      },
      {
        path: 'internal',
        children: [
          { path: 'create', component: InternalCreateComponent },
          { path: 'detail', component: InternalDetailComponent },
          { path: 'approve', component: InternalDetailComponent },
        ],
      },
      {
        path: 'citad',
        children: [
          { path: 'create', component: CitadCreateComponent },
          { path: 'detail', component: CitadDetailComponent },
          { path: 'approve', component: CitadDetailComponent },
        ],
      },
      {
        path: 'napas',
        children: [
          { path: 'create', component: NapasCreateComponent },
          { path: 'detail', component: NapasDetailComponent },
          { path: 'approve', component: NapasDetailComponent },
        ],
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LpbTransferServiceRoutingModule {}
