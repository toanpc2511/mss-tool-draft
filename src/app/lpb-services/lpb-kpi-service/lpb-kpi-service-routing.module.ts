import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LpbBaseServiceComponentComponent} from '../../shared/components/lpb-base-service-component/lpb-base-service-component.component';
import {CnAprovedUploadComponent} from './clhc-atm-upload/cn-aproved-upload/cn-aproved-upload.component';
import {ReportUploadComponent} from './clhc-atm-upload/report-upload/report-upload.component';
import {HoAprovedUploadComponent} from './clhc-atm-upload/ho-aproved-upload/ho-aproved-upload.component';
import {UploadFileComponent} from './clhc-atm-upload/upload-file.component';
import {CnSendUploadComponent} from './clhc-atm-upload/cn-send-upload/cn-send-upload.component';

const routes: Routes = [
  {
    path: '', component: LpbBaseServiceComponentComponent, children: [
      {
        path: 'clht-atm-upload', children: [
          {
            path: 'upload-file', children: [
              {path: '', component: UploadFileComponent},
            ]
          },
          {path: 'approve', component: HoAprovedUploadComponent},
          {path: 'upload-file-dvkd', component: CnSendUploadComponent},
          {path: 'upload-file-dvkd-approve', component: CnAprovedUploadComponent},
          {path: 'report', component: ReportUploadComponent},
        ]
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpbKpiServiceRoutingModule {
}
