import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LpbBaseServiceComponentComponent} from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';
import {CccdComponent} from './cccd/cccd.component';
import {DetailComponent} from './cccd/detail/detail.component';

const routes: Routes = [
  {
    path: '', component: LpbBaseServiceComponentComponent, children: [
      {
        path: 'cccd', children: [
          {path: '', component: CccdComponent},
          {path: 'view', component: DetailComponent},
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpbCccdServiceRoutingModule {
}
