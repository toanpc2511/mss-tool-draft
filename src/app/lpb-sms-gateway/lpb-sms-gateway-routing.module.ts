import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SmartFormComponent} from '../manager-smart-form/smart-form.components';
import {ManagerFileProcessedComponent} from '../manager-smart-form/process/list/manager-file-processed.component';
import {CanDeactivateGuard} from '../_helpers/canDeactiveGuard';
import {RegisterCifComponent} from '../manager-smart-form/register-cif/register-cif.component';
import {CifRegisterComponent} from '../manager-smart-form/process/create/cif-register.component';
import {ListProcessComponent} from '../manager-smart-form/list-process/list-process.component';
import {ListAllProcessComponent} from '../manager-smart-form/list-all-process/list-all-process.component';
import {ExportCardPendingComponent} from '../manager-smart-form/export-card-pending/export-card-pending.component';
import {TestComponent} from './test/test.component';

const routes: Routes = [{
  path: '',
  children: [
    {
      path: 'test',
      component: TestComponent,
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpbSmsGatewayRoutingModule {
}
