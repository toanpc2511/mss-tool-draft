import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { LpbTransferServiceRoutingModule } from './lpb-transfer-service-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { SearchFormComponent } from './shared/components/search-form/search-form.component';

import { TransferFormComponent } from './shared/components/transfer-form/transfer-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeeTableComponent } from './shared/components/fee-table/fee-table.component';
import { AutocompleteInputComponent } from './shared/components/autocomplete-input/autocomplete-input.component';

import { ListComponent as InternalListComponent } from './internal/list/list.component';
import { CreateComponent as InternalCreateComponent } from './internal/create/create.component';
import { DetailComponent as InternalDetailComponent } from './internal/detail/detail.component';

import { CreateComponent as CitadCreateComponent } from './citad/create/create.component';
import { DetailComponent as CitadDetailComponent } from './citad/detail/detail.component';

import { CreateComponent as NapasCreateComponent } from './napas/create/create.component';
import { DetailComponent as NapasDetailComponent } from './napas/detail/detail.component';
import { CitadTransferFormComponent } from './shared/components/external-transfer-form/citad-transfer-form/citad-transfer-form.component';
import { ExternalTransferFormComponent } from './shared/components/external-transfer-form/external-transfer-form.component';
import { HomeComponent } from './home/home.component';
import { NapasTransferFormComponent } from './shared/components/external-transfer-form/napas-transfer-form/napas-transfer-form.component';

@NgModule({
  declarations: [
    SearchFormComponent,
    TransferFormComponent,
    FeeTableComponent,
    AutocompleteInputComponent,
    InternalListComponent,
    InternalCreateComponent,
    InternalDetailComponent,
    CitadCreateComponent,
    CitadDetailComponent,
    NapasCreateComponent,
    NapasDetailComponent,
    CitadTransferFormComponent,
    ExternalTransferFormComponent,
    NapasTransferFormComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgSelectModule,
    LpbTransferServiceRoutingModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
})
export class LpbTransferServiceModule {}
