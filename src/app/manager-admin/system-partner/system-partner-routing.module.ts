import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ConnectEbsComponent} from './connect-ebs/connect-ebs.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'connect-ebs',
    pathMatch: 'full'
  },
  {
    path: 'connect-ebs', component: ConnectEbsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemPartnerRoutingModule { }
