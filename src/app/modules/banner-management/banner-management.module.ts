import { ModalBannerComponent } from './modal-banner/modal-banner.component';
import { CRUDTableModule } from './../../_metronic/shared/crud-table/crud-table.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerManagementComponent } from './banner-management.component';
import { BannerManagementRoutingModule } from './banner-management-routing.module';

@NgModule({
  declarations: [BannerManagementComponent, ModalBannerComponent],
  imports: [CommonModule, BannerManagementRoutingModule, SharedModule, CRUDTableModule]
})
export class BannerManagementModule {}
