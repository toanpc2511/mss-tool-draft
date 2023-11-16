import {RouterModule, Routes} from '@angular/router';
import {LpbBaseServiceComponentComponent} from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';
import {NgModule} from '@angular/core';
import {UniversityConfigComponent} from './university-config/university-config.component';
import { UniversityDetailComponent } from './university-config/university-detail/university-detail.component';
import { UniversityModalComponent } from './university-config/university-modal/university-modal.component';


// @ts-ignore
const routes: Routes = [
  {
    path: '',
    component: LpbBaseServiceComponentComponent,
    children: [
      {
        path: 'university-config',
        children: [
          {
            path: '',
            component: UniversityConfigComponent
          },
          {
            path: 'create',
            component: UniversityModalComponent
          },
          {
            path: 'update',
            component: UniversityModalComponent
          },
          {
            path: 'detail',
            component: UniversityDetailComponent
          }
        ]
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TuitionServiceConfigRoutingModule {
}
