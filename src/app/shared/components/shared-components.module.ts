import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidateComponent } from './validate/validate.component';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';
import { NgSelectModule } from './ng-select/public-api';
import { TabComponent } from './tab/tab.component';

@NgModule({
  declarations: [ValidateComponent, ConfirmDeleteComponent, TabComponent],
  imports: [CommonModule, NgSelectModule],
  exports: [ValidateComponent, NgSelectModule, TabComponent]
})
export class SharedComponentsModule {}
