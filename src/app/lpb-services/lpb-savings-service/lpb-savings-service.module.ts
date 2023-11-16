import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared.module';
import { CreateComponent as CreateSettlementComponent } from './finalize/create/create.component';
import { DetailComponent as DetailSettlementComponent } from './finalize/detail/detail.component';
import { ListPendingComponent } from './list/list-pending/list-pending.component';
import { ListRequestComponent } from './list/list-request/list-request.component';
import { LpbSavingsServiceRoutingModule } from './lpb-savings-service-routing.module';
import { CreateComponent as CreateSavingComponent } from './saving/create/create.component';
import { DetailComponent as DetailSavingComponent } from './saving/detail/detail.component';
import { CollapseSectionComponent } from './shared/components/collapse-section/collapse-section.component';
import { FormArrayComponent } from './shared/components/form-array/form-array.component';
import { FormSearchComponent } from './shared/components/form-search/form-search.component';
import { ListDialogComponent } from './shared/components/list-dialog/list-dialog.component';
import { DialogFormAuthorizedPersonComponent } from './shared/components/saving-form/extend-info/dialog-form-authorized-person/dialog-form-authorized-person.component';
import { DialogUDFComponent } from './shared/components/saving-form/extend-info/dialog-udf/dialog-udf.component';
import { ListButtonOpenDialogComponent } from './shared/components/saving-form/extend-info/list-button-open-dialog/list-button-open-dialog.component';
import { NgAutocompleteComponent } from './shared/components/saving-form/ng-autocomplete/ng-autocomplete.component';
import { SavingAccountInfoComponent } from './shared/components/saving-form/saving-account-info/saving-account-info.component';
import { SavingFormComponent } from './shared/components/saving-form/saving-form.component';
import { SenderInfoComponent } from './shared/components/saving-form/sender-info/sender-info.component';
import { MoneyListComponent } from './shared/components/tabs/money-list/money-list.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { FinalizeFormComponent } from './shared/components/finalize-form/finalize-form.component';
import { DialogFormCoOwnerComponent } from './shared/components/saving-form/extend-info/dialog-form-co-owner/dialog-form-co-owner.component';
import { DialogFormLegalRepresentativeComponent } from './shared/components/saving-form/extend-info/dialog-form-legal-representative/dialog-form-legal-representative.component';
import { MoneyTableComponent } from './shared/components/saving-form/money-table/money-table.component';
import { MoneyAcnInputComponent } from './shared/components/saving-form/money-table/money-acn-input/money-acn-input.component';
import { DialogFormBeneficiaryComponent } from './shared/components/saving-form/extend-info/dialog-form-beneficiary/dialog-form-beneficiary.component';
import { CustomerSearchComponent } from './shared/components/saving-form/extend-info/customer-search/customer-search.component';

@NgModule({
  declarations: [
    CreateSavingComponent,
    DetailSavingComponent,
    CreateSettlementComponent,
    DetailSettlementComponent,
    MoneyListComponent,
    ListDialogComponent,
    FormArrayComponent,
    ListPendingComponent,
    ListRequestComponent,
    FormSearchComponent,
    SenderInfoComponent,
    SavingFormComponent,
    CollapseSectionComponent,
    NgAutocompleteComponent,
    ListButtonOpenDialogComponent,
    DialogUDFComponent,
    SavingAccountInfoComponent,
    DialogFormAuthorizedPersonComponent,
    DialogFormLegalRepresentativeComponent,
    FinalizeFormComponent,
    DialogFormCoOwnerComponent,
    MoneyTableComponent,
    MoneyAcnInputComponent,
    DialogFormBeneficiaryComponent,
    CustomerSearchComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedModule,
    LpbSavingsServiceRoutingModule,
    MatExpansionModule,
    MatCheckboxModule,
  ],
})
export class LpbSavingsServiceModule {}
