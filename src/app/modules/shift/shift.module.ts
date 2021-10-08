import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import {
	NgbDatepickerModule,
	NgbPopoverModule,
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
import { DayWrapperComponent, EventWrapperComponent, ShiftWorkComponent } from './shift-work/shift-work.component';
import { ShiftComponent } from './shift.component';
import { EmployeeComponent } from './shift-work/employee/employee.component';
import { CheckAllPipe } from './shift-work/employee/check-all.pipe';
import { ShiftWorkConfigComponent } from './shift-work-config/shift-work-config.component';
import { ShiftWorkConfigModalComponent } from './shift-work-config-modal/shift-work-config-modal.component';
<<<<<<< HEAD
import { PumpPoleDisplayPipe } from './shift-work/pump-pole-display.pipe';
import { DateStringPipe } from './shift-work/date-string.pipe';
=======
import { CreateCalendarModalComponent } from './create-calendar-modal/create-calendar-modal.component';
>>>>>>> f439eb334bbe11a3115ce22b8c49ec056ff3ade5

@NgModule({
	declarations: [
		ShiftComponent,
		ShiftWorkComponent,
		EventWrapperComponent,
		EmployeeComponent,
		CheckAllPipe,
		DayWrapperComponent,
    ShiftWorkConfigComponent,
    ShiftWorkConfigModalComponent,
<<<<<<< HEAD
    PumpPoleDisplayPipe,
    DateStringPipe
=======
    CreateCalendarModalComponent
>>>>>>> f439eb334bbe11a3115ce22b8c49ec056ff3ade5
	],
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
		FullCalendarModule,
		NgbPopoverModule
	],
})
export class ShiftModule {}
