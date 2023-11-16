import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LpbBaseServiceComponentComponent} from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';
import {RuleComponent} from './rule/rule.component';
import {PackingComponent} from './packing/packing.component';
import {PromotionComponent} from './promotion/promotion.component';
import {CreateComponent} from './rule/create/create.component';
import {LimitComponent} from './limit/limit.component';
import {LimitCreateComponent} from './limit/limit-create/limit-create.component';
import {PackingCreateComponent} from './packing/packing-create/packing-create.component';
import {PromotionCreateComponent} from './promotion/promotion-create/promotion-create.component';

const routes: Routes = [
  {
    path: '', component: LpbBaseServiceComponentComponent, children: [
      {
        path: 'rule', children: [
          {path: '', component: RuleComponent},
          {path: 'create', component: CreateComponent},
        ]
      },
      {
        path: 'limit', children: [
          {path: '', component: LimitComponent},
          {path: 'create', component: LimitCreateComponent},
        ]
      },
      {
        path: 'packing', children: [
          {path: '', component: PackingComponent},
          {path: 'create', component: PackingCreateComponent},
        ]
      },
      {
        path: 'promotion', children: [
          {path: '', component: PromotionComponent},
          {path: 'create', component: PromotionCreateComponent},
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpbInameServiceRoutingModule {
}
