import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidateComponent } from './validate/validate.component';

@NgModule({
  declarations: [ValidateComponent],
  imports: [CommonModule],
  exports: [ValidateComponent]
})
export class SharedComponentsModule {}
