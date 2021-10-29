import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidateComponent } from './validate/validate.component';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';
import { NgSelectModule } from './ng-select/public-api';
import { TabComponent } from './tab/tab.component';
import { ListLayoutComponent } from './list-layout/list-layout.component';

@NgModule({
	declarations: [ValidateComponent, ConfirmDeleteComponent, TabComponent, ListLayoutComponent],
	imports: [CommonModule, NgSelectModule, RouterModule],
	exports: [
		ValidateComponent,
		NgSelectModule,
		ConfirmDeleteComponent,
		TabComponent,
		ListLayoutComponent
	]
})
export class SharedComponentsModule {}
