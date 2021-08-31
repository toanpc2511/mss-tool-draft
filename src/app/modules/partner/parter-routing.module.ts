import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPartnerComponent } from './list-partner/list-partner.component';
import { PartnerModalComponent } from './partner-modal/partner-modal.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'danh-sach',
		pathMatch: 'full'
	},
	{
		path: 'danh-sach',
		component: ListPartnerComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PartnerRoutingModule {}
