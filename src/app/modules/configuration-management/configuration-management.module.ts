import { AuthModule } from './../auth/auth.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { InputTrimModule } from 'ng2-trim-directive';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { ConfigurationManagementComponent } from './configuration-management.component';
import { ConfigurationManagementRoutingModule } from './configuration-management-routing.module';
import { RankConfigComponent } from './rank-config/rank-config.component';
import { PointsConfigComponent } from './points-config/points-config.component';
import { DiscountConfigComponent } from './discount-config/discount-config.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { PromotionConfigComponent } from './promotion-config/promotion-config.component';
import { PromotionConfigModalComponent } from './promotion-config-modal/promotion-config-modal.component';
import { BannerConfigComponent } from './banner-config/banner-config.component';
import { CreateBannerDialogComponent } from './banner-config/dialog/create-banner-dialog/create-banner-dialog.component';
import { UpdateBannerDialogComponent } from './banner-config/dialog/update-banner-dialog/update-banner-dialog.component';
import { NewsConfigComponent } from './news-config/news-config.component';

@NgModule({
  declarations: [
    ConfigurationManagementComponent,
    RankConfigComponent,
    PointsConfigComponent,
    DiscountConfigComponent,
    PromotionConfigComponent,
    PromotionConfigModalComponent,
    BannerConfigComponent,
    CreateBannerDialogComponent,
    UpdateBannerDialogComponent,
    NewsConfigComponent
  ],
  imports: [
    CommonModule,
    ConfigurationManagementRoutingModule,
    NgbTooltipModule,
    NgbAccordionModule,
    InlineSVGModule,
    CRUDTableModule,
    FormsModule,
    SharedComponentsModule,
    ReactiveFormsModule,
    InputTrimModule,
    DirectivesModule,
    PipesModule,
    AuthModule
  ]
})
export class ConfigurationManagementModule {}
