import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidateComponent } from './validate/validate.component';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';

@NgModule({
  declarations: [ValidateComponent, ConfirmDeleteComponent],
  imports: [CommonModule],
  exports: [ValidateComponent]
})
export class SharedComponentsModule {}
