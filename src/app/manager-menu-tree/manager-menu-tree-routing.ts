import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        loadChildren: () => import('./manager-menu-tree.module').then(m => m.ManagerMenutreeModule),
        data: {preload: true}
      },
    ]),

  ]
})
export class ManagerMenuTreeRoutingModule {
}
