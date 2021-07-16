import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { CreateStationModalComponent } from './create-station-modal/create-station-modal.component';
import { GasStationRoutingModule } from './gas-station-routing.module';
import { GasStationComponent } from './gas-station.component';
import { ListStationComponent } from './list-station/list-station.component';

@NgModule({
  declarations: [GasStationComponent, ListStationComponent, CreateStationModalComponent],
  imports: [CommonModule, GasStationRoutingModule, CRUDTableModule, InlineSVGModule]
})
export class GasStationModule {}
