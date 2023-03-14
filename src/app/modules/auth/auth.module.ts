import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';
import { TranslationModule } from '../i18n/translation.module';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
	declarations: [LoginComponent, AuthComponent, ForgotPasswordComponent],
	imports: [
		CommonModule,
		TranslationModule,
		AuthRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		SharedModule
	],
	providers: [DestroyService]
})
export class AuthModule {}
