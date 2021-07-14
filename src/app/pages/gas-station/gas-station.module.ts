import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GasStationRoutingModule } from './gas-station-routing.module';
import { ListStationComponent } from './list-station/list-station.component';


@NgModule({
  declarations: [ListStationComponent],
  imports: [
    CommonModule,
    GasStationRoutingModule
  ]
})
export class GasStationModule { }
