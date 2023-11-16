import {Routes} from '@angular/router';
import {ManagerAdminComponent} from './manager-admin.component';
import {ManagerSystemComponent} from './manager-system/manager-system.component';


export const routesAdmin: Routes = [
  {
    path: '',
    redirectTo: 'system',
    pathMatch: 'full'
  },
  {
    path: '', component: ManagerAdminComponent,
    children: [
      {path: 'system', component: ManagerSystemComponent},
      {
        path: 'system-partner',
        loadChildren: () => import('./system-partner/system-partner.module').then(m => m.SystemPartnerModule)
      }
    ]
  },
];
