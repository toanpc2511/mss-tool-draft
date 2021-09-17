import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	NgbAccordionModule,
	NgbDatepickerModule,
	NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { InputTrimModule } from 'ng2-trim-directive';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { TransactionComponent } from './transaction.component';
import { TransactionRoutingModule } from './transaction-routing.module';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { TransactionHistoryModalComponent } from './transaction-history-modal/transaction-history-modal.component';
import { NgSelectModule } from 'src/app/shared/components/ng-select/public-api';

@NgModule({
	declarations: [
		TransactionComponent,
		TransactionHistoryComponent,
		TransactionHistoryModalComponent
	],
	imports: [
		CommonModule,
		TransactionRoutingModule,
		NgbTooltipModule,
		NgbDatepickerModule,
		NgbAccordionModule,
		NgSelectModule,
		InlineSVGModule,
		CRUDTableModule,
		FormsModule,
		SharedComponentsModule,
		ReactiveFormsModule,
		InputTrimModule,
		DirectivesModule,
		PipesModule
	]
})
export class TransactionModule {}
