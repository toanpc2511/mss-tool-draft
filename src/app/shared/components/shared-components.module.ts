import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidateComponent } from './validate/validate.component';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';
import { NgSelectModule } from './ng-select/public-api';
import { TabComponent } from './tab/tab.component';
import { ListLayoutComponent } from './list-layout/list-layout.component';
import { TwoFactorComponent } from './two-factor/two-factor.component';
import { LoginAuthenticationComponent } from './login-authentication/login-authentication.component';
import { DirectivesModule } from '../directives/directives.module';

@NgModule({
	declarations: [ValidateComponent, ConfirmDeleteComponent, TabComponent, ListLayoutComponent, TwoFactorComponent, LoginAuthenticationComponent],
	imports: [CommonModule, NgSelectModule, RouterModule, ReactiveFormsModule, DirectivesModule],
	exports: [
		ValidateComponent,
		NgSelectModule,
		ConfirmDeleteComponent,
		TabComponent,
		ListLayoutComponent,
		TwoFactorComponent
	]
})
export class SharedComponentsModule {}
