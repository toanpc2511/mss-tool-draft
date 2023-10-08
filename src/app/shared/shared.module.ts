import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

const MATERIAL_MODULES = [
  MatMenuModule,
  MatGridListModule,
  MatIconModule,
  MatFormFieldModule,
  MatBottomSheetModule,
  MatListModule,
  MatButtonModule,
  MatCardModule,
];

@NgModule({
  declarations: [],
  providers: [FormBuilder],
  imports: [CommonModule, ...MATERIAL_MODULES],
  exports: [...MATERIAL_MODULES],
})
export class SharedModule {}
