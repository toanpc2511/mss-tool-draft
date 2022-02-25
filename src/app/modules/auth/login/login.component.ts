import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { AuthService, UserModel } from '../services/auth.service';
import { LoginAuthenticationComponent } from '../../../shared/components/login-authentication/login-authentication.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

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
  profileInfo;

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private route: ActivatedRoute,
		private router: Router,
		private destroy$: DestroyService,
    private modalService: NgbModal,
    private toastr: ToastrService
	)
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
            this.getProfileInfo(res.data);
            this.checkChangePassword(res.data);
					} else {
						this.hasError = true;
					}
				},
				() => {
					this.hasError = true;
				}
			);
	}

  checkChangePassword(data) {
    if (!data.changePassword) {
      this.checkVerifyOtp(data);
    } else {
      this.router.navigate(['/auth/first-login']);
    }
  }

  checkVerifyOtp(data) {
    data.accountAuth.otp ? this.openModal() : this.router.navigate([this.returnUrl]);
  }

  openModal() {
    const modalRef = this.modalService.open(LoginAuthenticationComponent, {
      size: 'xs',
      backdrop: 'static'
    });
    modalRef.componentInstance.data = true;

    modalRef.closed
      .pipe(
        tap((res: boolean) => {
          if (!res) {
            this.toastr.warning('Đã huỷ thao tác');
            this.authService.logout().subscribe();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  getProfileInfo(dataUser: UserModel) {
    this.authService.getProfileInfo()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.profileInfo = res.data;

        dataUser.accountAuth.verifyOtp = false;

        dataUser.accountAuth.profile = {
          name: this.profileInfo.name,
          dateOfBirth: this.profileInfo.dateOfBirth,
          idCard: this.profileInfo.idCard,
          address: this.profileInfo.address,
          avatar: this.profileInfo.avatar,
          phone: this.profileInfo.phone,
          code: this.profileInfo.code,
          email: this.profileInfo.email
        };

        this.authService.setCurrentUserValue(dataUser);
      })
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
