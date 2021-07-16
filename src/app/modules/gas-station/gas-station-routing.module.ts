import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateStationComponent } from './create-station/create-station.component';
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
  },
  {
    path: 'them-tram-xang',
    component: CreateStationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GasStationRoutingModule {}
