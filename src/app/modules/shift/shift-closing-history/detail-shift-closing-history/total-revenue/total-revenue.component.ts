import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
	ModalConfirmLockShiftComponent
} from './modal-confirm-lock-shift/modal-confirm-lock-shift.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DestroyService } from '../../../../../shared/services/destroy.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, tap } from 'rxjs/operators';
import { ITotalMoneyRevenue, ShiftService } from '../../../shift.service';

@Component({
	selector: 'app-total-revenue',
	templateUrl: './total-revenue.component.html',
	styleUrls: ['./total-revenue.component.scss'],
	providers: [DestroyService]
})
export class TotalRevenueComponent implements OnInit {
	proceeds: FormControl;
	hideButton = true;
	stationId: number;
	lockShiftId: number;
	dataRep: ITotalMoneyRevenue;
  statusLockShift: string;

	constructor(
		private modalService: NgbModal,
		private destroy$: DestroyService,
		private activeRoute: ActivatedRoute,
		private cdr: ChangeDetectorRef,
		private shiftService: ShiftService
	) {
		this.proceeds = new FormControl();
	}

	ngOnInit(): void {
		this.proceeds.setValue(false);

    this.activeRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((queryParams) => {
        this.lockShiftId = queryParams.lockShiftId;
        this.stationId = queryParams.stationId;
        this.statusLockShift = queryParams.status;
      })

		this.getTotalMoneyRevenue();
	}

	getTotalMoneyRevenue() {
		this.shiftService
			.getTotalMoneyRevenue(this.lockShiftId)
			.pipe(
				tap((res) => {
					this.dataRep = res.data;
					this.cdr.detectChanges();
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	changeCheckProceed() {
		this.hideButton = !this.hideButton;
	}

	createModal($event: Event): void {
		if ($event) {
			$event.stopPropagation();
		}
		const modalRef = this.modalService.open(ModalConfirmLockShiftComponent, {
			backdrop: 'static',
			size: 'lg'
		});

		modalRef.componentInstance.data = {
			title: 'Xác nhận',
			stationId: this.stationId,
			lockShiftOldId: this.lockShiftId,
			listEmployee: this.dataRep?.employeeMoneyRevenues
		};
	}

	printReport() {
		console.log(this.proceeds.value);
	}
}
