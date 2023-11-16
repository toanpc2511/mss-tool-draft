import {SupplierConfigComponent} from './supplier-config/supplier-config.component';
import {SupplierModalComponent} from './supplier-config/supplier-modal/supplier-modal.component';
import {SupplierDetailComponent} from './supplier-config/supplier-detail/supplier-detail.component';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared.module';
import {SystemConfigSharedModule} from '../shared/system-config-shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import {NgSelectModule} from '@ng-select/ng-select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AngularMaterialModule} from '../../angular-material.module';
import {NgModule} from '@angular/core';
import {ViettelPostServiceConfigRoutingModule} from './viettel-post-service-config-routing.module';

@NgModule({
  declarations: [
    SupplierConfigComponent,
    SupplierModalComponent,
    SupplierDetailComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SystemConfigSharedModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    AngularMaterialModule,
    MatAutocompleteModule,
    ViettelPostServiceConfigRoutingModule,
  ],
})
export class ViettelPostServiceConfigModule{}
