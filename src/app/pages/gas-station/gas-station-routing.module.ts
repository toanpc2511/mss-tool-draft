import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListStationComponent } from './list-station/list-station.component';

const routes: Routes = [
  {
    path: '',
    component: ListStationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GasStationRoutingModule {}
