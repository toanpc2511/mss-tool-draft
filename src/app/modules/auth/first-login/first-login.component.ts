import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-first-login',
  templateUrl: './first-login.component.html',
  styleUrls: ['./first-login.component.scss']
})
export class FirstLoginComponent implements OnInit {
  firstLoginForm: FormGroup;
  hasError: boolean = false;
  isLoading$: Observable<boolean>;
  isShowPasswordNew = false;
  isShowPasswordConfirm = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private destroy$: DestroyService,
    private toastr: ToastrService
  ) {
    this.isLoading$ = this.authService.isLoading$;
    const currentUser = this.authService.getCurrentUserValue();
    if (!currentUser?.accountAuth?.accountId) {
      this.authService.logout();
    }
    if (!currentUser?.changePassword) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.firstLoginForm = this.fb.group({
      passwordNew: [null, Validators.compose([Validators.required])],
      passwordConfirm: [null, Validators.compose([Validators.required])]
    });
  }

  submit() {
    this.firstLoginForm.markAllAsTouched();
    if (this.firstLoginForm.invalid) {
      return;
    }
    this.hasError = false;
    this.authService
      .changePasswordFirstLogin(
        this.authService.getCurrentUserValue().accountAuth.accountId,
        this.firstLoginForm.controls.passwordNew.value
      )
      .subscribe((res) => {
        if (!res.data?.changePassword) {
          this.toastr.success('Đổi mật khẩu thành công');
          this.authService.setCurrentUserValue(res.data);
          this.router.navigate(['/']);
        } else {
          this.toastr.error('Đổi mật khẩu thất bại');
          this.hasError = true;
        }
      });
  }

  changeShowPasswordNewStatus() {
    this.isShowPasswordNew = !this.isShowPasswordNew;
  }

  changeShowPasswordConfirmStatus() {
    this.isShowPasswordConfirm = !this.isShowPasswordConfirm;
  }

  onInputPasswordNew($event: Event) {
    const element = $event.target as HTMLInputElement;
    this.firstLoginForm.controls.passwordNew.patchValue(element.value.replace(/ /g, ''));
    if (
      element.value !== this.firstLoginForm.controls.passwordConfirm.value &&
      !this.firstLoginForm.controls.passwordConfirm.hasError('required')
    ) {
      this.firstLoginForm.controls.passwordConfirm.setErrors({ passwordConfirmNotMatch: true });
    } else {
      this.firstLoginForm.controls.passwordConfirm.setErrors({ passwordConfirmNotMatch: null });
      this.firstLoginForm.controls.passwordConfirm.updateValueAndValidity();
    }
  }

  onInputPasswordConfirm($event: Event) {
    const element = $event.target as HTMLInputElement;
    this.firstLoginForm.controls.passwordConfirm.patchValue(element.value.replace(/ /g, ''));
    if (
      element.value !== this.firstLoginForm.controls.passwordNew.value &&
      !this.firstLoginForm.controls.passwordConfirm.hasError('required')
    ) {
      this.firstLoginForm.controls.passwordConfirm.setErrors({ passwordConfirmNotMatch: true });
    } else {
      this.firstLoginForm.controls.passwordConfirm.setErrors({ passwordConfirmNotMatch: null });
      this.firstLoginForm.controls.passwordConfirm.updateValueAndValidity();
    }
  }
}
