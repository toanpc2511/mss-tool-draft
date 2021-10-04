import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	NgbDatepickerModule,
	NgbProgressbarModule,
	NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { InlineSVGModule } from 'ng-inline-svg';
import { InputTrimModule } from 'ng2-trim-directive';
import { NgSelectModule } from 'src/app/shared/components/ng-select/public-api';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { EmployeeRoutingModule } from './shift-routing.module';
import { ShiftComponent } from './shift.component';
import { ShiftWorkComponent } from './shift-work/shift-work.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ShiftWorkConfigComponent } from './shift-work-config/shift-work-config.component';
import { ShiftWorkConfigModalComponent } from './shift-work-config-modal/shift-work-config-modal.component';

@NgModule({
	declarations: [ShiftComponent, ShiftWorkComponent, ShiftWorkConfigComponent, ShiftWorkConfigModalComponent],
	imports: [
		CommonModule,
		EmployeeRoutingModule,
		NgbTooltipModule,
		InlineSVGModule,
		CRUDTableModule,
		NgSelectModule,
		FormsModule,
		SharedComponentsModule,
		ReactiveFormsModule,
		InputTrimModule,
		NgbDatepickerModule,
		TextMaskModule,
		PipesModule,
		NgbProgressbarModule,
		DirectivesModule,
		FullCalendarModule
	]
})
export class ShiftModule {}
