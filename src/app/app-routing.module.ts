import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {PermissionDeniedComponent} from './permission-denied/permission-denied.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {CheckPermissionGuard} from './guards/check-permission.guard';
import {SmartFormComponent} from './manager-smart-form/smart-form.components';


const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  // {
  //   path:'smart-form',
  //   canActivate:[AuthGuard],
  //   component:MenubarComponent
  // },
  {
    path: 'smart-form',
    loadChildren: () => import('./manager-smart-form/manager-smart-form-routing.module').then(m => m.ManagerSmartFormRoutingModule),
  },
  {
    path: 'sms-gateway',
    loadChildren: () => import('./lpb-sms-gateway/lpb-sms-gateway-routing.module').then(m => m.LpbSmsGatewayRoutingModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'system-config',
    loadChildren: () => import('./system-configuration/system-configuration.module').then(m => m.SystemConfigurationModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'deposit-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-deposit-service/lpb-deposit-service.module').then(m => m.LpbDepositServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'withdraw-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-withdraw-service/lpb-withdraw-service.module').then(m => m.LpbWithdrawServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'water-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-water-service/lpb-water-service.module').then(m => m.LpbWaterServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'electric-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-electric-service/lpb-electric-service.module').then(m => m.LpbElectricServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'request-card-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-request-card-service/lpb-request-card-service.module')
      .then(m => m.LpbRequestCardServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'support-card-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-support-card-service/lpb-support-card-service.module')
      .then(m => m.LpbSupportCardServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'update-phone-to-svbo',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-update-phone-to-svbo-service/lpb-update-phone-to-svbo.module')
      .then(m => m.LpbUpdatePhoneToSvboModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'cross-checking-credit-card-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-cross-checking-credit-card-service/lpb-cross-checking-credit-card-service.module')
      .then(m => m.LpbCrossCheckingCreditCardServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'withdraw-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-withdraw-service/lpb-withdraw-service.module')
      .then(m => m.LpbWithdrawServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'transfer-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-transfer-service/lpb-transfer-service.module').then(m => m.LpbTransferServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'log-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-log-service/lpb-log-service.module').then(m => m.LpbLogServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'tuition-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-tuition-service/lpb-tuition-service.module').then(m => m.LpbTuitionServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'econtract-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-econtract-service/lpb-econtract-service.module').then(m => m.LpbEcontractServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'lv24-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-lv24-service/lpb-lv24-service.module').then(m => m.LpbLv24ServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'iname-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-iname-service/lpb-iname-service.module').then(m => m.LpbInameServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'admin',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-admin-config/lpb-admin-config.module').then(m => m.LpbAdminConfigModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'kpi-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-kpi-service/lpb-kpi-service.module').then(m => m.LpbKpiServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'savings-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-savings-service/lpb-savings-service.module').then(m => m.LpbSavingsServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'sms-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-sms-service/lpb-sms-service.module').then(m => m.LpbSmsServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'money-transfer-limit-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-money-transfer-limit-service/lpb-money-transfer-limit-service.module')
      .then(m => m.LpbMoneyTransferLimitServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'vietlott-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-vietlott-service/lpb-vietlott-service.module').then(m => m.LpbVietlottServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'credit-card-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-credit-card-service/lpb-credit-card-service.module')
      .then(m => m.LpbCreditCardServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'tax-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-tax-service/lpb-tax-service.module').then(m => m.LpbTaxServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'viettel-post-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-viettel-post-service/lpb-viettel-post-service.module')
      .then(m => m.LpbViettelPostServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'cccd-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-cccd-service/lpb-cccd-service.module').then(m => m.LpbCccdServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  {
    path: 'job-dashboard-service',
    component: SmartFormComponent,
    loadChildren: () => import('./lpb-services/lpb-job-dashboard-service/lpb-job-dashboard-service.module').then(m => m.LpbJobDashboardServiceModule),
    canActivateChild: [CheckPermissionGuard],
  },
  // { path: 'admin',
  //   canActivate: [AuthGuard],
  //   // data: { roles: [Permission.SYSTEM_MANAGEMENT] },
  //   loadChildren:() => import('./manager-admin/manager-admin.module').then(m => m.ManagerAdminModule)
  // },
  {path: 'login', component: LoginComponent},
  {path: 'permission-denied', component: PermissionDeniedComponent},
  {
    path: '**',
    // redirectTo: 'login'
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload', relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
