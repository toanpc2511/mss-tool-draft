import { NgSelectModule } from '@ng-select/ng-select';
import { AngularMaterialModule } from './../angular-material.module';
import { SystemConfigurationRoutingModule } from './system-configuration-routing.module';
import { SystemConfigurationComponent } from './system-configuration.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared.module';
import { SystemConfigSharedModule } from './shared/system-config-shared.module';

@NgModule({
  declarations: [
    SystemConfigurationComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SystemConfigurationRoutingModule,
    AngularMaterialModule,
    NgSelectModule,
    SharedModule,
    SystemConfigSharedModule
  ],
  exports: [SystemConfigSharedModule]
})
export class SystemConfigurationModule {}
