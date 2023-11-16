import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA, LOCALE_ID } from '@angular/core';
import '@angular/common/locales/global/vi';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
// import { fakeBackendProvider } from './_helpers/fake-backend';
import { GecoDialogModule } from 'angular-dynamic-dialog';
import {APP_BASE_HREF, CommonModule, DatePipe, DecimalPipe} from '@angular/common';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ToastrModule } from 'ngx-toastr';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {SharedModule} from './shared.module';
import {NgSelectModule} from '@ng-select/ng-select';
import { ProgressSpinnerModule } from './progress-spinner/progress-spinner.module';

import { PopupCloseComponent } from './_popup/popup-close/popup-close.component';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { PermissionDeniedComponent } from './permission-denied/permission-denied.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {SpinnerInterceptor} from './shared/interceptors/spinner.interceptor';


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
    AppComponent,
    LoginComponent,
    PopupCloseComponent,
    PermissionDeniedComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    GecoDialogModule,
    FormsModule,
    ToastrModule.forRoot({ maxOpened: 1, autoDismiss: true }),
    NgMultiSelectDropDownModule.forRoot(),
    SharedModule,
    NgSelectModule,
    ProgressSpinnerModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
    {provide: LOCALE_ID, useValue: 'vi'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    // provider used to create fake backend
    // fakeBackendProvider,
    DecimalPipe, DatePipe],
  bootstrap: [AppComponent],
  exports: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
