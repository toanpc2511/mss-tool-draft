import { CategoryManagementComponent } from './category-management.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: CategoryManagementComponent,
    data: {
      title: 'Quản lý danh mục'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryManagementRoutingModule {}
