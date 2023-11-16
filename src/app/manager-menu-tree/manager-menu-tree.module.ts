import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GecoDialogModule } from 'angular-dynamic-dialog';
import {MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { routesMenuTree } from './menu-tree-routing';
import { SendForApprovalComponent } from './sendForApproval/send-for-approval.component';
import { ManagerMenuTreeComponent } from './manager-menu-tree.component';
import { AccountComponent } from './account/account-component';
import { CreateAccountComponent } from './account/create-account/create-account.component';
import { DetailAccountComponent } from './account/detail-account/detail-account.component';
import { DetailCustomerComponent } from '../manager-smart-form/process/view/detail-customer.component';
import { EbankingComponent } from './ebanking/ebanking.component';
import { ServiceBrowsingComponent } from './service-browsing/service-browsing.component';
import { RefuseFileComponent } from './refuse-file/refuse-file.component';
import { ProgressSpinnerModule } from '../progress-spinner/progress-spinner.module';
import { UpdateAccountComponent } from './account/update-account/update-account.component';
import { SharedModule } from '../shared.module';
import { AuthorityComponent } from './authority/authority-component';
import { DetailAuthorityComponent } from './detail-authority/detail-authority.component';
import { UpdateAuthorityComponent } from './update-authority/update-authority.component';
import { CreateAuthorityComponent } from './create-authority/create-authority.component';
import { DatePipe } from '@angular/common';
import { SharedDialogModule } from '../shared.dialog.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PopupSearchComponent } from '../_popup-search/popup.search.component';
import { CreateCoOwnerComponent } from './co-owner-account/create-co-owner/create-co-owner.component';
import { CoOwnerAccountComponent } from './co-owner-account/co-owner-account.component';
import { MatRadioModule } from '@angular/material/radio';
import { DatePicker1Component } from '../components/date-picker1/date-picker1.component';
import { DetailCoOwnerComponent } from './co-owner-account/detail-co-owner/detail-co-owner.component';
import { ReferenceCifComponent } from '../manager-smart-form/process/create/reference-cif/reference-cif.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TextMaskModule } from 'angular2-text-mask';
import { AngularMaterialModule } from '../angular-material.module';
import { CommissionCifComponent } from '../manager-smart-form/process/create/commission-cif/commission-cif.component';
import { ProcessUpdateComponent } from '../manager-smart-form/process/process-update/process-update.component';
import { ChooseQuantityComponent } from '../components/choose-quantity/choose-quantity.component';
import { AutocompleteComponent } from '../components/autocomplete/autocomplete.component';
import { IdentifyNumberComponent } from '../components/identify-number/identify-number.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import { ListSmsBankingComponent } from '../manager-smart-form/sms-banking/list-sms-banking/list-sms-banking.component';
import { SmsBankingComponent } from '../manager-smart-form/sms-banking/sms-banking/sms-banking.component';
import { AddSmsBankingComponent } from '../manager-smart-form/sms-banking/add-sms-banking/add-sms-banking.component';

import { AlphabetOnlyDirective } from '../_directive/alphabet-only.directive';
import { ManagerSmartFormModule } from '../manager-smart-form/manage-smart-form.module';
import { ProcessInfoComponent } from '../components/process-info/process-info.component';
import { SearchInfoComponent } from '../components/search-info/search-info.component';
import { DeputyCifComponent } from '../manager-smart-form/process/create/deputy-cif/deputy-cif.component';
import { OwnerBenefitsCifComponent } from '../manager-smart-form/process/create/owner-benefits-cif/owner-benefits-cif.component';
import { GoiDichVuComponent } from './goi-dich-vu/goi-dich-vu.component';

import { FormAccountComponent } from './form-account/form-account.component';

import { GenarateInforComponent } from '../manager-smart-form/genarate-infor/genarate-infor.component';
import { ProfileInfoComponent } from '../manager-smart-form/genarate-infor/component/profile-info/profile-info.component';
import { CustomerInforComponent } from '../manager-smart-form/genarate-infor/component/customer-infor/customer-infor.component';
import { ListAccountComponent } from '../manager-smart-form/genarate-infor/component/list-account/list-account.component';
import { ListAccountSavingComponent } from '../manager-smart-form/genarate-infor/component/list-account-saving/list-account-saving.component';
import { ListSmsBankingComponent } from '../manager-smart-form/genarate-infor/component/list-sms-banking/list-sms-banking.component';
import { ListEbankingComponent } from '../manager-smart-form/genarate-infor/component/list-ebanking/list-ebanking.component';
import { ListCardTypeComponent } from '../manager-smart-form/genarate-infor/component/list-card-type/list-card-type.component';
import { SmsInforComponent } from '../manager-smart-form/sms-banking/sms-infor/sms-infor.component';
import { EbankingAddOrEditComponent } from './ebanking/components/ebanking-add-or-edit/ebanking-add-or-edit.component';
import { EbankingDetailComponent } from './ebanking/components/ebanking-detail/ebanking-detail.component';
import { EbankingListComponent } from './ebanking/components/ebanking-list/ebanking-list.component';
import { SignatureComponent } from './signature/signature.component';
import { BalanceChangeComponent } from './balance-change/balance-change.component';
import { AddOrEditBalanceChangeComponent } from './balance-change/add-or-edit-balance-change/add-or-edit-balance-change.component';
import { ListBalanceChangeComponent } from './balance-change/list-balance-change/list-balance-change.component';
import { DetailBalanceChangeComponent } from './balance-change/detail-balance-change/detail-balance-change.component';
import { MobileNoColComponent } from './balance-change/shared/components/mobile-no-col/mobile-no-col.component';
import { PopUpMaincardComponent } from './service-browsing/pop-up/pop-up-maincard/pop-up-maincard/pop-up-maincard.component';
import { PopUpSupcardComponent } from './service-browsing/pop-up/pop-up-supcard/pop-up-supcard.component';
import { PopUpAccountComponent } from './service-browsing/pop-up/pop-up-account/pop-up-account.component';
import { PrintoutAccountComponent } from './form-account/printout-account/printout-account.component';
import { PopUpEbankingComponent } from './service-browsing/pop-up/pop-up-ebanking/pop-up-ebanking.component';
import { PopUpCifComponent } from './service-browsing/pop-up/pop-up-cif/pop-up-cif.component';
import { ListSupCardComponent } from './card/supCard/list-sup-card/list-sup-card.component';
import { AddSupCardComponent } from './card/supCard/add-sup-card/add-sup-card.component';
import { ListMainCardComponent } from './card/main-card/list-main-card/list-main-card.component';
import { InforSupCardComponent } from './card/supCard/infor-sup-card/infor-sup-card.component';
import { UpdateSupCardComponent } from './card/supCard/update-sup-card/update-sup-card.component';
import { AddNewCardComponent } from './card/main-card/add-new-card/add-new-card.component';
import { UpdateMainCardComponent } from './card/main-card/update-main-card/update-main-card.component';
import { CardInfoComponent } from './card/main-card/card-info/card-info.component';
import { PopUpSendServiceComponent } from './sendForApproval/pop-up/pop-up-send-service/pop-up-send-service.component';
import { SendRejectOneComponent } from './service-browsing/pop-up/send-reject-one/send-reject-one.component';
import { SendModifyOneComponent } from './service-browsing/pop-up/send-modify-one/send-modify-one.component';
import { AproveOneComponent } from '../components/aprove-one/aprove-one.component';
import { UpdateCoOwnerComponent } from './co-owner-account/update-co-owner/update-co-owner.component';
import { PopUpCoOwnerComponent } from './service-browsing/pop-up/pop-up-co-owner/pop-up-co-owner.component';
import { AccountCreateComponent } from './account/account-create/account-create.component';
import { UpdateCifComponent } from './update-cif/update-cif.component';
import { UcCustomerInfoComponent } from './update-cif/shared/components/uc-customer-info/uc-customer-info.component';
import { UcVerifyDocsComponent } from './update-cif/shared/components/uc-verify-docs/uc-verify-docs.component';
import { UcUdfComponent } from './update-cif/shared/components/uc-udf/uc-udf.component';
import { UcMisComponent } from './update-cif/shared/components/uc-mis/uc-mis.component';
import { UcFatcaComponent } from './update-cif/shared/components/uc-fatca/uc-fatca.component';
import { UcReferenceCifComponent } from './update-cif/shared/components/uc-reference-cif/uc-reference-cif.component';
import { UcLegalComponent } from './update-cif/shared/components/uc-legal/uc-legal.component';
import { UcOwnerBenefitComponent } from './update-cif/shared/components/uc-owner-benefit/uc-owner-benefit.component';
import { UcGuardianComponent } from './update-cif/shared/components/uc-guardian/uc-guardian.component';
import { SendApporveComponent } from './send-apporve/send-apporve.component';
import { BrowseApporeComponent } from './browse-appore/browse-appore.component';
import { DetailCifComponent } from './detail-cif/detail-cif.component';
import { AccountOwnerCreateComponent } from './account/account-owner/account-owner-create/account-owner-create.component';
import { AccountOwnerSearchComponent } from './account/account-owner/account-owner-search/account-owner-search.component';
import { AccountOwnerInfoComponent } from './account/account-owner/account-owner-info/account-owner-info.component';
import { AccountOwnerCustomerComponent } from './account/account-owner/account-owner-customer/account-owner-customer.component';
import { AccountOwnerVerifyDocsComponent } from './account/account-owner/account-owner-verify-docs/account-owner-verify-docs.component';
import { AccountOwnerUdfComponent } from './account/account-owner/account-owner-udf/account-owner-udf.component';
import { AccountOwnerMisComponent } from './account/account-owner/account-owner-mis/account-owner-mis.component';
import { AccountOwnFatcaComponent } from './account/account-owner/account-owner-fatca/account-owner-fatca.component';
import { AccountOwnerListComponent } from './account/account-owner/account-owner-list/account-owner-list.component';
import { AccountAuthorityCreateComponent } from './account/account-authority/account-authority-create/account-authority-create.component';
import { AccountAuthorityUpdateComponent } from './account/account-authority/account-authority-update/account-authority-update.component';
import { AccountOwnerUpdateComponent } from './account/account-owner/account-owner-update/account-owner-update.component';
import { AccountOwnerDetailComponent } from './account/account-owner/account-owner-detail/account-owner-detail.component';
import { PopupDetailAccountComponent } from './shared/components/popup-detail-account/popup-detail-account.component';
import { PopupDetailCifComponent } from './shared/components/popup-detail-cif/popup-detail-cif.component';
import { PopupDetailOwnerComponent } from './shared/components/popup-detail-owner/popup-detail-owner.component';
import { AccountAuthorityDetailComponent } from './account/account-authority/account-authority-detail/account-authority-detail.component';
import { PopupDetailAuthorityComponent } from './shared/components/popup-detail-authority/popup-detail-authority.component';
import { AttachmentComponent } from './attachment/attachment.component';
import { WarningDataInvalidComponent } from './update-cif/shared/components/warning-data-invalid/warning-data-invalid.component';
import { AttachmentDetailComponent } from './attachment/attachment-detail/attachment-detail.component';
import { PopupDetailSignatureComponent } from './shared/components/popup-detail-signature/popup-detail-signature.component';
import { PopupDetailAttachmentComponent } from './shared/components/popup-detail-attachment/popup-detail-attachment.component';
import { PopupDetailWarringComponent } from './shared/components/popup-detail-warring/popup-detail-warring.component';
// tslint:disable-next-line:max-line-length

// tslint:disable-next-line:max-line-length


@NgModule({
    declarations: [
        ManagerMenuTreeComponent,
        SendForApprovalComponent,
        AccountComponent,
        CreateAccountComponent,
        DetailAccountComponent,
        DetailCustomerComponent,
        EbankingComponent,
        ServiceBrowsingComponent,
        RefuseFileComponent,
        UpdateAccountComponent,
        AuthorityComponent,
        DetailAuthorityComponent,
        UpdateAuthorityComponent,
        CreateAuthorityComponent,
        PopupSearchComponent,
        CreateCoOwnerComponent,
        CoOwnerAccountComponent,
        DatePicker1Component,
        DetailCoOwnerComponent,
        ReferenceCifComponent,
        DeputyCifComponent,
        OwnerBenefitsCifComponent,
        CommissionCifComponent,
        ListSupCardComponent,
        AddSupCardComponent,
        ListMainCardComponent,
        InforSupCardComponent,
        UpdateSupCardComponent,
        ChooseQuantityComponent,
        AutocompleteComponent,
        IdentifyNumberComponent,
        ListSmsBankingComponent,
        SmsBankingComponent,
        AddSmsBankingComponent,
        DetailAccountComponent,
        AlphabetOnlyDirective,
        ProcessInfoComponent,
        SearchInfoComponent,
        AddNewCardComponent,
        ProcessUpdateComponent,
        GoiDichVuComponent,
        FormAccountComponent,
        GenarateInforComponent,
        ProfileInfoComponent,
        CustomerInforComponent,
        ListAccountComponent,
        ListAccountSavingComponent,
        ListSmsBankingComponent,
        ListEbankingComponent,
        ListCardTypeComponent,
        SmsInforComponent,
        EbankingAddOrEditComponent,
        EbankingDetailComponent,
        EbankingListComponent,
        SignatureComponent,
        BalanceChangeComponent,
        AddOrEditBalanceChangeComponent,
        ListBalanceChangeComponent,
        DetailBalanceChangeComponent,
        MobileNoColComponent,
        AddOrEditBalanceChangeComponent,
        PopUpMaincardComponent,
        PopUpSupcardComponent,
        PopUpAccountComponent,
        PrintoutAccountComponent,
        PopUpEbankingComponent,
        PopUpCifComponent,
        UpdateMainCardComponent,
        CardInfoComponent,
        PopUpSendServiceComponent,
        SendRejectOneComponent,
        SendModifyOneComponent,
        AproveOneComponent,
        UpdateCoOwnerComponent,
        PopUpCoOwnerComponent,
        AccountCreateComponent,
        UpdateCifComponent,
        UcCustomerInfoComponent,
        UcVerifyDocsComponent,
        UcUdfComponent,
        UcMisComponent,
        UcFatcaComponent,
        UcReferenceCifComponent,
        UcLegalComponent,
        UcOwnerBenefitComponent,
        UcGuardianComponent,
        SendApporveComponent,
        BrowseApporeComponent,
        DetailCifComponent,
        AccountOwnerCreateComponent,
        AccountOwnerInfoComponent,
        AccountOwnerSearchComponent,
        AccountOwnerCustomerComponent,
        AccountOwnerVerifyDocsComponent,
        AccountOwnerUdfComponent,
        AccountOwnerMisComponent,
        AccountOwnFatcaComponent,
        AccountOwnerListComponent,
        AccountAuthorityCreateComponent,
        AccountAuthorityUpdateComponent,
        AccountOwnerUpdateComponent,
        AccountOwnerDetailComponent,
        PopupDetailAccountComponent,
        PopupDetailCifComponent,
        PopupDetailOwnerComponent,
        AccountAuthorityDetailComponent,
        PopupDetailAuthorityComponent,
        AttachmentComponent,
        WarningDataInvalidComponent,
        AttachmentDetailComponent,
        PopupDetailSignatureComponent,
        PopupDetailAttachmentComponent,
        PopupDetailWarringComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routesMenuTree),
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
        ProgressSpinnerModule,
        SharedModule,
        NgSelectModule,
        SharedDialogModule,
        MatCheckboxModule,
        MatRadioModule,
        MatDialogModule,
        AngularMaterialModule,
        ManagerSmartFormModule
    ],
    entryComponents: [
        RefuseFileComponent,
        PopupSearchComponent
    ],
    providers: [
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
        DatePipe
    ],
    exports: [
        DatePicker1Component,
        ChooseQuantityComponent,
        AutocompleteComponent,
        IdentifyNumberComponent,
        UcCustomerInfoComponent,
        UcVerifyDocsComponent,
        UcUdfComponent,
        UcMisComponent,
        UcFatcaComponent,
        UcReferenceCifComponent,
        UcLegalComponent,
        UcOwnerBenefitComponent,
        UcGuardianComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ManagerMenutreeModule {
}
