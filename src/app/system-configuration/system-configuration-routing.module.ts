import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SmartFormComponent} from '../manager-smart-form/smart-form.components';

const routes: Routes = [
  {
    path: '',
    component: SmartFormComponent,
    children: [
      {
        path: 'water-service',
        loadChildren: () => import('./water-service-config/water-service-config.module').then(m => m.WaterServiceConfigModule)
      },
      {
        path: 'electric-service',
        loadChildren: () => import('./electric-service-config/electric-service-config.module').then(m => m.ElectricServiceConfigModule)
      },
      {
        path: 'tuition-service',
        loadChildren: () => import('./tuition-service-config/tuition-service-config.module').then(m => m.TuitionServiceConfigModule)
      },
      {
        path: 'tax-service',
        loadChildren: () => import('./tax-service-config/tax-service-config.module').then(m => m.TaxServiceConfigModule)
      },
      {
        path: 'viettel-post-service',
        loadChildren: () => import('./viettel-post-service-config/viettel-post-service-config.module').then(m => m.ViettelPostServiceConfigModule)
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemConfigurationRoutingModule {}
