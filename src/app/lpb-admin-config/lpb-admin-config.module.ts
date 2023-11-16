import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LpbAdminConfigRoutingModule} from './lpb-admin-config-routing.module';
import {UserComponent} from './pages/user/user.component';
import {FunctionComponent} from './pages/function/function.component';
import {ActionComponent} from './pages/action/action.component';
import {MappingComponent} from './pages/mapping/mapping.component';
import {RoleComponent} from './pages/role/role.component';
import {SharedModule} from '../shared.module';
import {FormsModule} from '@angular/forms';
import {PrettyMoneyPipe} from '../shared/pipes/prettyMoney.pipe';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {SpinnerInterceptor} from '../shared/interceptors/spinner.interceptor';
import {TitleComponent} from './pages/title/title.component';
import {MatTreeModule} from '@angular/material/tree';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MappingUserRoleComponent} from './pages/mapping-user-role/mapping-user-role.component';
import { ListComponent } from './pages/file/list/list.component';
import { UploadComponent } from './pages/file/upload/upload.component';


@NgModule({
  declarations: [UserComponent, FunctionComponent, ActionComponent, MappingComponent, RoleComponent, TitleComponent, MappingUserRoleComponent, ListComponent, UploadComponent],
  imports: [
    CommonModule,
    LpbAdminConfigRoutingModule,
    SharedModule,
    FormsModule,
    MatTreeModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true},
  ]
})
export class LpbAdminConfigModule {
}
