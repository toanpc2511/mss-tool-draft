import {Routes} from '@angular/router';
import {ManagerFileProcessedComponent} from './process/list/manager-file-processed.component';
import {SmartFormComponent} from './smart-form.components';
import {ListProcessComponent} from './list-process/list-process.component';
import {CanDeactivateGuard} from '../_helpers/canDeactiveGuard';
import {CifRegisterComponent} from './process/create/cif-register.component';
import { RegisterCifComponent } from './register-cif/register-cif.component';
import { ListAllProcessComponent } from './list-all-process/list-all-process.component';
import { ExportCardPendingComponent } from './export-card-pending/export-card-pending.component';
import {HomePageComponent} from './home-page/home-page.component';
import {CheckPermissionGuard} from '../guards/check-permission.guard';
import {SmsStatusQueryComponent} from './sms-status-query/sms-status-query.component';
// import {ReportCardSvboComponent} from './report-card-svbo/report-card-svbo.component';

export const routesSmartForm: Routes = [
  {
    path: '', component: SmartFormComponent,
    children: [
      {
        path: 'fileProcessed',
        component: ManagerFileProcessedComponent, canDeactivate: [CanDeactivateGuard],
      },
      {
        path: 'registerService',
        component: RegisterCifComponent
      },
      {
        path: 'updateCif',
        component: CifRegisterComponent
      },
      {
        path: 'manager',
        loadChildren: () => import('../manager-menu-tree/manager-menu-tree-routing').then(m => m.ManagerMenuTreeRoutingModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('../manager-admin/manager-admin.module').then(m => m.ManagerAdminModule),
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'process/list', component: ListProcessComponent, canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'process/list-new', component: ListAllProcessComponent, canDeactivate: [CanDeactivateGuard]
      },

      {
        path: 'export-cards', component: ExportCardPendingComponent
      },

      // {
      //   path: 'report-card-svbo', component: ReportCardSvboComponent
      // },
      {
        path: 'cross-checking',
        loadChildren: () => import('./cross-checking-automation/cross-checking-automation.module')
          .then(m => m.CrossCheckingAutomationModule)
      },
      {
        path: 'card-services',
        loadChildren: () => import('./card-services/card-services.module').then(m => m.CardServicesModule),
        canActivateChild: [CheckPermissionGuard]
      },
      {
        path: 'home', component: HomePageComponent
      },
      {
        path: 'sms-status-query', component: SmsStatusQueryComponent
      },
    ]
  }
];

