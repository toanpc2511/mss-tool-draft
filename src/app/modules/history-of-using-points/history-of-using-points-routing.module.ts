import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoryOfUsingPointsComponent } from './history-of-using-points.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'danh-sach',
		pathMatch: 'full'
	},
	{
		path: 'danh-sach',
		component: HistoryOfUsingPointsComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class HistoryOfUsingPointsRoutingModule {}
