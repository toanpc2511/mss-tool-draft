import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GeneralCategoryComponent} from './general-category/general-category.component';
import {TaxServiceConfigRoutingModule} from './tax-service-config-routing.module';
import {MatTabsModule} from '@angular/material/tabs';
import {SharedModule} from '../../shared.module';
import {MatRadioModule} from '@angular/material/radio';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SystemConfigSharedModule} from '../shared/system-config-shared.module';

@NgModule({
  declarations: [GeneralCategoryComponent],
  imports: [
    CommonModule,
    TaxServiceConfigRoutingModule,
    MatTabsModule,
    SharedModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    SystemConfigSharedModule,
  ]
})
export class TaxServiceConfigModule {
}
