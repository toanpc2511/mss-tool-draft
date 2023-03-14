import { ProductComponent } from './product/product.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { ProductManagementComponent } from './product-management.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ProductManagementComponent,
    data: {
      title: 'Quản lý sản phẩm'
    }
  },
  {
    path: 'chi-tiet/:id' || 'sua-san-pham/:id',
    component: ViewProductComponent,
    data: {
      title: 'Chi tiết sản phẩm'
    }
  },
  {
    path: 'them-moi',
    component: ProductComponent,
    data: {
      title: 'Thêm mới sản phẩm'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductManagementRoutingModule {}
