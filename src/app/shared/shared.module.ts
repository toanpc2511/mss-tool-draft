import { DestroyService } from './services/destroy.service';
import { DirectivesModule } from './directives/directives.module';
import { ConfirmDeleteComponent } from './components/confirm-delete/confirm-delete.component';
import { AngularEditorModule } from './components/editor-config/angular-editor.module';

import { CRUDTableModule } from './../_metronic/shared/crud-table/crud-table.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidateComponent } from './components/validate/validate.component';
import { NgSelectModule } from './components/ng-select/public-api';

const components = [ValidateComponent, ConfirmDeleteComponent];

@NgModule({
	declarations: [...components],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		InlineSVGModule,
		CRUDTableModule,
		AngularEditorModule,
		DirectivesModule,
		NgSelectModule
	],
	providers: [DestroyService],
	exports: [
		FormsModule,
		ReactiveFormsModule,
		InlineSVGModule,
		CRUDTableModule,
		AngularEditorModule,
		DirectivesModule,
		NgSelectModule,
		...components
	]
})
export class SharedModule {}
