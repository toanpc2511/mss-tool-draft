import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './modules/auth/services/auth.guard';
import { DevComponent } from './modules/dev/dev.component';

export const routes: Routes = [
	{
		path: 'auth',
		loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule)
	},
	{
		path: 'error',
		loadChildren: () => import('./modules/errors/errors.module').then((m) => m.ErrorsModule)
	},
	{
		path: '',
		canActivate: [AuthGuard],
		loadChildren: () => import('./pages/layout.module').then((m) => m.LayoutModule)
	},
	{ path: 'dev', component: DevComponent },
	{ path: '**', redirectTo: 'error/404' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
