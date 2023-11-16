import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [CommonModule, MatIconModule, MatDatepickerModule, MatTooltipModule, FormsModule, NgSelectModule, ReactiveFormsModule, SharedModule],
  declarations: [],
  exports: [],
})
export class ElectricSharedModule { }
