import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LpbKpiServiceRoutingModule} from './lpb-kpi-service-routing.module';
import {ReportUploadComponent} from './clhc-atm-upload/report-upload/report-upload.component';
import {CnAprovedUploadComponent} from './clhc-atm-upload/cn-aproved-upload/cn-aproved-upload.component';
import {HoAprovedUploadComponent} from './clhc-atm-upload/ho-aproved-upload/ho-aproved-upload.component';
import {SharedModule} from '../../shared.module';
import {MY_FORMATS, UploadFileComponent} from './clhc-atm-upload/upload-file.component';
import {DestroyService} from '../../shared/services/destroy.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {SpinnerInterceptor} from '../../shared/interceptors/spinner.interceptor';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {ValidateComponent} from '../../shared/components/validate/validate.component';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatListModule} from '@angular/material/list';
import {MatSelect, MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {CnSendUploadComponent} from './clhc-atm-upload/cn-send-upload/cn-send-upload.component';
@NgModule({
  declarations: [
    CnAprovedUploadComponent,
    HoAprovedUploadComponent,
    ReportUploadComponent,
    CnSendUploadComponent,
    UploadFileComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSelectModule,
    MatListModule,
    MatDialogModule,
    LpbKpiServiceRoutingModule,
  ],
  bootstrap: [],
  providers: [
    DestroyService,
    {provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true}
  ],
  exports: [
    // LpbCustomUploadFileComponent,
    // LpbSelect2Component
    MatButtonModule,
    MatDialogModule,
    ValidateComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LpbKpiServiceModule {
}
