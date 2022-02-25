import { AuthModule } from './../auth/auth.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { InputTrimModule } from 'ng2-trim-directive';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { HistoryOfUsingPointsComponent } from './history-of-using-points.component';
import { HistoryOfUsingPointsRoutingModule } from './history-of-using-points-routing.module';
import { DirectivesModule } from '../../shared/directives/directives.module';

@NgModule({
	declarations: [HistoryOfUsingPointsComponent],
	imports: [
		HistoryOfUsingPointsRoutingModule,
		CommonModule,
		NgbTooltipModule,
		InlineSVGModule,
		CRUDTableModule,
		FormsModule,
		SharedComponentsModule,
		ReactiveFormsModule,
		InputTrimModule,
		AuthModule,
		NgbDatepickerModule,
		DirectivesModule
	]
})
export class HistoryOfUsingPointsModule {}
