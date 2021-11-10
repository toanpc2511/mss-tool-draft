import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
	ModalConfirmLockShiftComponent
} from './modal-confirm-lock-shift/modal-confirm-lock-shift.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DestroyService } from '../../../../../shared/services/destroy.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, tap } from 'rxjs/operators';
import { ITotalMoneyRevenue, ShiftService } from '../../../shift.service';
import { FileService } from '../../../../../shared/services/file.service';

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
  shiftId: number;
	dataRep: ITotalMoneyRevenue;
  statusLockShift: string;

	constructor(
		private modalService: NgbModal,
		private destroy$: DestroyService,
		private activeRoute: ActivatedRoute,
		private cdr: ChangeDetectorRef,
		private shiftService: ShiftService,
		private router: Router,
    private fileService: FileService
	) {
		this.proceeds = new FormControl();
	}

	ngOnInit(): void {
    this.activeRoute.params.subscribe((res) => {
      this.lockShiftId = res.lockShiftId;
    });

    this.activeRoute.queryParams.subscribe((x) => {
      this.stationId = x.stationId;
      this.shiftId = x.shiftId;
			this.statusLockShift = x.status;

			if (this.statusLockShift === "CLOSE") {
				this.proceeds.setValue(true);
				this.proceeds.disable({onlySelf: false, emitEvent: false});
			} else {
				this.proceeds.setValue(false);
			}
    });

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
      shiftId: this.shiftId,
			lockShiftOldId: this.lockShiftId,
			listEmployee: this.dataRep?.employeeMoneyRevenues
		};
	}

  exportFileExcel() {
    this.shiftService
      .exportFileExcel(this.lockShiftId)
      .pipe(
        tap((res) => {
          if (res) {
            console.log(res.data);
            this.fileService.downloadFromUrl(res.data);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

	backHome() {
		this.router.navigate([`/ca-lam-viec/lich-su-chot-ca`]);
	}
}
