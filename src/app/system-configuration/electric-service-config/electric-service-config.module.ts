import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElectricServiceConfigRoutingModule } from './electric-service-config-routing.module';
import { SupplierConfigComponent } from './supplier-config/supplier-config.component';
import {MatTabsModule} from '@angular/material/tabs';
import {SharedModule} from '../../shared.module';
import { CreateSupplierComponent } from './supplier-config/create-supplier/create-supplier.component';
import { DetailSupplierComponent } from './supplier-config/detail-supplier/detail-supplier.component';
import {MatRadioModule} from '@angular/material/radio';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SystemConfigSharedModule} from '../shared/system-config-shared.module';


@NgModule({
  declarations: [SupplierConfigComponent, CreateSupplierComponent, DetailSupplierComponent],
  imports: [
    CommonModule,
    ElectricServiceConfigRoutingModule,
    MatTabsModule,
    SharedModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    SystemConfigSharedModule,
  ]
})
export class ElectricServiceConfigModule { }
