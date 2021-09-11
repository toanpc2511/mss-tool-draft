import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnerComponent } from './partner.component';
import { ListPartnerComponent } from './list-partner/list-partner.component';
import { PartnerModalComponent } from './partner-modal/partner-modal.component';
import { PartnerRoutingModule } from './parter-routing.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { NgSelectModule } from 'src/app/shared/components/ng-select/public-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { InputTrimModule } from 'ng2-trim-directive';
import { CarsDisplayPipe } from './cars-display.pipe';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';

@NgModule({
  declarations: [PartnerComponent, ListPartnerComponent, PartnerModalComponent, CarsDisplayPipe],
  imports: [
    CommonModule,
    PartnerRoutingModule,
    NgbTooltipModule,
    InlineSVGModule,
    CRUDTableModule,
    NgSelectModule,
    FormsModule,
    SharedComponentsModule,
    ReactiveFormsModule,
    InputTrimModule,
    PipesModule,
    DirectivesModule
  ]
})
export class PartnerModule { }
