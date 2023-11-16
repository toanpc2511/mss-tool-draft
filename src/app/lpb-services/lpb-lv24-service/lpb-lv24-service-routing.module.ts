import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LpbBaseServiceComponentComponent } from 'src/app/shared/components/lpb-base-service-component/lpb-base-service-component.component';

import { CreateComponent as CreateLockUnlockResetPassword } from './lock-unlock-reset-password/create/create.component';
import { DetailComponent as DetailLockUnlockResetPassword } from './lock-unlock-reset-password/detail/detail.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    component: LpbBaseServiceComponentComponent,
    children: [
      {
        path: 'open-lock-reset',
        children: [
          { path: '', component: ListComponent },
          { path: 'create', component: CreateLockUnlockResetPassword },
          { path: 'detail', component: DetailLockUnlockResetPassword },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LpbLv24ServiceRoutingModule {}
