import { AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';
import { AuthService, UserModel } from '../../../modules/auth/services/auth.service';
import firebase from 'firebase';
import { catchError, finalize, takeUntil, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { IError } from '../../models/error.model';
import { ToastrService } from 'ngx-toastr';
import { DestroyService } from '../../services/destroy.service';
import { FormControl } from '@angular/forms';
import { TValidators } from '../../validators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-authentication',
  templateUrl: './login-authentication.component.html',
  styleUrls: ['./login-authentication.component.scss'],
  providers: [DestroyService]
})
export class LoginAuthenticationComponent implements AfterViewInit {
  reCapchaError = false;
  reCapchaValid = false;
  reCapchaVerifier: firebase.auth.RecaptchaVerifier;
  reCapchaVerifierInvisible: firebase.auth.RecaptchaVerifier;
  isResendOTP = false;
  confirmResult: firebase.auth.ConfirmationResult;
  currentPhoneNumber: string;
  user$: Observable<UserModel>;
  verificationCodeControl = new FormControl(null, [TValidators.required]);
  step = 1;

  constructor(
    public modal: NgbActiveModal,
    private toastr: ToastrService,
    private authService: AuthService,
    private ngxSpinnerService: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private destroy$: DestroyService
  ) {
    this.user$ = this.authService.currentUser$;
    this.user$.subscribe((x) => {
      this.currentPhoneNumber = x?.accountAuth?.profile?.phone;
    })
  }
  ngAfterViewInit(): void {
    this.reCapchaVerifier = new firebase.auth.RecaptchaVerifier('otp-captcha', {
      size: 'normal',
      callback: () => {
        this.reCapchaValid = true;
        this.reCapchaError = false;
        this.cdr.detectChanges();
      },
      'expired-callback': () => {
        this.reCapchaValid = false;
        this.reCapchaError = true;
        this.cdr.detectChanges();
      }
    });

    this.reCapchaVerifierInvisible = new firebase.auth.RecaptchaVerifier('resend-otp-btn', {
      size: 'invisible',
      callback: () => {
        this.resendOTP();
      }
    });

    this.reCapchaVerifier.render();
  }

  sendOTP() {
    if (!this.reCapchaValid) {
      this.reCapchaError = true;
      return;
    }
    this.createOTPRequest(this.reCapchaVerifier);
  }

  resendOTP() {
    if (!this.isResendOTP) {
      this.isResendOTP = true;
    }
    this.createOTPRequest(this.reCapchaVerifierInvisible);
  }

  createOTPRequest(reCapchaVerifier: firebase.auth.RecaptchaVerifier) {
    this.ngxSpinnerService.show();
    this.authService
      //Firebase cần mã quốc gia để gửi mã tới các nước khác nhau
      .sendOTP(`+84${this.currentPhoneNumber}`, reCapchaVerifier)
      .pipe(
        tap((confirmResult) => {
          this.confirmResult = confirmResult;
          if (this.step !== 2) {
            this.step = 2;
            this.reCapchaVerifierInvisible.render();
          }
          this.toastr.success(`Đã gửi mã OTP tới số điện thoại ${this.currentPhoneNumber}`);
        }),
        catchError((error) => {
          this.checkError(error);
          return throwError(error);
        }),
        finalize(() => {
          this.ngxSpinnerService.hide();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  verifyOTP() {
    this.verificationCodeControl.markAllAsTouched();
    if (this.verificationCodeControl.invalid) {
      return;
    }
    this.ngxSpinnerService.show();
    this.authService
      .verifyOTP(this.confirmResult, this.verificationCodeControl.value)
      .pipe(
        tap( (res) => {
          if (res.user) {
            res.user.getIdToken()
              .then((valueToken) => {
                const dataReq = {
                  phone: `+84${this.currentPhoneNumber.replace('0', '')}`,
                  idToken: valueToken
                }

                this.authService.authenticationOtps(dataReq)
                  .subscribe((res) => {
                    if (res.data) {
                      this.user$.subscribe((x) => {
                        x.accountAuth.verifyOtp = true;
                        this.authService.setCurrentUserValue(x);
                      })

                      this.router.navigate(['/auth/first-login']);
                      this.toastr.success('Xác thực thành công!')
                      this.complete();
                    }
                  }, (error => this.checkError(error)))
              })
              .catch((error) => {this.checkError(error)})
          }
        }),
        catchError((error) => {
          this.checkError(error);
          return throwError(error);
        }),
        finalize(() => {
          this.ngxSpinnerService.hide();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  complete() {
    this.modal.close(true);
  }

  checkError(error: IError) {
    switch (error.code) {
      case 'auth/too-many-requests':
        this.toastr.error('Quá nhiều yêu cầu đã được gửi! Vui lòng thử lại sau!');
        break;
      case 'auth/invalid-verification-code':
        this.toastr.error('Mã xác thực không hợp lệ! Vui lòng kiểm tra lại');
        break;
      case 'auth/invalid-phone-number':
        this.toastr.error('Số điện thoại không hợp lệ! Vui lòng kiểm tra lại');
        break;
      case 'auth/network-request-failed':
        this.toastr.error('Yêu cầu không hợp lệ! Vui lòng kiểm tra lại');
        break;
      case 'auth/code-expired':
        this.toastr.error('Mã OTP đã hết hạn. Vui lòng gửi lại mã xác minh để thử lại.');
        break;
      case 'SUN-OIL-4871':
        this.toastr.error('Xác thực không thành công');
        break;
      default:
        this.toastr.error(`${error.code} - ${error.message}`);
        break;
    }
  }
}
