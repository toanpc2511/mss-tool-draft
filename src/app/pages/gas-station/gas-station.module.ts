import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GasStationRoutingModule } from './gas-station-routing.module';
import { GasStationComponent } from './gas-station.component';
import { ListStationComponent } from './list-station/list-station.component';

@NgModule({
  declarations: [GasStationComponent, ListStationComponent],
  imports: [CommonModule, GasStationRoutingModule]
})
export class GasStationModule {}
