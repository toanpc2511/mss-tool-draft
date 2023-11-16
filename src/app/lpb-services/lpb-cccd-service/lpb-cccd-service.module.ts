import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LpbCccdServiceRoutingModule } from './lpb-cccd-service-routing.module';
import { CccdComponent } from './cccd/cccd.component';
import {SharedModule} from '../../shared.module';
import { DetailComponent } from './cccd/detail/detail.component';
import {NgxPrintModule} from 'ngx-print';


@NgModule({
  declarations: [CccdComponent, DetailComponent],
  imports: [
    CommonModule,
    LpbCccdServiceRoutingModule,
    SharedModule,
    NgxPrintModule
  ]
})
export class LpbCccdServiceModule { }
