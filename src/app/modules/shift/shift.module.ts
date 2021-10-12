import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import {
	NgbDatepickerModule,
	NgbModalModule,
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
import {
	DayWrapperComponent,
	EventWrapperComponent,
	ShiftWorkComponent
} from './shift-work/shift-work.component';
import { ShiftComponent } from './shift.component';
import { EmployeeComponent } from './shift-work/employee/employee.component';
import { CheckAllPipe } from './shift-work/employee/check-all.pipe';
import { ShiftWorkConfigComponent } from './shift-work-config/shift-work-config.component';
import { ShiftWorkConfigModalComponent } from './shift-work-config-modal/shift-work-config-modal.component';
import { PumpPoleDisplayPipe } from './shift-work/pump-pole-display.pipe';
import { DateStringPipe } from './shift-work/date-string.pipe';
import { CreateCalendarModalComponent } from './create-calendar-modal/create-calendar-modal.component';
import { FormatTimePipe } from './create-calendar-modal/format-time.pipe';
import { IsCheckedPipe } from './create-calendar-modal/is-checked.pipe';
import { DetailWarningDialogComponent } from './shift-work/detail-warning-dialog/detail-warning-dialog.component';

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
		DetailWarningDialogComponent
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
