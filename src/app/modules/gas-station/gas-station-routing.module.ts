import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateStationComponent } from './create-station/create-station.component';
import { ListLayoutComponent } from './list-layout/list-layout.component';
import { ListStationComponent } from './list-station/list-station.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'danh-sach',
    component: ListLayoutComponent,
    children: [
      {
        path: '',
        component: ListStationComponent
      },
      {
        path: 'them-tram',
        component: CreateStationComponent
      },
      {
        path: 'sua-tram/:id',
        component: CreateStationComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GasStationRoutingModule {}
