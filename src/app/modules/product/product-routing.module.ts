import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListProductFuelComponent } from './list-product-fuel/list-product-fuel.component';
import { ProductTypeComponent } from './product-type/product-type.component';
import { ListProductOtherComponent } from './list-product-other/list-product-other.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
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
    component: ListProductOtherComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {}
