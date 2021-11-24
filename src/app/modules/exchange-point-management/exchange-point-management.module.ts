import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExchangePointManagementRoutingModule } from './exchange-point-management-routing.module';
import { ExchangePointHistoryComponent } from './exchange-point-history/exchange-point-history.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';
import { NgbDatepickerModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { InputTrimModule } from 'ng2-trim-directive';
import { ExchangePointComponent } from './exchange-point/exchange-point.component';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { PipesModule } from '../../shared/pipes/pipes.module';


@NgModule({
  declarations: [ExchangePointHistoryComponent, ExchangePointComponent],
	imports: [
		CommonModule,
		SharedComponentsModule,
		NgbTooltipModule,
		ExchangePointManagementRoutingModule,
		ReactiveFormsModule,
		CRUDTableModule,
		NgbDatepickerModule,
		InputTrimModule,
		DirectivesModule,
		PipesModule
	]
})
export class ExchangePointManagementModule { }
