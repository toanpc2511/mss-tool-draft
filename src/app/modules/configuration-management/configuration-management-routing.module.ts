import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RankConfigComponent } from './rank-config/rank-config.component';
import { PointsConfigComponent } from './points-config/points-config.component';
import { DiscountConfigComponent } from './discount-config/discount-config.component';
import { PromotionConfigComponent } from './promotion-config/promotion-config.component';
import { BannerConfigComponent } from './banner-config/banner-config.component';
import { NewsConfigComponent } from './news-config/news-config.component';
import { CreateNewsComponent } from './news-config/create-news/create-news.component';
import { NewsDetailComponent } from './news-config/news-detail/news-detail.component';
import { UpdateNewsComponent } from './news-config/update-news/update-news.component';

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
  },
  {
    path: 'banner',
    component: BannerConfigComponent
  },
  {
    path: 'tin-tuc',
    children: [
      {
        path: '',
        component: NewsConfigComponent
      },
      {
        path: 'them-moi',
        component: CreateNewsComponent
      },
      {
        path: 'chi-tiet/:id',
        component: NewsDetailComponent
      },
      {
        path: 'cap-nhat/:id',
        component: UpdateNewsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationManagementRoutingModule {}
