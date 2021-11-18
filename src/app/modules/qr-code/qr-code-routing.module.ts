import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QrCodeProductOtherComponent } from './qr-code-product-other/qr-code-product-other.component';
import { QrCodePumpHosesComponent } from './qr-code-pump-hoses/qr-code-pump-hoses.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'qr-san-pham',
    component: QrCodeProductOtherComponent,
  },
  {
    path: 'qr-voi',
    component: QrCodePumpHosesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QrCodeRoutingModule {}
