/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { AuthService, UserModel } from 'src/app/modules/auth/services/auth.service';
import { TwoFactorComponent } from 'src/app/shared/components/two-factor/two-factor.component';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { LayoutService } from '../../../../../core';
import { IError } from '../../../../../../shared/models/error.model';

@Component({
	selector: 'app-user-offcanvas',
	templateUrl: './user-offcanvas.component.html',
	styleUrls: ['./user-offcanvas.component.scss'],
	providers: [DestroyService, NgbActiveModal, FormBuilder]
})
export class UserOffcanvasComponent implements OnInit {
	extrasUserOffcanvasDirection = 'offcanvas-right';
	user$: Observable<UserModel>;
	enableTwoAuthStepControl = new FormControl();
  changPasswordForm: FormGroup;
  submitted: boolean;
  isShowPasswordStatus: boolean;
  @ViewChild('changePasswork') changePassworkModal: TemplateRef<any>;

	activeModal: NgbActiveModal;
	constructor(
		private layout: LayoutService,
		private auth: AuthService,
		private modalService: NgbModal,
		private toastr: ToastrService,
		private destroy$: DestroyService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
	) {
    this.user$ = this.auth.currentUser$;
    this.user$.subscribe((x) => {
      this.enableTwoAuthStepControl.patchValue(x?.accountAuth.otp);
    });

    this.modalService.activeInstances
      .pipe(
        tap((modalRefs) => (this.activeModal = modalRefs[0])),
        takeUntil(this.destroy$)
      )
      .subscribe();
    this.buildFormChangePass();
  }

	ngOnInit(): void {
		this.extrasUserOffcanvasDirection = `offcanvas-${this.layout.getProp(
			'extras.user.offcanvas.direction'
		)}`;
		// this.user$ = this.auth.currentUser$;
		// this.enableTwoAuthStepControl.valueChanges
		// 	.pipe(
		// 		tap((checked) => {
		// 			if (checked) {
		// 				this.openModal();
		// 			}
		// 		}, takeUntil(this.destroy$))
		// 	)
		// 	.subscribe();

    this.handleShowPassword();
	}

  buildFormChangePass() {
    this.changPasswordForm = this.fb.group({
      passwordOld: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{8,32}')]],
      passwordNew: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{8,32}')]],
      repeatPassword: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{8,32}')]],
      showPassword: [false]
    }, { validators: this.mustMatch('passwordNew', 'repeatPassword') });
    this.isShowPasswordStatus = this.changPasswordForm?.get('showPassword').value;
  }

  mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const control = group.get(controlName);
      const matchingControl = group.get(matchingControlName);

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({mustMatch: true});
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  handleShowPassword() {
    this.changPasswordForm?.get('showPassword').valueChanges
      .subscribe((value) => {
        this.isShowPasswordStatus = value;
      })
  }

	openModal() {
		const modalRef = this.modalService.open(TwoFactorComponent, {
			size: 'xs',
			backdrop: 'static'
		});

    modalRef.componentInstance.data =  !this.enableTwoAuthStepControl.value;

		modalRef.closed
			.pipe(
				tap((res: boolean) => {
					if (!res) {
						this.enableTwoAuthStepControl.patchValue(!this.enableTwoAuthStepControl.value);
						this.toastr.warning('Đã huỷ thao tác');
					}
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	logout() {
		this.auth.logout().subscribe();
	}

  changeShowPasswordStatus() {
    this.isShowPasswordStatus = !this.isShowPasswordStatus;
  }

  onInputPassword($event: Event) {
    const element = $event.target as HTMLInputElement;
    element.value = element.value.replace(/ /g, '');
  }

  showChangePassworkModal($event) {
    $event.stopPropagation();
    this.changPasswordForm.reset();
    this.modalService.open(this.changePassworkModal, {
      size: 'xs',
      backdrop: 'static'
    });
  }

  confirmChangePassword() {
    this.submitted = true;
    console.log(this.changPasswordForm.controls.repeatPassword.hasError('mustMatch'));
    this.changPasswordForm.markAllAsTouched();
    if (this.changPasswordForm.invalid) {
      return;
    }

    this.auth.changePasswork(this.changPasswordForm.value)
      .subscribe((res) => {
        if (res) {
          this.toastr.success('Đổi mật khẩu thành công, vui lòng đăng nhập lại !');
          this.activeModal.close(false);
          this.auth.logout().subscribe();
        }
      },(err: IError) => this.checkError(err))
  }

  checkError(error: IError) {
    if (error.code === 'SUN-OIL-4952') {
      this.toastr.error('Mật khẩu xác nhận không khớp!');
      this.changPasswordForm.get('repeatPassword').setErrors({ incorrectPassword: true });
    }
    if (error.code === 'SUN-OIL-4002') {
      this.toastr.error('Mật khẩu cũ không đúng');
      this.changPasswordForm.get('passwordOld').setErrors({ wrongOldPassword: true });
    }
    if (error.code === 'SUN-OIL-4953') {
      this.toastr.error('Mật khẩu không hợp lệ !');
    }
  }
}
