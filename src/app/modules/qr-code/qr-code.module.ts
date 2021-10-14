import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { InputTrimModule } from 'ng2-trim-directive';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { QrCodeRoutingModule } from './qr-code-routing.module';
import { QrCodeComponent } from './qr-code.component';
import { QrCodeProductOtherComponent } from './qr-code-product-other/qr-code-product-other.component';
import { QrCodePumpHosesComponent } from './qr-code-pump-hoses/qr-code-pump-hoses.component';

@NgModule({
  declarations: [
    QrCodeComponent,
    QrCodeProductOtherComponent,
    QrCodePumpHosesComponent
  ],
  imports: [
    CommonModule,
    QrCodeRoutingModule,
    NgbTooltipModule,
    InlineSVGModule,
    CRUDTableModule,
    FormsModule,
    SharedComponentsModule,
    ReactiveFormsModule,
    InputTrimModule
  ]
})
export class QrCodeModule {}
