import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
    private destroy$: DestroyService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.isLoading$ = this.authService.isLoading$;
    if (this.authService.getCurrentUserValue()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: [this.defaultAuth.username, Validators.compose([Validators.required])],
      password: [this.defaultAuth.password, Validators.compose([Validators.required])]
    });
  }

  submit() {
    this.loginForm.markAllAsTouched();
    if (!this.loginForm.controls.username.value || !this.loginForm.controls.password.value) {
      return;
    }
    this.hasError = false;
    this.authService
      .login(this.loginForm.controls.username.value, this.loginForm.controls.password.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          if (res.data) {
            this.authService.setCurrentUserValue(res.data);
            this.router.navigate([this.returnUrl]);
          } else {
            this.hasError = true;
            setTimeout(() => {
              this.hasError = false;
              this.cdr.detectChanges();
            }, 2500);
          }
        },
        (error) => {
          this.hasError = true;
          setTimeout(() => {
            this.hasError = false;
            this.cdr.detectChanges();
          }, 2500);
        }
      );
  }

  changeShowPasswordStatus() {
    this.isShowPasswordStatus = !this.isShowPasswordStatus;
  }

  onInputUsername($event: Event) {
    const element = $event.target as HTMLInputElement;
    this.loginForm.controls.username.patchValue(element.value.replace(/ /g, ''));
  }

  onInputPassword($event: Event) {
    const element = $event.target as HTMLInputElement;
    this.loginForm.controls.password.patchValue(element.value.replace(/ /g, ''));
  }

  gotoForgotPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }
}
