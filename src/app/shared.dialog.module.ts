import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './manager-menu-tree/_dialog/dialog.component';
import { DialogService } from './manager-menu-tree/_dialog/dialog.service';

@NgModule({
  imports: [CommonModule],
  exports: [DialogComponent],
  declarations: [DialogComponent],
  providers: [DialogService]
})
export class SharedDialogModule { }
