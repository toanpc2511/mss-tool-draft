import { AuthModule } from './../auth/auth.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { InputTrimModule } from 'ng2-trim-directive';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { CustomerManagementComponent } from './customer-management.component';
import { CustomerManagementRoutingModule } from './customer-management-routing.module';
import { ListCustomerComponent } from './list-customer/list-customer.component';
import { DetailCustomerComponent } from './detail-customer/detail-customer.component';
import { CustomerManagementPipe } from './customer-management.pipe';
import { InfoVehicleComponent } from './detail-customer/info-vehicle/info-vehicle.component';
import { InfoAccountComponent } from './detail-customer/info-account/info-account.component';
import { InfoContractComponent } from './detail-customer/info-contract/info-contract.component';
import { InfoAccountChildComponent } from './detail-customer/info-account-child/info-account-child.component';
import { DirectivesModule } from '../../shared/directives/directives.module';

@NgModule({
  declarations: [
    CustomerManagementComponent,
    ListCustomerComponent,
    DetailCustomerComponent,
    CustomerManagementPipe,
    InfoVehicleComponent,
    InfoAccountComponent,
    InfoContractComponent,
    InfoAccountChildComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    CustomerManagementRoutingModule,
    CRUDTableModule,
    InlineSVGModule,
    NgbTooltipModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    PipesModule,
    InputTrimModule,
    DirectivesModule,
    AuthModule
  ]
})
export class CustomerManagementModule {}
