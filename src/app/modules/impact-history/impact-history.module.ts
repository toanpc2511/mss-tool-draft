import { AuthModule } from './../auth/auth.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbDatepickerModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { InputTrimModule } from 'ng2-trim-directive';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { ListImpactHistoryComponent } from './list-impact-history/list-impact-history.component';
import { ImpactHistoryRoutingModule } from './impact-history-routing.module';
import { ImpactHistoryComponent } from './impact-history.component';
import { DetailImpactHistoryComponent } from './detail-impact-history/detail-impact-history.component';

@NgModule({
  declarations: [ImpactHistoryComponent, ListImpactHistoryComponent, DetailImpactHistoryComponent],
  imports: [
    ImpactHistoryRoutingModule,
    CommonModule,
    NgbTooltipModule,
    InlineSVGModule,
    CRUDTableModule,
    FormsModule,
    SharedComponentsModule,
    ReactiveFormsModule,
    InputTrimModule,
    AuthModule,
    NgbDatepickerModule,
    DirectivesModule,
    NgbAccordionModule
  ]
})
export class ImpactHistoryModule {}
