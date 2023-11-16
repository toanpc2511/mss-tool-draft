import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LpbTaxServiceRoutingModule} from './lpb-tax-service-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularMaterialModule} from '../../angular-material.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {SharedModule} from '../../shared.module';
import {PersonalTaxComponent} from './personal-tax/personal-tax.component';
import {BusinessTaxComponent} from './business-tax/business-tax.component';
import {CreatePersonalTaxComponent} from './personal-tax/create-personal-tax/create-personal-tax.component';
import {
  CreateSeflCollectedTaxComponent
} from './personal-tax/create-sefl-collected-tax/create-sefl-collected-tax.component';
import {DetailPersonalTaxComponent} from './personal-tax/detail-personal-tax/detail-personal-tax.component';
import {DestroyService} from '../../shared/services/destroy.service';
import { SearchInfoTaxComponent } from './personal-tax/create-personal-tax/search-info-tax/search-info-tax.component';
import { CreateTransactionComponent } from './personal-tax/create-personal-tax/create-transaction/create-transaction.component';
import {VnCurency} from '../../shared/pipes/vn-curentcy.pipe';
import { ApproveTransactionExtralComponent } from './approve-transaction-extral/approve-transaction-extral.component';

@NgModule({
  declarations: [
    PersonalTaxComponent,
    BusinessTaxComponent,
    CreatePersonalTaxComponent,
    CreateSeflCollectedTaxComponent,
    DetailPersonalTaxComponent,
    SearchInfoTaxComponent,
    CreateTransactionComponent,
    ApproveTransactionExtralComponent
  ],
  imports: [
    CommonModule,
    LpbTaxServiceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    NgSelectModule,
    SharedModule
  ],
  providers: [DestroyService, VnCurency]
})

export class LpbTaxServiceModule {
}
