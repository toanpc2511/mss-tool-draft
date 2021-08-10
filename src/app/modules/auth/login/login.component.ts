import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { AuthService } from '../services/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	defaultAuth = {
		username: '',
		password: ''
	};
	loginForm: FormGroup;
	hasError = false;
	returnUrl: string;
	isLoading$: Observable<boolean>;
	isShowPasswordStatus = false;

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private route: ActivatedRoute,
		private router: Router,
		private destroy$: DestroyService
	) // private toastr: ToastrService
	{
		this.isLoading$ = this.authService.isLoading$;
		// redirect to home if already logged in
		if (this.authService.getCurrentUserValue()) {
			this.router.navigate(['/']);
		}
	}

	ngOnInit(): void {
		this.initForm();
		this.returnUrl =
			this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
	}

	initForm() {
		this.loginForm = this.fb.group({
			username: [
				this.defaultAuth.username,
				Validators.compose([Validators.required])
			],
			password: [
				this.defaultAuth.password,
				Validators.compose([Validators.required])
			]
		});
	}

	submit() {
		this.loginForm.markAllAsTouched();
		if (
			!this.loginForm.controls.username.value ||
			!this.loginForm.controls.password.value
		) {
			return;
		}
		this.hasError = false;
		this.authService
			.login(
				this.loginForm.controls.username.value,
				this.loginForm.controls.password.value
			)
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				(res) => {
					if (res.data) {
						this.authService.setCurrentUserValue(res.data);
						if (!res.data.changePassword) {
							this.router.navigate([this.returnUrl]);
						} else {
							this.router.navigate(['/auth/first-login']);
						}
					} else {
						this.hasError = true;
					}
				},
				() => {
					this.hasError = true;
				}
			);
	}

	changeShowPasswordStatus() {
		this.isShowPasswordStatus = !this.isShowPasswordStatus;
	}

	onInputUsername($event: Event) {
		const element = $event.target as HTMLInputElement;
		element.value = element.value.replace(/ /g, '');
	}

	onInputPassword($event: Event) {
		const element = $event.target as HTMLInputElement;
		element.value = element.value.replace(/ /g, '');
	}
}
