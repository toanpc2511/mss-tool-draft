import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { IConfirmModalData } from 'src/app/shared/models/confirm-delete.interface';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { IPaginatorState, PaginatorState } from 'src/app/_metronic/shared/crud-table';
import { AuthService } from '../../auth/services/auth.service';
import { ISortData } from '../../contract/contract.service';
import { PartnerModalComponent } from '../partner-modal/partner-modal.component';
import { EPartnerStatus, IVehicle, IPartner, PartnerService } from '../partner.service';

@Component({
	selector: 'app-list-partner',
	templateUrl: './list-partner.component.html',
	styleUrls: ['./list-partner.component.scss'],
	providers: [DestroyService]
})
export class ListPartnerComponent implements OnInit {
	driverId = '';
	searchFormControl: FormControl = new FormControl();
	sortData: ISortData;
	eStatus = EPartnerStatus;
	dataSource: Array<IPartner> = [];
	paginatorState = new PaginatorState();
	constructor(
		private authService: AuthService,
		private partnerService: PartnerService,
		private cdr: ChangeDetectorRef,
		private router: Router,
		private modalService: NgbModal,
		private destroy$: DestroyService
	) {
		this.driverId = authService.getCurrentUserValue().driverAuth.driverId;
		this.init();
	}

	ngOnInit(): void {
		// Filter
		this.searchFormControl.valueChanges
			.pipe(
				debounceTime(400),
				switchMap(() => {
					return this.partnerService.getPartners(
						this.paginatorState.page,
						this.paginatorState.pageSize,
						this.searchFormControl.value,
						this.sortData
					);
				}),
				tap((res) => {
					this.checkRes(res);
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	init() {
		this.paginatorState.page = 1;
		this.paginatorState.pageSize = 15;
		this.paginatorState.pageSizes = [5, 10, 15, 20];
		this.paginatorState.total = 0;
		this.sortData = null;
		this.getPartners();
	}

	getPartners() {
		this.partnerService
			.getPartners(
				this.paginatorState.page,
				this.paginatorState.pageSize,
				this.searchFormControl.value,
				this.sortData
			)
			.subscribe((res) => {
				this.checkRes(res);
				this.cdr.detectChanges();
			});
	}

	sort(column: string) {
		if (this.sortData && this.sortData.fieldSort === column) {
			if (this.sortData.directionSort === 'ASC') {
				this.sortData = { fieldSort: column, directionSort: 'DESC' };
			} else {
				this.sortData = null;
			}
		} else {
			this.sortData = { fieldSort: column, directionSort: 'ASC' };
		}
		this.getPartners();
	}

	pagingChange($event: IPaginatorState) {
		this.paginatorState = $event as PaginatorState;
		this.getPartners();
	}

	checkRes(res) {
		this.dataSource = res.data;
		this.paginatorState.recalculatePaginator(res.meta.total);
		this.cdr.detectChanges();
	}

	openPartnerModal(ticketId?: number, detail?: boolean) {
		const modalRef = this.modalService.open(PartnerModalComponent, {
			backdrop: 'static',
			size: 'xl'
		});
		// Sử dụng api get user by id để lấy data fill vào form sửa
		if (ticketId) {
			modalRef.componentInstance.partnerId = ticketId;
      modalRef.componentInstance.viewDetail = detail;
		}
		modalRef.result.then((result) => {
			if (result) {
				this.init();
				this.getPartners();
			}
		});
	}

	openDeletePartnerModal($event: Event, partner: IPartner) {
		$event.stopPropagation();
		const modalRef = this.modalService.open(ConfirmDeleteComponent, {
			backdrop: 'static'
		});
		const data: IConfirmModalData = {
			title: 'Xác nhận',
			message: `Bạn có chắc chắn muốn xoá tài xế ${partner.name}?`,
			button: { class: 'btn-primary', title: 'Xác nhận' }
		};
		modalRef.componentInstance.data = data;

		modalRef.result.then((result) => {
			if (result) {
				this.partnerService.deletePartner(partner.driverId).subscribe((res) => {
					if (res.data) {
						this.getPartners();
					}
				});
			}
		});
	}

	checkError(error: IError) {
		return error;
	}
}
