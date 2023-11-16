import {RouterModule, Routes} from '@angular/router';
import {
  LpbBaseServiceComponentComponent
} from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';
import {NgModule} from '@angular/core';
import {SupplierConfigComponent} from './supplier-config/supplier-config.component';
import {SupplierModalComponent} from './supplier-config/supplier-modal/supplier-modal.component';
import {SupplierDetailComponent} from './supplier-config/supplier-detail/supplier-detail.component';

const routes: Routes = [
  {
    path: '',
    component: LpbBaseServiceComponentComponent,
    children: [
      {
        path: 'viettel-post-config',
        children: [
          {
            path: '',
            component: SupplierConfigComponent
          },
          {
            path: 'create',
            component: SupplierModalComponent
          },
          {
            path: 'update',
            component: SupplierModalComponent
          },
          {
            path: 'detail',
            component: SupplierDetailComponent
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
export class ViettelPostServiceConfigRoutingModule {
}
