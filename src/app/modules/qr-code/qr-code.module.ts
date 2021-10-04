import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { InputTrimModule } from 'ng2-trim-directive';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { QrCodeRoutingModule } from './qr-code-routing.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { QrCodeComponent } from './qr-code.component';



@NgModule({
  declarations: [
    QrCodeComponent
  ],
  imports: [
    CommonModule,
    QrCodeRoutingModule,
    CommonModule,
    NgbTooltipModule,
    InlineSVGModule,
    CRUDTableModule,
    FormsModule,
    SharedComponentsModule,
    ReactiveFormsModule,
    InputTrimModule,
    DirectivesModule
  ]
})
export class QrCodeModule { }
