import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListProductTypeComponent } from './list-product-type/list-product-type.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'danh-sach',
    pathMatch: 'full'
  },
  {
    path: 'danh-sach',
    component: ListProductTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductTypeRoutingModule {}
