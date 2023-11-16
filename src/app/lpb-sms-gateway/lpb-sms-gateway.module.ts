import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LpbSmsGatewayRoutingModule } from './lpb-sms-gateway-routing.module';
import { TestComponent } from './test/test.component';


@NgModule({
  declarations: [TestComponent],
  imports: [
    CommonModule,
    LpbSmsGatewayRoutingModule
  ]
})
export class LpbSmsGatewayModule { }
