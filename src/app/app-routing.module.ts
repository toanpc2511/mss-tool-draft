import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'template',
    pathMatch: 'full',
  },
  {
    path: 'template',
    loadChildren: () =>
      import('./modules/template/template.module').then(
        (m) => m.TemplateModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
