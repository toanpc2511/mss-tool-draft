import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LpbMoneyTransferLimitServiceRoutingModule} from './lpb-money-transfer-limit-service-routing.module';
import {CurrencyRateComponent} from './currency-rate/currency-rate.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared.module';
import {CurrencyRateCreateComponent} from './currency-rate/currency-rate-create/currency-rate-create.component';
import {CurrencyRateImportComponent} from './currency-rate/currency-rate-import/currency-rate-import.component';
import {CurrencyRateRejectComponent} from './currency-rate/currency-rate-reject/currency-rate-reject.component';
import {CountryLimitComponent} from './country-limit/country-limit.component';
import {CountryLimitCreateComponent} from './country-limit/country-limit-create/country-limit-create.component';
import {CountryLimitImportComponent} from './country-limit/country-limit-import/country-limit-import.component';
import {CountryLimitRejectPopupComponent} from './country-limit/country-limit-reject-popup/country-limit-reject-popup.component';
import {CustomerPassportComponent} from './customer-passport/customer-passport.component';
import {CustomerPassportCreateComponent} from './customer-passport/customer-passport-create/customer-passport-create.component';
import {CustomerPassportRejectComponent} from './customer-passport/customer-passport-reject/customer-passport-reject.component';
import {MatIconModule} from '@angular/material/icon';
import {TransactionComponent} from './transaction/transaction.component';
import {TransactionEditComponent} from './transaction/transaction-edit/transaction-edit.component';
import {TransactionImportComponent} from './transaction/transaction-import/transaction-import.component';
import {QueryLimitComponent} from './query-limit/query-limit.component';


@NgModule({
  declarations: [CurrencyRateComponent, CurrencyRateCreateComponent, CurrencyRateImportComponent, CurrencyRateRejectComponent, CountryLimitComponent, CountryLimitCreateComponent, CountryLimitImportComponent, CountryLimitRejectPopupComponent, CustomerPassportComponent, CustomerPassportCreateComponent, CustomerPassportRejectComponent, TransactionComponent, TransactionEditComponent, TransactionImportComponent, QueryLimitComponent],
  imports: [
    CommonModule,
    LpbMoneyTransferLimitServiceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatIconModule
  ]
})
export class LpbMoneyTransferLimitServiceModule {
}
