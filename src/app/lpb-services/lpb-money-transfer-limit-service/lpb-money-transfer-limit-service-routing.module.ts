import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LpbBaseServiceComponentComponent} from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';
import {CurrencyRateComponent} from './currency-rate/currency-rate.component';
import {CurrencyRateCreateComponent} from './currency-rate/currency-rate-create/currency-rate-create.component';
import {CurrencyRateImportComponent} from './currency-rate/currency-rate-import/currency-rate-import.component';
import {CountryLimitComponent} from './country-limit/country-limit.component';
import {CountryLimitCreateComponent} from './country-limit/country-limit-create/country-limit-create.component';
import {CountryLimitImportComponent} from './country-limit/country-limit-import/country-limit-import.component';
import {CustomerPassportComponent} from './customer-passport/customer-passport.component';
import {CustomerPassportCreateComponent} from './customer-passport/customer-passport-create/customer-passport-create.component';
import {TransactionComponent} from './transaction/transaction.component';
import {TransactionEditComponent} from './transaction/transaction-edit/transaction-edit.component';
import {TransactionImportComponent} from './transaction/transaction-import/transaction-import.component';
import {QueryLimitComponent} from './query-limit/query-limit.component';

const routes: Routes = [
  {
    path: '', component: LpbBaseServiceComponentComponent, children: [
      {
        path: 'currency-rate', children: [
          {path: '', component: CurrencyRateComponent},
          {path: 'create', component: CurrencyRateCreateComponent},
          {path: 'import', component: CurrencyRateImportComponent}
        ]
      },
      {
        path: 'country-limit', children: [
          {path: '', component: CountryLimitComponent},
          {path: 'create', component: CountryLimitCreateComponent},
          {path: 'import', component: CountryLimitImportComponent}
        ]
      },
      {
        path: 'customer-passport', children: [
          {path: '', component: CustomerPassportComponent},
          {path: 'create', component: CustomerPassportCreateComponent}
        ]
      },
      {
        path: 'transaction', children: [
          {path: '', component: TransactionComponent},
          {path: 'create', component: TransactionEditComponent},
          {path: 'import', component: TransactionImportComponent}
        ]
      },
      {
        path: 'query-limit', children: [
          {path: '', component: QueryLimitComponent}
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpbMoneyTransferLimitServiceRoutingModule { }
