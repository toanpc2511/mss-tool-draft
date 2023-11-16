import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {
  LpbBaseServiceComponentComponent
} from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';
import {SupplierConfigComponent} from './supplier-config/supplier-config.component';
import {CreateSupplierComponent} from './supplier-config/create-supplier/create-supplier.component';
import {DetailSupplierComponent} from './supplier-config/detail-supplier/detail-supplier.component';

const routes: Routes = [
  {
    path: '',
    component: LpbBaseServiceComponentComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'supplier-config'
      },
      {
        path: 'supplier-config',
        children: [
          {
            path: '',
            component: SupplierConfigComponent
          },
          {
            path: 'create',
            component: CreateSupplierComponent
          },
          {
            path: 'update',
            component: CreateSupplierComponent
          },
          {
            path: 'detail',
            component: DetailSupplierComponent
          }
        ]
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElectricServiceConfigRoutingModule {
}
