import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstLetterPipe } from './pipes/first-letter.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { DisableControlDirective } from './directives/disable-control.directive';

@NgModule({
  declarations: [FirstLetterPipe, SafePipe, DisableControlDirective],
  imports: [CommonModule],
    exports: [FirstLetterPipe, SafePipe, DisableControlDirective],
})
export class CoreModule { }
