import { AuthModule } from './../auth/auth.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	NgbDatepickerModule,
	NgbProgressbarModule,
	NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { InputTrimModule } from 'ng2-trim-directive';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { ContractRoutingModule } from './contract-routing.module';
import { ListContractComponent } from './list-contract/list-contract.component';
import { CreateContractComponent } from './create-contract/create-contract.component';
import { DetailsContractComponent } from './details-contract/details-contract.component';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { TextMaskModule } from 'angular2-text-mask';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { RejectContractModalComponent } from './details-contract/reject-contract-modal/reject-contract-modal.component';
import { ContractLiquidationComponent } from './contract-liquidation/contract-liquidation.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatCardModule} from "@angular/material/card";
import { ConfirmDialogComponent } from './contract-liquidation/confirm-dialog/confirm-dialog.component';
import { CreateContractLiquidationComponent } from './contract-liquidation/create-contract-liquidation/create-contract-liquidation.component';
import {UpdatePlanContractComponent} from "./details-contract/update-plan-contract/update-plan-contract.component";

@NgModule({
	declarations: [ListContractComponent, CreateContractComponent, DetailsContractComponent, RejectContractModalComponent, ContractLiquidationComponent, ConfirmDialogComponent, CreateContractLiquidationComponent, UpdatePlanContractComponent],
  imports: [
    CommonModule,
    ContractRoutingModule,
    NgbTooltipModule,
    InlineSVGModule,
    CRUDTableModule,
    FormsModule,
    SharedComponentsModule,
    ReactiveFormsModule,
    InputTrimModule,
    DirectivesModule,
    NgbDatepickerModule,
    TextMaskModule,
    PipesModule,
    NgbProgressbarModule,
    AuthModule,
    MatTabsModule,
    MatCardModule
  ]
})
export class ContractModule {}
