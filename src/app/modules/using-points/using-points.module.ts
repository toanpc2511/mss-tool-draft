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
import { NgSelectModule } from 'src/app/shared/components/ng-select/public-api';
import { UsingPointsComponent } from './using-points.component';
import { UsingPointsRoutingModule } from './using-points-routing.module';
import { HistoryUsingPointsComponent } from './history-using-points/history-using-points.component';

@NgModule({
	declarations: [UsingPointsComponent, HistoryUsingPointsComponent],
	imports: [
		CommonModule,
		UsingPointsRoutingModule,
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
export class UsingPointsModule {}
