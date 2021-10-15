import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import {
	NgbDatepickerModule, NgbPopoverModule,
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
import { CreateCalendarModalComponent } from './create-calendar-modal/create-calendar-modal.component';
import { FormatTimePipe } from './create-calendar-modal/format-time.pipe';
import { IsCheckedPipe } from './create-calendar-modal/is-checked.pipe';
import { EmployeeRoutingModule } from './shift-routing.module';
import { ShiftWorkConfigModalComponent } from './shift-work-config-modal/shift-work-config-modal.component';
import { ShiftWorkConfigComponent } from './shift-work-config/shift-work-config.component';
import { DateStringPipe } from './shift-work/date-string.pipe';
import { DeleteCalendarAllComponent } from './shift-work/delete-calendar-all/delete-calendar-all.component';
import { DetailWarningDialogComponent } from './shift-work/detail-warning-dialog/detail-warning-dialog.component';
import { DisplayTimePipe } from './shift-work/display-time.pipe';
import { CheckAllPipe } from './shift-work/employee/check-all.pipe';
import { EmployeeComponent } from './shift-work/employee/employee.component';
import { IsFeatureDatePipe } from './shift-work/is-feature-date.pipe';
import { PumpPoleDisplayPipe } from './shift-work/pump-pole-display.pipe';
import {
	DayWrapperComponent,
	EventWrapperComponent,
	ShiftWorkComponent
} from './shift-work/shift-work.component';
import { ShiftComponent } from './shift.component';
import { DisplayStartEndCalendarPipe } from './shift-work/display-start-end-calendar.pipe';

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
		PumpPoleDisplayPipe,
		DateStringPipe,
		CreateCalendarModalComponent,
		FormatTimePipe,
		IsCheckedPipe,
		DetailWarningDialogComponent,
		DeleteCalendarAllComponent,
		DisplayTimePipe,
		IsFeatureDatePipe,
		DisplayStartEndCalendarPipe
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
	]
})
export class ShiftModule {}
