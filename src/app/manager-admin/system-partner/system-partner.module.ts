import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemPartnerRoutingModule } from './system-partner-routing.module';
import { ConnectEbsComponent } from './connect-ebs/connect-ebs.component';
import {SharedModule} from '../../shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {ProgressSpinnerModule} from '../../progress-spinner/progress-spinner.module';


@NgModule({
  declarations: [ConnectEbsComponent, ConfirmDialogComponent],
  imports: [
    CommonModule,
    SystemPartnerRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatDialogModule,
    ProgressSpinnerModule
  ]
})
export class SystemPartnerModule { }
