import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared.module';
import {SystemConfigSharedModule} from '../shared/system-config-shared.module';
import {TuitionServiceConfigRoutingModule} from './tuition-service-config-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTabsModule} from '@angular/material/tabs';
import {AngularMaterialModule} from '../../angular-material.module';
import {NgModule} from '@angular/core';
import {UniversityConfigComponent} from './university-config/university-config.component';
import {UniversityDetailComponent} from './university-config/university-detail/university-detail.component';
import {UniversityModalComponent} from "./university-config/university-modal/university-modal.component";


@NgModule({
  declarations: [
    UniversityConfigComponent,
    UniversityModalComponent,
    UniversityDetailComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SystemConfigSharedModule,
    TuitionServiceConfigRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    AngularMaterialModule,
    MatAutocompleteModule,
  ],
})
export class TuitionServiceConfigModule {}
