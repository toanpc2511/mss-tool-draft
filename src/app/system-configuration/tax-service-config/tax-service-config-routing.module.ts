import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {
  LpbBaseServiceComponentComponent
} from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';
import {GeneralCategoryComponent} from './general-category/general-category.component';

const routes: Routes = [
  {
    path: '',
    component: LpbBaseServiceComponentComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'general-category'
      },
      {
        path: 'general-category',
        component: GeneralCategoryComponent
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxServiceConfigRoutingModule {
}
