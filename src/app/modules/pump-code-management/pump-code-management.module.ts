import { AuthModule } from './../auth/auth.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbAccordionModule,
  NgbDatepickerModule,
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { InputTrimModule } from 'ng2-trim-directive';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { NgSelectModule } from 'src/app/shared/components/ng-select/public-api';
import { PumpCodeManagementRoutingModule } from './pump-code-management-routing.module';
import { PumpCodeManagementComponent } from './pump-code-management.component';
import { PumpCodeHistoryComponent } from './pump-code-history/pump-code-history.component';
import { PumpHoseOperationComponent } from './pump-hose-operation/pump-hose-operation.component';

@NgModule({
  declarations: [
    PumpCodeManagementComponent,
    PumpCodeHistoryComponent,
    PumpHoseOperationComponent
  ],
  imports: [
    CommonModule,
    PumpCodeManagementRoutingModule,
    NgbTooltipModule,
    NgbDatepickerModule,
    NgbAccordionModule,
    NgSelectModule,
    InlineSVGModule,
    CRUDTableModule,
    FormsModule,
    SharedComponentsModule,
    ReactiveFormsModule,
    InputTrimModule,
    DirectivesModule,
    PipesModule,
    AuthModule
  ]
})
export class PumpCodeManagementModule {}
