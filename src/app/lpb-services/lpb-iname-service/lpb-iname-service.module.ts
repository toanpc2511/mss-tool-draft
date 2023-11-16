import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LpbInameServiceRoutingModule} from './lpb-iname-service-routing.module';
import {RuleComponent} from './rule/rule.component';
import {PackingComponent} from './packing/packing.component';
import {PromotionComponent} from './promotion/promotion.component';
import {SharedModule} from '../../shared.module';
import {LpbDepositServiceModule} from '../lpb-deposit-service/lpb-deposit-service.module';
import {CreateComponent} from './rule/create/create.component';
import {LimitComponent} from './limit/limit.component';
import {LimitCreateComponent} from './limit/limit-create/limit-create.component';
import {PackingCreateComponent} from './packing/packing-create/packing-create.component';
import {PromotionCreateComponent} from './promotion/promotion-create/promotion-create.component';


@NgModule({
  declarations: [RuleComponent, PackingComponent, PromotionComponent, CreateComponent, LimitComponent, LimitCreateComponent, PackingCreateComponent, PromotionCreateComponent],
  imports: [
    CommonModule,
    LpbInameServiceRoutingModule,
    SharedModule,
    LpbDepositServiceModule
  ]
})
export class LpbInameServiceModule {
}
