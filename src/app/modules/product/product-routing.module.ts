import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product.component';
import { ProductTypeComponent } from './product-type/product-type.component';
import { ListProductFuelComponent } from './list-product-fuel/list-product-fuel.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'san-pham',
    pathMatch: 'full'
  },
  {
    path: 'nhom-san-pham',
    component: ProductTypeComponent,
  },
  {
    path: 'san-pham-nhien-lieu',
    component: ListProductFuelComponent,
  },
  {
    path: 'san-pham-khac',
    component: ProductComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {}