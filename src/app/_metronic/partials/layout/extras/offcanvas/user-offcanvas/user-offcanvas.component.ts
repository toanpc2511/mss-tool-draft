/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { AuthService, UserModel } from 'src/app/modules/auth/services/auth.service';
import { TwoFactorComponent } from 'src/app/shared/components/two-factor/two-factor.component';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { LayoutService } from '../../../../../core';
@Component({
	selector: 'app-user-offcanvas',
	templateUrl: './user-offcanvas.component.html',
	styleUrls: ['./user-offcanvas.component.scss'],
	providers: [DestroyService]
})
export class UserOffcanvasComponent implements OnInit {
	extrasUserOffcanvasDirection = 'offcanvas-right';
	user$: Observable<UserModel>;
	enableTwoAuthStepControl = new FormControl(false);

	activeModal: NgbActiveModal;
	constructor(
		private layout: LayoutService,
		private auth: AuthService,
		private modalService: NgbModal,
		private toastr: ToastrService,
		private destroy$: DestroyService
	) {}

	ngOnInit(): void {
		this.extrasUserOffcanvasDirection = `offcanvas-${this.layout.getProp(
			'extras.user.offcanvas.direction'
		)}`;
		this.user$ = this.auth.currentUser$;
		this.enableTwoAuthStepControl.valueChanges
			.pipe(
				tap((checked) => {
					if (checked) {
						this.openModal();
					}
				}, takeUntil(this.destroy$))
			)
			.subscribe();
	}

	openModal() {
		const modalRef = this.modalService.open(TwoFactorComponent, {
			size: 'xs',
			backdrop: 'static'
		});

    modalRef.componentInstance.data =  this.enableTwoAuthStepControl.value;

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
}
