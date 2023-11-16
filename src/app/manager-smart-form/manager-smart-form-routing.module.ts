import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        loadChildren: () => import('./manage-smart-form.module').then(m => m.ManagerSmartFormModule)
      }
    ])
  ]
})
export class ManagerSmartFormRoutingModule {
}
