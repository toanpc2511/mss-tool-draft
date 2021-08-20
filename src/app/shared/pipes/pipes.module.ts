import { NgModule } from '@angular/core';
import { StringMaxLengthPipe } from './string-maxlength.pipe';
import { VnCurrencyPipe } from './vn-currency.pipe';
import { CustomDatePipe } from './custom-date.pipe';
@NgModule({
	declarations: [StringMaxLengthPipe, VnCurrencyPipe, CustomDatePipe],
	exports: [StringMaxLengthPipe, VnCurrencyPipe, CustomDatePipe]
})
export class PipesModule {}
