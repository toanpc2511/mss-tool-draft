import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QrCodeComponent } from './qr-code.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'danh-sach',
    pathMatch: 'full'
  },
  {
    path: 'danh-sach',
    children: [
      {
        path: '',
        component: QrCodeComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QrCodeRoutingModule {}
