import { MatDialogModule } from '@angular/material/dialog';
import { CustomConfirmDialogComponent } from './shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { CustomToastComponent } from './shared/components/cusom-toast/custom-toast.component';
import {NumberDirective} from './_directive/_number.directive';
import {NgModule} from '@angular/core';
import {NumberAndTextOnlyDirective} from './_directive/number-and-text-only.directive';
import {NumberAndTextViOnlyDirective} from './_directive/number-and-text-vi-only.directive';
import {NumberAndTextViSentenceOnlyDirective} from './_directive/number-and-text-vi-sentence-only.directive';
import { NumberAndTextLatinDirective } from './_directive/number-and-text-latin.directive';
import {NumberAndTextOnlyLatinDirective} from './_directive/number-and-text-only-latin.directive';
import {MoneyOnlyDirective} from './_directive/money-only.directive';
import { UpperTextDirective } from './_directive/upper-text.directive';
import {DateOnlyDirective} from './_directive/date-only.directive';
import { UpperCaseTextDirective } from './_directive/uppercase-text.directive';
import {TextViOnlyDirective} from './_directive/text-vi-only.directive';
import { LpbModalComponent } from './shared/components/lpb-modal/lpb-modal.component';
import { LpbSelectComponent } from './shared/components/lpb-select/lpb-select.component';
import { LpbAddressComponent } from './shared/components/lpb-address/lpb-address.component';
import { LpbSingleAddressComponent } from './shared/components/lpb-single-address/lpb-single-address.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { InputMoneyDirective } from './shared/directives/input-money.directive';
import { FormatMoneyPipe } from './shared/pipes/format-money.pipe';
import { LpbDatePickerComponent } from './shared/components/lpb-date-picker/lpb-date-picker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LpbCustomAddressComponent } from './shared/components/lpb-custom-address/lpb-custom-address.component';
import { LpbCustomSingleAddressComponent } from './shared/components/lpb-custom-single-address/lpb-custom-single-address.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { LpbPaginationComponent } from './shared/components/lpb-pagination/lpb-pagination.component';
import {LpbUploadFileSingleComponent} from './shared/components/lpb-upload-file-single/lpb-upload-file-single.component';
import {CardServicesComponent} from './manager-smart-form/card-services/card-services.component';
import {RouterModule} from '@angular/router';
import {LpbBaseServiceComponentComponent} from './shared/components/lpb-base-service-component/lpb-base-service-component.component';
import {MatTabsModule} from '@angular/material/tabs';
import {LpbHomeServiceComponent} from './shared/components/lpb-home-service/lpb-home-service.component';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { LpbMoneyInputComponent } from './shared/components/lpb-money-input/lpb-money-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrettyMoneyPipe } from './shared/pipes/prettyMoney.pipe';
import {LpbFooterComponent} from './shared/components/lpb-footer/lpb-footer.component';
import { LpbLightboxComponent } from './shared/components/lpb-lightbox/lpb-lightbox.component';
import { TrimInputDirective } from './shared/directives/trim.directive';
import { ValidateComponent } from './shared/components/validate/validate.component';
import { SliceString } from './shared/pipes/sliceString.pipe';
import { LpbDatatableComponent } from './shared/components/lpb-datatable/lpb-datatable.component';
import {LpbPaginatorComponent} from './shared/components/lpb-paginator/lpb-paginator.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressSpinnerModule, MatSpinner} from '@angular/material/progress-spinner';
import { LpbBranchSelectComponent } from './shared/components/lpb-branch-select/lpb-branch-select.component';
import { LpbUserSelectComponent } from './shared/components/lpb-user-select/lpb-user-select.component';
import { LpbSelect2Component } from './shared/components/lpb-select2/lpb-select2.component';
import {NgSelectModule} from '@ng-select/ng-select';
import { VnCurency } from './shared/pipes/vn-curentcy.pipe';
import {LpbSpinnerComponent} from './shared/components/lpb-spinner/lpb-spinner.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {SpinnerInterceptor} from './shared/interceptors/spinner.interceptor';
import { TextTransformDirective } from './shared/directives/text-transform.directive';
import { TextShowDirective } from './shared/directives/text-show.directive';
import { TextEncodeDirective } from './shared/directives/text-encode.directive';
import {CanUseFeaturePipe} from './shared/pipes/auth.pipe';
import { TextPatternDirective } from './shared/directives/text-pattern.directive';
import { TextAreaLimitDirective } from './shared/directives/text-area-limit.directive';
import { LpbDialogComponent } from './shared/components/lpb-dialog/lpb-dialog.component';
import { ToStringPipe } from './shared/pipes/to-string.pipe';
import { FrmMessageComponent } from './shared/components/form-message/form-message.component';
import { TextAreaAutoResizeDirective } from './shared/directives/text-area-autoresize.directive';
import {DecimalMaskDirective} from './shared/directives/numberic-only.directive';
import {LpbWizardCustomComponent} from './shared/components/lpb-wizard-custom/lpb-wizard-custom.component';
import {CanActiveStepPipe} from './shared/pipes/can-active-step.pipe';
import {
  LpbCustomUploadFileComponent
} from './shared/components/lpb-custom-upload-file/lpb-custom-upload-file.component';
import { LpbDatepickerNewComponent } from './shared/components/lpb-datepicker-new/lpb-datepicker-new.component';
import {NoSpaceStringDirective} from './shared/directives/no-space-string.directive';
import { JustNumberOnlyDirective } from './shared/directives/just-number-only.directive';
import { DecimalOnlyDirective } from './shared/directives/decimal-only.directive';
import { MatRadioModule } from '@angular/material/radio';
import { LpbSelectTooltipComponent } from './shared/components/lpb-select-tooltip/lpb-select-tooltip.component';
import { ComparePipe } from './shared/pipes/compare.pipe';
import { LpbEmployeeInputComponent } from './shared/components/lpb-employee-input/lpb-employee-input.component';
import { LpbIdentityCertificationComponent } from './shared/components/lpb-identity-certification/lpb-identity-certification.component';
import { LpbSignatureListComponent } from './shared/components/lpb-signature-list/lpb-signature-list.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {NgxPrintModule} from 'ngx-print';
import { PrintCccdComponent } from './shared/components/print-cccd/print-cccd.component';

// @ts-ignore
@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatDatepickerModule,
        MatTooltipModule,
        RouterModule,
        MatTabsModule,
        MatButtonModule,
        MatButtonToggleModule,
        ReactiveFormsModule,
        FormsModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatProgressSpinnerModule,
        NgSelectModule,
        MatDialogModule,
        MatSidenavModule,
        NgxPrintModule
    ],
  declarations: [
    NumberDirective,
    NumberAndTextOnlyDirective,
    NumberAndTextViOnlyDirective,
    NumberAndTextViSentenceOnlyDirective,
    NumberAndTextLatinDirective,
    NumberAndTextOnlyLatinDirective,
    MoneyOnlyDirective,
    UpperTextDirective,
    DateOnlyDirective,
    UpperCaseTextDirective,
    TextViOnlyDirective,
    LpbModalComponent,
    LpbSelectComponent,
    LpbAddressComponent,
    LpbSingleAddressComponent,
    InputMoneyDirective,
    TextTransformDirective,
    TextShowDirective,
    TextEncodeDirective,
    FormatMoneyPipe,
    LpbDatePickerComponent,
    LpbCustomAddressComponent,
    LpbCustomSingleAddressComponent,
    LpbPaginationComponent,
    LpbUploadFileSingleComponent,
    CardServicesComponent,
    LpbBaseServiceComponentComponent,
    LpbHomeServiceComponent, CustomToastComponent,
    PrettyMoneyPipe,
    ComparePipe,
    LpbMoneyInputComponent,
    LpbFooterComponent,
    LpbLightboxComponent,
    TrimInputDirective,
    DecimalMaskDirective,
    JustNumberOnlyDirective,
    ValidateComponent,
    LpbWizardCustomComponent,
    CustomConfirmDialogComponent,
    SliceString,
    ToStringPipe,
    VnCurency,
    CanActiveStepPipe,
    CanUseFeaturePipe,
    LpbDatatableComponent,
    LpbPaginatorComponent,
    LpbBranchSelectComponent,
    LpbUserSelectComponent,
    LpbSelect2Component,
    LpbSpinnerComponent,
    TextPatternDirective,
    TextAreaLimitDirective,
    TextAreaAutoResizeDirective,
    LpbDialogComponent,
    FrmMessageComponent,
    LpbCustomUploadFileComponent,
    LpbDatepickerNewComponent,
    NoSpaceStringDirective,
    LpbSelectTooltipComponent,
    LpbEmployeeInputComponent,
    LpbSignatureListComponent,
    LpbIdentityCertificationComponent,
    DecimalOnlyDirective,
    PrintCccdComponent,
  ],
  exports: [
    NumberDirective,
    NumberAndTextOnlyDirective,
    NumberAndTextViOnlyDirective,
    NumberAndTextViSentenceOnlyDirective,
    NumberAndTextLatinDirective,
    NumberAndTextOnlyLatinDirective,
    MoneyOnlyDirective,
    UpperTextDirective,
    DateOnlyDirective,
    UpperCaseTextDirective,
    InputMoneyDirective,
    TextTransformDirective,
    TextShowDirective,
    TextEncodeDirective,
    TextViOnlyDirective,
    FormatMoneyPipe,
    LpbModalComponent,
    LpbSelectComponent,
    LpbAddressComponent,
    LpbSingleAddressComponent,
    LpbDatePickerComponent,
    LpbCustomAddressComponent,
    LpbCustomSingleAddressComponent,
    LpbPaginationComponent,
    LpbUploadFileSingleComponent, CustomToastComponent,
    MatButtonModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatCheckboxModule,
    MatTabsModule,
    MatIconModule,
    MatTooltipModule,
    PrettyMoneyPipe,
    ComparePipe,
    LpbMoneyInputComponent,
    LpbFooterComponent,
    LpbLightboxComponent,
    LpbFooterComponent,
    TrimInputDirective,
    DecimalMaskDirective,
    JustNumberOnlyDirective,
    ValidateComponent,
    LpbWizardCustomComponent,
    CustomConfirmDialogComponent,
    SliceString,
    ToStringPipe,
    VnCurency,
    CanActiveStepPipe,
    CanUseFeaturePipe,
    LpbPaginatorComponent, LpbDatatableComponent,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    NgSelectModule,
    ReactiveFormsModule, LpbSelect2Component,
    LpbSpinnerComponent,
    TextPatternDirective,
    TextAreaLimitDirective,
    TextAreaAutoResizeDirective,
    FrmMessageComponent,
    LpbSelectTooltipComponent,
    LpbEmployeeInputComponent,
    LpbSignatureListComponent,
    LpbIdentityCertificationComponent,
    LpbCustomUploadFileComponent, LpbDatepickerNewComponent, NoSpaceStringDirective, DecimalOnlyDirective,
  ],
  providers: [
    PrettyMoneyPipe,
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
  ]
})
export class SharedModule { }
