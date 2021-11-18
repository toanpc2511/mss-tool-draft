import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RankConfigComponent } from './rank-config/rank-config.component';
import { PointsConfigComponent } from './points-config/points-config.component';
import { DiscountConfigComponent } from './discount-config/discount-config.component';
import { PromotionConfigComponent } from './promotion-config/promotion-config.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'tich-diem',
    component: PointsConfigComponent,
  },
  {
    path: 'chiet-khau',
    component: DiscountConfigComponent,
  },
  {
    path: 'hang',
    component: RankConfigComponent,
  },
  {
    path: 'khuyen-mai',
    component: PromotionConfigComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationManagementRoutingModule {}
