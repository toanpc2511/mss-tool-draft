import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LpbCreditCardServiceRoutingModule } from './lpb-credit-card-service-routing.module';
import { HistoryComponent } from './history/history.component';
import { RegisterReleaseComponent } from './register-release/register-release.component';
import {SharedModule} from '../../shared.module';
import {ProgressSpinnerModule} from '../../progress-spinner/progress-spinner.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import {FormsModule} from '@angular/forms';
import { QuantityRequestedComponent } from './quantity-requested/quantity-requested.component';
import { ApproveNhsComponent } from './approve-nhs/approve-nhs.component';
import { ReportComponent } from './report/report.component';
import { ApproveKsvComponent } from './approve-ksv/approve-ksv.component';
import { DetailsComponent } from './details/details.component';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
  declarations: [
    HistoryComponent,
    RegisterReleaseComponent,
    QuantityRequestedComponent,
    ApproveNhsComponent,
    ReportComponent,
    ApproveKsvComponent,
    DetailsComponent],
  imports: [
    CommonModule,
    LpbCreditCardServiceRoutingModule,
    SharedModule,
    ProgressSpinnerModule,
    MatSidenavModule,
    FormsModule,
    MatDialogModule
  ]
})
export class LpbCreditCardServiceModule { }
