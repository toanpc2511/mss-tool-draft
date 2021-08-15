import { NgModule } from '@angular/core';
import { StringMaxLengthPipe } from './string-maxlength.pipe';
import { VnCurrencyPipe } from './vn-currency.pipe';

@NgModule({
	declarations: [StringMaxLengthPipe, VnCurrencyPipe],
	exports: [StringMaxLengthPipe, VnCurrencyPipe]
})
export class PipesModule {}
