/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

    this.buildFormChangePass();
    this.handleShowPassword();
	}

  buildFormChangePass() {
    this.changPasswordForm = this.fb.group({
      passwordOld: ['', Validators.required],
      passwordNew: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      showPassword: [false]
    })
    this.isShowPasswordStatus = this.changPasswordForm?.get('showPassword').value;
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
    this.changPasswordForm.markAllAsTouched();
    if (this.changPasswordForm.invalid) {
      return;
    }
    const passwordNewLenght = this.changPasswordForm.get('passwordNew').value.length;
    const repeatPasswordLenght = this.changPasswordForm.get('repeatPassword').value.length;

    if (passwordNewLenght < 8) {
      this.toastr.error('Mật khẩu mới tối thiểu 8 ký tự');
      this.changPasswordForm.get('passwordNew').setErrors({ regPasswordNew: true });
      return;
    }
    if (passwordNewLenght !== repeatPasswordLenght) {
      this.changPasswordForm.get('repeatPassword').setErrors({ incorrectPassword: true });
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
