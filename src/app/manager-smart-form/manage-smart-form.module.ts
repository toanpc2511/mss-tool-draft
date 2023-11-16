import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {routesSmartForm} from './smart-form-routing.module';
import {SmartFormComponent} from './smart-form.components';
import {CommonModule} from '@angular/common';
import {PopupManagerFileComponent} from './popup/popup-manager-file.component';
import {GecoDialogModule} from 'angular-dynamic-dialog';
import {CifRegisterComponent} from './process/create/cif-register.component';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import {ProcessTheRequestComponent} from './processtheRequest/process-the-request.component';
import {DatePipe} from '@angular/common';
import {ModalComponent} from './modal/modal.component';
import {ManagerFileProcessedComponent} from './process/list/manager-file-processed.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {SharedModule} from '../shared.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ProgressSpinnerModule} from '../progress-spinner/progress-spinner.module';
import {ListProcessComponent} from './list-process/list-process.component';
import {CanDeactivateGuard} from '../_helpers/canDeactiveGuard';
import {DatePickerComponent} from '../_datepicker/date-picker.component';
import {MisCifComponent} from './process/create/mis-cif/mis-cif.component';
import {UdfCifComponent} from './process/create/udf-cif/udf-cif.component';
import {AngularMaterialModule} from '../angular-material.module';
import {ManagerMenutreeModule} from '../manager-menu-tree/manager-menu-tree.module';
import {SpinnerOverlayComponent} from '../components/spinner-overlay/spinner-overlay.component';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {TextMaskModule} from 'angular2-text-mask';
import {RegisterCifComponent} from './register-cif/register-cif.component';
import {RcCustomerInfoComponent} from './register-cif/shared/components/rc-customer-info/rc-customer-info.component';
import {RcVerifyDocsComponent} from './register-cif/shared/components/rc-verify-docs/rc-verify-docs.component';
import {RcUdfComponent} from './register-cif/shared/components/rc-udf/rc-udf.component';
import {RcMisComponent} from './register-cif/shared/components/rc-mis/rc-mis.component';
import {RcFatcaComponent} from './register-cif/shared/components/rc-fatca/rc-fatca.component';
import {RcReferenceCifComponent} from './register-cif/shared/components/rc-reference-cif/rc-reference-cif.component';
import {RcLegalComponent} from './register-cif/shared/components/rc-legal/rc-legal.component';
import {RcOwnerBenefitComponent} from './register-cif/shared/components/rc-owner-benefit/rc-owner-benefit.component';
import {RcGuardianComponent} from './register-cif/shared/components/rc-guardian/rc-guardian.component';
import {RcListCustomerComponent} from './register-cif/shared/components/rc-list-customer/rc-list-customer.component';
import {ListAllProcessComponent} from './list-all-process/list-all-process.component';
import {ExportCardPendingComponent} from './export-card-pending/export-card-pending.component';
import {ReportCardSvboComponent} from './report-card-svbo/report-card-svbo.component';
import { HomePageComponent } from './home-page/home-page.component';
import {SmsStatusQueryComponent} from './sms-status-query/sms-status-query.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    SmartFormComponent,
    PopupManagerFileComponent,
    CifRegisterComponent,
    ProcessTheRequestComponent,
    // DetailCustomerComponent,
    ModalComponent,
    ManagerFileProcessedComponent,
    ListProcessComponent,
    DatePickerComponent,
    MisCifComponent,
    UdfCifComponent,
    SpinnerOverlayComponent,
    RegisterCifComponent,
    RcCustomerInfoComponent,
    RcVerifyDocsComponent,
    RcUdfComponent,
    RcMisComponent,
    RcFatcaComponent,
    RcReferenceCifComponent,
    RcLegalComponent,
    RcOwnerBenefitComponent,
    RcGuardianComponent,
    RcListCustomerComponent,
    ListAllProcessComponent,
    ExportCardPendingComponent,
    ReportCardSvboComponent,
    HomePageComponent,
    SmsStatusQueryComponent
  ],
  imports: [
    CommonModule,
    TextMaskModule,
    RouterModule.forChild(routesSmartForm),
    GecoDialogModule,
    MatDatepickerModule,
    MatSelectModule,
    MatInputModule,
    MatNativeDateModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatIconModule,
    MatTreeModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatRadioModule,
    SharedModule,
    NgSelectModule,
    MatProgressSpinnerModule,
    ProgressSpinnerModule,
    AngularMaterialModule,

  ],
  entryComponents: [
    PopupManagerFileComponent,
    MisCifComponent,
    UdfCifComponent,
    SpinnerOverlayComponent
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    CanDeactivateGuard,
    DatePipe
  ],
  exports: [
    CifRegisterComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ManagerSmartFormModule {
}
