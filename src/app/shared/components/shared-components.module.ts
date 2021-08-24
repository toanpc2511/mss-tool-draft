import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidateComponent } from './validate/validate.component';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';
import { NgSelectModule } from './ng-select/public-api';

@NgModule({
  declarations: [ValidateComponent, ConfirmDeleteComponent],
  imports: [CommonModule, NgSelectModule],
  exports: [ValidateComponent, NgSelectModule]
})
export class SharedComponentsModule {}
