import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplateManagementComponent } from './template-management/template-management.component';
import { NewTemplateComponent } from './new-template/new-template.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'add',
    pathMatch: 'full',
  },
  {
    path: 'add',
    component: NewTemplateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplateRoutingModule {}
