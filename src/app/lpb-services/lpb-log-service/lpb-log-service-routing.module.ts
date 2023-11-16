import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LpbBaseServiceComponentComponent} from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';
import {HistoryComponent} from './history/history.component';


const routes: Routes = [
  {
    path: '', component: LpbBaseServiceComponentComponent, children: [
      { path: 'history', component: HistoryComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpbLogServiceRoutingModule { }
