import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LpbEcontractServiceRoutingModule } from './lpb-econtract-service-routing.module';
import { ListComponent } from './list/list.component';
import { ReportComponent } from './report/report.component';
import { ApproveComponent } from './approve/approve.component';


@NgModule({
  declarations: [ListComponent, ReportComponent, ApproveComponent],
  imports: [
    CommonModule,
    LpbEcontractServiceRoutingModule
  ]
})
export class LpbEcontractServiceModule { }
