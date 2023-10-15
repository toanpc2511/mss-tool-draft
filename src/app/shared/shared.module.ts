import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

const MATERIAL_MODULES = [
  MatCheckboxModule,
  MatGridListModule,
  MatChipsModule,
  MatTabsModule,
  MatIconModule,
  MatButtonModule,
  MatGridListModule,
  MatTabsModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatRadioModule,
  MatMenuModule,
  MatTooltipModule,
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...MATERIAL_MODULES,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ...MATERIAL_MODULES,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [FormBuilder],
})
export class SharedModule {}
