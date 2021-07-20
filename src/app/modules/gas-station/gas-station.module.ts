import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { CreateStationComponent } from './create-station/create-station.component';
import { Step1Component } from './create-station/step1/step1.component';
import { CreateGasBinComponent } from './create-station/step2/create-gas-bin/create-gas-bin.component';
import { Step2Component } from './create-station/step2/step2.component';
import { PumpPoleModalComponent } from './create-station/step3/pump-pole-modal/pump-pole-modal.component';
import { Step3Component } from './create-station/step3/step3.component';
import { PumpHoseModalComponent } from './create-station/step4/pump-hose-modal/pump-hose-modal.component';
import { Step4Component } from './create-station/step4/step4.component';
import { GasStationRoutingModule } from './gas-station-routing.module';
import { GasStationComponent } from './gas-station.component';
import { CanActiveStepPipe } from './gas-station.pipe';
import { ListStationComponent } from './list-station/list-station.component';

@NgModule({
  declarations: [
    GasStationComponent,
    ListStationComponent,
    CreateStationComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    CanActiveStepPipe,
    PumpPoleModalComponent,
    CreateGasBinComponent,
    PumpHoseModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    GasStationRoutingModule,
    CRUDTableModule,
    InlineSVGModule,
    NgbTooltipModule,
    ReactiveFormsModule,
    SharedComponentsModule
  ]
})
export class GasStationModule {}
