import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PumpCodeManagementComponent } from './pump-code-management.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'danh-sach',
    pathMatch: 'full'
  },
  {
    path: 'danh-sach',
    component: PumpCodeManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PumpCodeManagementRoutingModule {}
