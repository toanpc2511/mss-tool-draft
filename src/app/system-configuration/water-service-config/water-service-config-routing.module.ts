import { CheckPermissionGuard } from './../../guards/check-permission.guard';
import { AuthenticationMethodsComponent } from './authentication-methods/authentication-methods.component';
import { ProviderConfigComponent } from './provider-config/provider-config.component';
import { WaterServiceConfigComponent } from './water-service-config.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivateChild } from '@angular/router';
import {LpbBaseServiceComponentComponent} from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';

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
        component: ProviderConfigComponent,
      },
      {
        path: 'authen-methods',
        component: AuthenticationMethodsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaterServiceConfigRoutingModule {}
