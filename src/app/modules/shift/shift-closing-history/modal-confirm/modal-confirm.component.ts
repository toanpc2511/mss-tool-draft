import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ILockShift, IOrderOfShift, ShiftService } from '../../shift.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IError } from '../../../../shared/models/error.model';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LIST_STATUS_ORDER } from '../../../../shared/data-enum/list-status';

@Component({
	selector: 'app-modal-confirm',
	templateUrl: './modal-confirm.component.html',
	styleUrls: ['./modal-confirm.component.scss'],
	providers: [DestroyService, FormBuilder]
})
export class ModalConfirmComponent implements OnInit {
	@ViewChild('btnSave', { static: true }) btnSave: ElementRef;
	@Input() data: IDataTransfer;
	dataSource;
	resonForm: FormGroup;
	listStatus = LIST_STATUS_ORDER;
	isDisable = false;

	constructor(
		public modal: NgbActiveModal,
		private destroy$: DestroyService,
		private router: Router,
		private fb: FormBuilder,
		private shiftService: ShiftService,
		private toastr: ToastrService
	) {}

	ngOnInit(): void {
		this.dataSource = this.data.order;

		this.dataSource.map((x) => {
			if (x.status === 'WAIT_FOR_PAY') {
				return (this.isDisable = true);
			}
		});
		this.buildform();
		this.onSubmit();
	}

	buildform() {
		this.resonForm = this.fb.group({
			reason: ['', Validators.required]
		});
	}

	onClose() {
		this.modal.close();
	}

	onSubmit(): void {
		fromEvent(this.btnSave.nativeElement, 'click')
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				this.resonForm.markAllAsTouched();
				if (this.resonForm.invalid) {
					return;
				}

				const dataReq = {
					content: this.resonForm.get('reason').value,
					id: this.data.lockShiftInfo.id,
					shiftId: this.data.lockShiftInfo.shiftId
				};

				this.shiftService.rejectOrderOfShift(dataReq).subscribe(
					() => {
						this.modal.close();
						const req = {
							lockShiftId: this.data.lockShiftInfo.id
						};
						this.shiftService.createFuelProductRevenue(req).subscribe(
							(res) => {
								if (res.data) {
									this.router.navigate(
										[`/ca-lam-viec/lich-su-chot-ca/chi-tiet/${this.data.lockShiftInfo.id}`],
										{
											queryParams: {
												status: this.data.lockShiftInfo.status,
												stationId: this.data.lockShiftInfo.stationId
											}
										}
									);
								}
							},
							(err: IError) => this.checkError(err)
						);
					},
					(error: IError) => this.checkError(error)
				);
			});
	}

	checkError(error: IError) {
		this.toastr.error(error.code);
	}
}

export interface IDataTransfer {
	title: string;
	order: IOrderOfShift;
	lockShiftInfo: ILockShift;
}
