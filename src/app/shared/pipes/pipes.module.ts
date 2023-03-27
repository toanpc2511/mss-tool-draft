import { NgModule } from '@angular/core';
import { StringMaxLengthPipe } from './string-maxlength.pipe';
import { VnCurrencyPipe } from './vn-currency.pipe';
import { CustomDatePipe } from './custom-date.pipe';
import { TransformValueListPipe } from './transform-value-list.pipe';
@NgModule({
	declarations: [StringMaxLengthPipe, VnCurrencyPipe, CustomDatePipe, TransformValueListPipe],
	exports: [StringMaxLengthPipe, VnCurrencyPipe, CustomDatePipe, TransformValueListPipe]
})
export class PipesModule {}
