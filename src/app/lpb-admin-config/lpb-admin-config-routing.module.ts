import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LpbBaseServiceComponentComponent} from '../shared/components/lpb-base-service-component/lpb-base-service-component.component';
import {UserComponent} from './pages/user/user.component';
import {FunctionComponent} from './pages/function/function.component';
import {ActionComponent} from './pages/action/action.component';
import {MappingComponent} from './pages/mapping/mapping.component';
import {RoleComponent} from './pages/role/role.component';
import {TitleComponent} from './pages/title/title.component';
import {MappingUserRoleComponent} from './pages/mapping-user-role/mapping-user-role.component';
import {ListComponent as FileListComponent} from './pages/file/list/list.component';
import {UploadComponent as FileUploadComponent} from './pages/file/upload/upload.component';

const routes: Routes = [
  {
    path: '', component: LpbBaseServiceComponentComponent, children: [
      {path: 'user', component: UserComponent},
      {path: 'function', component: FunctionComponent},
      {path: 'action', component: ActionComponent},
      {path: 'mapping', component: MappingComponent},
      {path: 'role', component: RoleComponent},
      {path: 'title', component: TitleComponent},
      {path: 'mapping-user-role', component: MappingUserRoleComponent},
      {
        path: 'file', children: [
          {path: '', component: FileListComponent},
          {path: 'upload', component: FileUploadComponent}
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpbAdminConfigRoutingModule {
}
