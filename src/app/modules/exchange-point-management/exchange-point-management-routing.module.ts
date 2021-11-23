import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExchangePointHistoryComponent } from './exchange-point-history/exchange-point-history.component';
import { ExchangePointComponent } from './exchange-point/exchange-point.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'lich-su',
    component: ExchangePointHistoryComponent
  },
  {
    path: 'chi-tiet',
    component: ExchangePointComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangePointManagementRoutingModule { }
