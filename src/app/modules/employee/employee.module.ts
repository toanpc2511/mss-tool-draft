import { AuthModule } from './../auth/auth.module';
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
import { EmployeeDetailModalComponent } from './employee-detail-modal/employee-detail-modal.component';
import { EmployeeModalComponent } from './employee-modal/employee-modal.component';
import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from './employee.component';
import { ListEmployeeComponent } from './list-employee/list-employee.component';
import { ListEmployeeAssessmentComponent } from './employee-assessment/list-employee-assessment/list-employee-assessment.component';

@NgModule({
	declarations: [EmployeeComponent, ListEmployeeComponent, EmployeeModalComponent, EmployeeDetailModalComponent, ListEmployeeAssessmentComponent],
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
		AuthModule
	]
})
export class EmployeeModule {}
