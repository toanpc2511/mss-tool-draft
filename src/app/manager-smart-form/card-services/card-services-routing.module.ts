import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CardLostDamagedRequestComponent} from './card-lost-damaged-request/card-lost-damaged-request.component';
import {CardRequestUpdatePhoneNumberComponent} from './card-request-update-phone-number/card-request-update-phone-number.component';
import {CardServiceSearchEbsComponent} from './card-service-search-ebs/card-service-search-ebs.component';
import {CardApproveUpdatePhoneNumberComponent} from './card-approve-update-phone-number/card-approve-update-phone-number.component';
import {ReportUpdateCifToSvboComponent} from './report-update-cif-to-svbo/report-update-cif-to-svbo.component';
import { CardServicesExtendComponent } from './card-services-extend/card-services-extend.component';
import {CardServicesApproveExtendComponent} from './card-services-approve-extend/card-services-approve-extend.component';
import {ReportCardTransactionComponent} from './report-card-transaction/report-card-transaction.component';
import {LpbHomeServiceComponent} from '../../shared/components/lpb-home-service/lpb-home-service.component';

const routes: Routes = [
  {
    path: '',
    component: LpbHomeServiceComponent
  },
  {
    path: 'issuance-request',
    component: CardServiceSearchEbsComponent
  },
  {
    path: 'card-services-approve',
    component: CardServicesApproveExtendComponent
  },
  {
    path: 'lost-damaged-request',
    component: CardLostDamagedRequestComponent
  },
  {
    path: 'request-phone-number-update',
    component: CardRequestUpdatePhoneNumberComponent
  },
  {
    path: 'approve-phone-number-update',
    component: CardApproveUpdatePhoneNumberComponent
  },
  {
    path: 'report-update-cif-to-svbo',
    component: ReportUpdateCifToSvboComponent
  },
  {
    path: 'card-services-extend',
    component: CardServicesExtendComponent
  },
  {
    path: 'report-card-transaction',
    component: ReportCardTransactionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardServicesRoutingModule {
}
