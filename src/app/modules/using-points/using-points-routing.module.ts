import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoryUsingPointsComponent } from './history-using-points/history-using-points.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'danh-sach',
		pathMatch: 'full'
	},
	{
		path: 'danh-sach',
		component: HistoryUsingPointsComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class UsingPointsRoutingModule {}
