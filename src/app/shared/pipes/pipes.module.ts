import { NgModule } from '@angular/core';
import { StringMaxLengthPipe } from './string-maxlength.pipe';

@NgModule({
  declarations: [StringMaxLengthPipe],
  exports: [StringMaxLengthPipe]
})
export class PipesModule {}
