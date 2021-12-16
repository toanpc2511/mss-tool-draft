import { ToastrService } from 'ngx-toastr';
import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	OnInit,
	TemplateRef,
	ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, filter, pluck, switchMap, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { SubheaderService } from 'src/app/_metronic/partials/layout';
import { EWarehouseOrderStatus } from '../../inventory-management.service';
import { ConfirmDeleteComponent } from '../../../../shared/components/confirm-delete/confirm-delete.component';
import { ofNull } from '../../../../shared/helpers/functions';
import { IConfirmModalData } from '../../../../shared/models/confirm-delete.interface';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { TValidators } from '../../../../shared/validators';
import {
	InventoryManagementService,
	IWareHouseOrderDetail
} from '../../inventory-management.service';
import { of } from 'rxjs';
import { IError } from 'src/app/shared/models/error.model';

@Component({
	selector: 'app-warehouse-order-detail',
	templateUrl: './warehouse-order-detail.component.html',
	styleUrls: ['./warehouse-order-detail.component.scss'],
	providers: [DestroyService]
})
export class WareHouseOrderDetailComponent extends BaseComponent implements OnInit, AfterViewInit {
	eWarehouseStatus = EWarehouseOrderStatus;
	dataDetail: IWareHouseOrderDetail;
	reasonControl = new FormControl(null, TValidators.required);
	@ViewChild('rejectRequest') rejectRequest: TemplateRef<any>;
	@ViewChild('adjustRequest') adjustRequest: TemplateRef<any>;

	activeModal: NgbActiveModal;
	constructor(
		private router: Router,
		private modalService: NgbModal,
		private inventoryManagementService: InventoryManagementService,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService,
		private activeRoute: ActivatedRoute,
		private subheader: SubheaderService,
		private toastr: ToastrService
	) {
		super();
		this.modalService.activeInstances
			.pipe(
				tap((modalRefs) => (this.activeModal = modalRefs[0])),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	setBreadcumb() {
		setTimeout(() => {
			this.subheader.setBreadcrumbs([
				{
					title: 'Quản lý kho',
					linkText: 'Quản lý kho',
					linkPath: 'kho'
				},
				{
					title: 'Yêu cầu đặt kho',
					linkText: 'Yêu cầu đặt kho',
					linkPath: 'kho/don-dat-kho'
				},
				{
					title: 'Yêu cầu đặt kho',
					linkText: 'Chi tiết yêu cầu đặt kho',
					linkPath: null
				}
			]);
		}, 1);
	}

	ngOnInit(): void {
		this.getWareHouseOrderRequestById();
	}

	ngAfterViewInit(): void {
		this.setBreadcumb();
	}

	getWareHouseOrderRequestById() {
		this.activeRoute.params
			.pipe(
				pluck('id'),
				switchMap((id: string) => {
					if (id) {
						return this.inventoryManagementService.viewDetailOrderWarehouse(id);
					}
					this.router.navigate(['']);
					return ofNull();
				}),
				tap((res) => {
					this.dataDetail = res.data;
          console.log(this.dataDetail);
					this.cdr.detectChanges();
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	goToListRequest() {}

	reject() {
		const modalRef = this.modalService.open(this.rejectRequest, {
			backdrop: 'static',
			size: 'xs'
		});

		modalRef.closed
			.pipe(
				filter((res) => res),
				switchMap(() => {
					return this.inventoryManagementService.rejectWarehouseRequest(
						`${this.dataDetail?.id}`,
						this.reasonControl.value
					);
				}),
				tap((res) => {
					if (res.data) {
						this.toastr.success('Đã từ chối đơn đặt kho!');
					}
					this.goBack();
				}),
				catchError((error: IError) => {
					this.checkError(error);
					return of();
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	accept() {
		const modalRef = this.modalService.open(ConfirmDeleteComponent, {
			backdrop: 'static',
			size: 'xs'
		});

		const dataModal: IConfirmModalData = {
			title: 'Xác nhận',
			message: `Bạn có chắc chắn muốn phê duyệt đơn đặt kho ${this.dataDetail?.code} không ?`,
			button: { class: 'btn-primary', title: 'Xác nhận' }
		};

		modalRef.componentInstance.data = dataModal;

		modalRef.result.then((result) => {
			if (result) {
				this.inventoryManagementService
					.approveWarehouseRequest(`${this.dataDetail?.id}`)
					.pipe(
						tap((res) => {
							if (res.data) {
								this.toastr.success('Đã phê duyệt đơn đặt kho!');
							}
							this.goBack();
						}),
						catchError((error: IError) => {
							this.checkError(error);
							return of();
						}),
						takeUntil(this.destroy$)
					)
					.subscribe();
			}
		});
	}

	adjust() {
		const modalRef = this.modalService.open(this.adjustRequest, {
			backdrop: 'static',
			size: 'xs'
		});
		modalRef.closed
			.pipe(
				filter((res) => res),
				switchMap(() => {
					return this.inventoryManagementService.adjustWarehouseRequest(
						`${this.dataDetail?.id}`,
						this.reasonControl.value
					);
				}),
				tap((res) => {
					if (res.data) {
						this.toastr.success('Đã yêu cầu điều chỉnh đơn đặt kho!');
					}
					this.goBack();
				}),
				catchError((error: IError) => {
					this.checkError(error);
					return of();
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	goBack() {
		this.router.navigate(['/kho/don-dat-kho']);
	}

	checkError(error: IError) {
		this.toastr.error(`${error.code} - ${error.message}`);
	}
}
