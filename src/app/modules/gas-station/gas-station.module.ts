import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { GasStationRoutingModule } from './gas-station-routing.module';
import { GasStationComponent } from './gas-station.component';
import { ListStationComponent } from './list-station/list-station.component';
import { Step1Component } from './create-station/step1/step1.component';
import { Step2Component } from './create-station/step2/step2.component';
import { Step3Component } from './create-station/step3/step3.component';
import { Step4Component } from './create-station/step4/step4.component';
import { CreateStationComponent } from './create-station/create-station.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    GasStationComponent,
    ListStationComponent,
    CreateStationComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component
  ],
  imports: [
    CommonModule,
    GasStationRoutingModule,
    CRUDTableModule,
    InlineSVGModule,
    NgbTooltipModule
  ]
})
export class GasStationModule {}
