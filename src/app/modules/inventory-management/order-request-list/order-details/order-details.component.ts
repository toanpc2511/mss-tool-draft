import { catchError, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from '../../../../shared/components/base/base.component';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IInfoOrderRequest, InventoryManagementService } from '../../inventory-management.service';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { ProductService } from '../../../product/product.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LIST_STATUS_ORDER_REQUEST } from '../../../../shared/data-enum/list-status';
import { TValidators } from 'src/app/shared/validators';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { IConfirmModalData } from 'src/app/shared/models/confirm-delete.interface';
import { of } from 'rxjs';
import { IError } from 'src/app/shared/models/error.model';
import { SubheaderService } from '../../../../_metronic/partials/layout';

@Component({
	selector: 'app-order-details',
	templateUrl: './order-details.component.html',
	styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent extends BaseComponent implements OnInit, AfterViewInit {
	reasonControl = new FormControl(null, [TValidators.required]);
	@ViewChild('rejectRequest') rejectRequest: TemplateRef<any>;

	activeModal: NgbActiveModal;
	orderRequestId: number;
	listStatus = LIST_STATUS_ORDER_REQUEST;
	dataSource: IInfoOrderRequest;

	constructor(
		private inventoryManagementService: InventoryManagementService,
		private destroy$: DestroyService,
		private cdr: ChangeDetectorRef,
		private productService: ProductService,
		private modalService: NgbModal,
		private toastr: ToastrService,
		private fb: FormBuilder,
		private activeRoute: ActivatedRoute,
    private subheader: SubheaderService,
		private router: Router
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
          title: 'Yêu cầu đặt hàng',
          linkText: 'Yêu cầu đặt hàng',
          linkPath: 'kho/yeu-cau-dat-hang'
        },
        {
          title: 'Chi tiết yêu cầu đạt hàng',
          linkText: 'Chi tiết yêu cầu đặt hàng',
          linkPath: null
        }
      ]);
    }, 1);
  }

	ngOnInit(): void {
		this.activeRoute.params.subscribe((res) => {
			this.orderRequestId = res.id;
		});

		this.getDetailOrderRequest();
	}

  ngAfterViewInit(): void {
    this.setBreadcumb();
  }

	getDetailOrderRequest() {
		this.inventoryManagementService.viewDetailOrderRequest(this.orderRequestId).subscribe((res) => {
			this.dataSource = res.data;
			this.cdr.detectChanges();
		});
	}

	onClose() {
		this.router.navigate([`/kho/yeu-cau-dat-hang`]);
	}

	openRejectOrderRequestModal() {
		this.reasonControl.reset();

		const modalRef = this.modalService.open(this.rejectRequest, {
			size: 'xs',
			backdrop: 'static'
		});

		modalRef.closed
			.pipe(
				filter((res) => res),
				switchMap(() => {
					return this.inventoryManagementService.approveOrRejectOrderRequest(this.orderRequestId, {
						requestConfirm: false,
						reason: this.reasonControl.value
					});
				}),
				tap((res) => {
					if (res.data) {
						this.toastr.success('Đã từ chối yêu cầu đặt hàng!');
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

  confirmChange(code: string) {
    const modalRef = this.modalService.open(ConfirmDeleteComponent, {
      backdrop: 'static'
    });

    const data: IConfirmModalData = {
      title: 'Xác nhận',
      message: `Bạn có chắc chắn muốn duyệt đơn đặt hàng ${code} không?`,
      button: { class: 'btn-primary', title: 'Xác nhận' }
    };
    modalRef.componentInstance.data = data;

    modalRef.closed
      .pipe(
        filter((res) => res),
        switchMap(() => {
          return this.inventoryManagementService.confirmChange(this.orderRequestId);
        }),
        tap((res) => {
          if (res.data) {
            this.toastr.success('Đã phê duyệt yêu cầu thay đổi!');
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

	openApproveRequestModal(code: string) {
		const modalRef = this.modalService.open(ConfirmDeleteComponent, {
			backdrop: 'static'
		});

		const data: IConfirmModalData = {
			title: 'Xác nhận',
			message: `Bạn có chắc chắn muốn xác nhận đơn đặt hàng ${code} hay không?`,
			button: { class: 'btn-primary', title: 'Xác nhận' }
		};
		modalRef.componentInstance.data = data;

		modalRef.closed
			.pipe(
				filter((res) => res),
				switchMap(() => {
					return this.inventoryManagementService.approveOrRejectOrderRequest(this.orderRequestId, {
						requestConfirm: true,
						reason: null
					});
				}),
				tap((res) => {
					if (res.data) {
						this.toastr.success('Đã phê duyệt yêu cầu đặt hàng!');
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

  confirmDialogTemplate(): void {
    this.reasonControl.markAsTouched();
    if (this.reasonControl.invalid) {
      return;
    }

    this.activeModal.close(true)
  }

	checkError(error: IError) {
		if (error.code === 'SUN-OIL-4893' || error.code === 'SUN-OIL-4909') {
			this.toastr.error('Unknown error');
		} else if (error.code === 'SUN-OIL-4271') {
      this.toastr.error('Lý do không được để trống');
		} else {
      this.toastr.error(`${error.code} - ${error.message}`);
    }
	}

	goBack() {
		this.router.navigate(['/kho/yeu-cau-dat-hang']);
	}
}
