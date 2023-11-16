import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardServicesRoutingModule } from './card-services-routing.module';
import { CardLostDamagedRequestComponent } from './card-lost-damaged-request/card-lost-damaged-request.component';
import { StepViewDetailComponent } from './card-service-search-ebs/components/step-view-detail/step-view-detail.component';
import { CardServiceItemComponent } from './shared/components/card-service-item/card-service-item.component';
import { CardServiceSearchEbsComponent } from './card-service-search-ebs/card-service-search-ebs.component';
import { StepSearchComponent } from './card-service-search-ebs/components/step-search/step-search.component';
import { CardRequestUpdatePhoneNumberComponent } from './card-request-update-phone-number/card-request-update-phone-number.component';
import { CardApproveUpdatePhoneNumberComponent } from './card-approve-update-phone-number/card-approve-update-phone-number.component';
import { CardRequestUpdatePhoneNumberStepSearchComponent } from './card-request-update-phone-number/card-request-update-phone-number-step-search/card-request-update-phone-number-step-search.component';
import { CardRequestUpdatePhoneNumberStepSendComponent } from './card-request-update-phone-number/card-request-update-phone-number-step-send/card-request-update-phone-number-step-send.component';
import { CardApproveUpdatePhoneNumberStepSearchComponent } from './card-approve-update-phone-number/card-approve-update-phone-number-step-search/card-approve-update-phone-number-step-search.component';
import { CardApproveUpdatePhoneNumberStepConfirmComponent } from './card-approve-update-phone-number/card-approve-update-phone-number-step-confirm/card-approve-update-phone-number-step-confirm.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from '../../progress-spinner/progress-spinner.module';
import { SharedModule } from '../../shared.module';
import { ReportUpdateCifToSvboComponent } from './report-update-cif-to-svbo/report-update-cif-to-svbo.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CardServicesApproveExtendComponent } from './card-services-approve-extend/card-services-approve-extend.component';
import { CardLostDamagedSearchComponent } from './card-lost-damaged-request/card-lost-damaged-search/card-lost-damaged-search.component';
import { CardLostDamagedSendComponent } from './card-lost-damaged-request/card-lost-damaged-send/card-lost-damaged-send.component';
import { CardServicesApproveExtendSearchComponent } from './card-services-approve-extend/card-services-approve-extend-search/card-services-approve-extend-search.component';
import { CardServicesApproveExtendConfirmComponent } from './card-services-approve-extend/card-services-approve-extend-confirm/card-services-approve-extend-confirm.component';
import { CardServicesExtendComponent } from './card-services-extend/card-services-extend.component';
import { CardServicesExtendStepSearchComponent } from './card-services-extend/card-services-extend-step-search/card-services-extend-step-search.component';
import { CardServicesExtendStepPinUnlockComponent } from './card-services-extend/card-services-extend-step-pin-unlock/card-services-extend-step-pin-unlock.component';
import { CardServicesApproveExtendUnlockPinComponent } from './card-services-approve-extend/card-services-approve-extend-unlock-pin/card-services-approve-extend-unlock-pin.component';
import { CardServicesFormComponent } from './shared/components/card-services-form/card-services-form.component';
import { CardServicesApproveExtendUnlockCardComponent } from './card-services-approve-extend/card-services-approve-extend-unlock-card/card-services-approve-extend-unlock-card.component';
import { CardServicesExtendUnlockCardComponent } from './card-services-extend/card-services-extend-unlock-card/card-services-extend-unlock-card.component';

import { ReportCardTransactionComponent } from './report-card-transaction/report-card-transaction.component';
import { CardServicesExtendStepHistoryComponent } from './card-services-extend/card-services-extend-step-history/card-services-extend-step-history.component';
import { CardServicesApproveExtendHistoryComponent } from './card-services-approve-extend/card-services-approve-extend-history/card-services-approve-extend-history.component';
import { PrettyDatePipe } from './shared/pipe/prettyDate.pipe';
import { CardServiceExtendFileInputComponent } from './shared/components/card-service-extend-file-input/card-service-extend-file-input.component';
import { CardServicesApproveComponent } from './card-services-approve/card-services-approve.component';
import { CardServicesApproveStepSearchComponent } from './card-services-approve/card-services-approve-step-search/card-services-approve-step-search.component';
import { CardServicesApproveStepConfirmComponent } from './card-services-approve/card-services-approve-step-confirm/card-services-approve-step-confirm.component';
import { CardDialogComponent } from './shared/components/card-dialog/card-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { CardServicesExtendStepLockComponent } from './card-services-extend/card-services-extend-step-lock/card-services-extend-step-lock.component';
import { CardServicesApproveExtendLockComponent } from './card-services-approve-extend/card-services-approve-extend-lock/card-services-approve-extend-lock.component';
import { ActionNamePipe } from './shared/pipe/acction-name.pipe';
import { CardTerminationServiceComponent } from './card-services-extend/card-termination-service/card-termination-service.component';
import { ApproveCardTerminationServiceComponent } from './card-services-approve-extend/approve-card-termination-service/approve-card-termination-service.component';
import { AccountEditingServiceComponent } from './card-services-extend/account-editing-service/account-editing-service.component';
import { ApproveAccountEditingServiceComponent } from './card-services-approve-extend/approve-account-editing-service/approve-account-editing-service.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { StepCreateRequestComponent } from './card-service-search-ebs/components/step-create-request/step-create-request.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
  declarations: [
    CardServiceSearchEbsComponent,
    CardLostDamagedRequestComponent,
    StepSearchComponent,
    StepViewDetailComponent,
    CardServiceItemComponent,
    CardRequestUpdatePhoneNumberComponent,
    CardApproveUpdatePhoneNumberComponent,
    CardRequestUpdatePhoneNumberStepSearchComponent,
    CardRequestUpdatePhoneNumberStepSendComponent,
    CardApproveUpdatePhoneNumberStepSearchComponent,
    CardApproveUpdatePhoneNumberStepConfirmComponent,
    ReportUpdateCifToSvboComponent,
    CardLostDamagedSearchComponent,
    CardLostDamagedSendComponent,
    CardServicesExtendComponent,
    CardServicesExtendStepSearchComponent,
    CardServicesExtendStepLockComponent,
    CardServicesExtendStepPinUnlockComponent,
    CardServicesFormComponent,
    ReportCardTransactionComponent,
    CardServicesExtendUnlockCardComponent,
    CardServicesExtendStepHistoryComponent,
    CardServicesApproveComponent,
    CardServicesApproveStepSearchComponent,
    CardServicesApproveStepConfirmComponent,
    CardServicesApproveExtendComponent,
    CardServicesApproveExtendSearchComponent,
    CardServicesApproveExtendConfirmComponent,
    CardServicesApproveExtendUnlockPinComponent,
    CardServicesApproveExtendUnlockCardComponent,
    CardServicesApproveExtendLockComponent,
    CardServicesApproveExtendHistoryComponent,
    PrettyDatePipe,
    CardServiceExtendFileInputComponent,
    CardDialogComponent,
    ActionNamePipe,
    CardTerminationServiceComponent,
    ApproveCardTerminationServiceComponent,
    AccountEditingServiceComponent,
    ApproveAccountEditingServiceComponent,
    StepCreateRequestComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CardServicesRoutingModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    MatTooltipModule,
    MatIconModule,
    SharedModule,
    NgSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatMenuModule,
    MatSidenavModule,
    MatDialogModule,
  ],
  exports: [
    StepSearchComponent,
    StepViewDetailComponent,
    CardServiceItemComponent,
    CardRequestUpdatePhoneNumberStepSearchComponent,
    CardRequestUpdatePhoneNumberStepSendComponent,
    CardApproveUpdatePhoneNumberStepSearchComponent,
    CardApproveUpdatePhoneNumberStepConfirmComponent,
  ],
})
export class CardServicesModule { }
