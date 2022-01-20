import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListImpactHistoryComponent } from './list-impact-history/list-impact-history.component';
import { DetailImpactHistoryComponent } from './detail-impact-history/detail-impact-history.component';

const routes: Routes = [
  {
    path: 'danh-sach',
    component: ListImpactHistoryComponent,
    pathMatch: 'full'
  },
  {
    path: 'chi-tiet/:code',
    component: DetailImpactHistoryComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImpactHistoryRoutingModule {}
