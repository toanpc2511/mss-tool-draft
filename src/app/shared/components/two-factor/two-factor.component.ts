import { AfterViewInit, Component, ChangeDetectorRef, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import firebase from 'firebase/app';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { catchError, finalize, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { TValidators } from 'src/app/shared/validators';

@Component({
	selector: 'app-two-factor',
	templateUrl: './two-factor.component.html',
	styleUrls: ['./two-factor.component.scss'],
	providers: [DestroyService]
})
export class TwoFactorComponent implements AfterViewInit {
  @Input() data: IDataTransfer;
	reCapchaError = false;
	reCapchaValid = false;
	reCapchaVerifier: firebase.auth.RecaptchaVerifier;
	reCapchaVerifierInvisible: firebase.auth.RecaptchaVerifier;
	isResendOTP = false;
	confirmResult: firebase.auth.ConfirmationResult;
	currentPhoneNumber: string;
	verificationCodeControl = new FormControl(null, [TValidators.required]);
	step = 1;
  disableBtn: boolean;
  timeOut;

	constructor(
		public modal: NgbActiveModal,
		private toastr: ToastrService,
		private authService: AuthService,
		private ngxSpinnerService: NgxSpinnerService,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService
	) {
		this.currentPhoneNumber = this.authService.getCurrentUserValue()?.accountAuth?.profile?.phone;
    this.disableBtn = true;
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
			callback: (response) => {
				this.resendOTP();
			}
		});

		this.reCapchaVerifier.render();
	}

  test() {
    let counter = 10;
    const interval = setInterval(() => {
      counter--;

      if (counter < 0 ) {
        clearInterval(interval);
        this.disableBtn = true;
        document.getElementById('countdown').innerText = '';
        console.log('ngu');
      } else {
        this.disableBtn = false;
        document.getElementById('countdown').innerText = `Gửi lại mã OTP sau ${counter} giây`;
      }
    }, 1000);
    this.cdr.detectChanges();
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
          // this.test();
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
				const valueToggle = this.data;
                const dataReq = {
                  phone: `+84${this.currentPhoneNumber.replace('0', '')}`,
                  authentication: valueToggle,
                  idToken: valueToken
                }

                this.authService.togglesOtps(dataReq)
                  .subscribe((res) => {
                    if (res.data) {
                      this.step = 3;
                      this.authService.currentUser$.subscribe((x) => {
						            x.accountAuth.otp = valueToggle;
                        x.accountAuth.verifyOtp = valueToggle;
                        this.authService.setCurrentUserValue(x);
                      })
                      this.toastr.success('Xác thực thành công!')
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
		console.log(error);
		switch (error.code) {
			case 'auth/too-many-requests':
				this.toastr.error('Đã quá số lần lấy mã OTP. Vui lòng thử lại sau 4 giờ!');
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

export interface IDataTransfer {
  data: string;
}