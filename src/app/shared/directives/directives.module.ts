import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecimalMaskDirective } from './decimal-mask.directive';
import { NumberDirective } from './numberic-only.directive';
@NgModule({
	declarations: [DecimalMaskDirective, NumberDirective],
	imports: [CommonModule],
	exports: [DecimalMaskDirective, NumberDirective]
})
export class DirectivesModule {}
