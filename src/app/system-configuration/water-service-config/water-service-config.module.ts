import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AngularMaterialModule } from './../../angular-material.module';
import { Routes, RouterModule } from '@angular/router';
import { WaterServiceConfigRoutingModule } from './water-service-config-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { SystemConfigSharedModule } from './../shared/system-config-shared.module';
import { SharedModule } from 'src/app/shared.module';
import { SupplierModalComponent } from './provider-config/supplier-modal/supplier-modal.component';
import { AuthenticationMethodsComponent } from './authentication-methods/authentication-methods.component';
import { ProviderConfigComponent } from './provider-config/provider-config.component';
import { WaterServiceConfigComponent } from './water-service-config.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    WaterServiceConfigComponent,
    ProviderConfigComponent,
    AuthenticationMethodsComponent,
    SupplierModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SystemConfigSharedModule,
    WaterServiceConfigRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    AngularMaterialModule,
    MatAutocompleteModule,
  ],
})
export class WaterServiceConfigModule {}
