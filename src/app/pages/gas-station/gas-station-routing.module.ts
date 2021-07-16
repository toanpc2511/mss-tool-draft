import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListStationComponent } from './list-station/list-station.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'danh-sach',
    pathMatch: 'full'
  },
  {
    path: 'danh-sach',
    component: ListStationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GasStationRoutingModule {}
