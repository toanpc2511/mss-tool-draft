import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecimalMaskDirective } from './decimal-mask.directive';
@NgModule({
  declarations: [DecimalMaskDirective],
  imports: [CommonModule],
  exports: [DecimalMaskDirective]
})
export class DirectivesModule {}
