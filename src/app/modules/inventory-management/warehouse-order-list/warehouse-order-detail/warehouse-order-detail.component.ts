import { IDataTransfer } from './../../../shift/shift-work/delete-calendar-all/delete-calendar-all.component';
import { InventoryManagementService } from './../../inventory-management.service';
import { DestroyService } from './../../../../shared/services/destroy.service';
import { ChangeDetectorRef, Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filter, pluck, switchMap, takeUntil } from 'rxjs/operators';
import { FileService } from 'src/app/shared/services/file.service';
import { SubheaderService } from 'src/app/_metronic/partials/layout';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { EWarehouseOrderStatus } from '../../inventory-management.service';

@Component({
  selector: 'app-warehouse-order-detail',
  templateUrl: './warehouse-order-detail.component.html',
  styleUrls: ['./warehouse-order-detail.component.scss'],
  providers: [DestroyService]
})
export class WareHouseOrderDetailComponent extends BaseComponent implements OnInit, AfterViewInit {
  eContractStatus = EWarehouseOrderStatus;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private inventoryManagementService: InventoryManagementService,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService,
    private activeRoute: ActivatedRoute,
    private subheader: SubheaderService,
  ) {
    super();
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
					title: 'Danh sách yêu cầu đặt kho',
					linkText: 'Danh sách yêu cầu đặt kho',
					linkPath: 'kho/don-dat-kho'
				},
        {
          title: 'Chi tiết yêu cầu đặt kho',
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

  }

  goToListRequest() {

  }

  reject($event?: Event, data?: IDataTransfer) {
    if ($event) {
      $event.stopPropagation();
    }
    const modalRef = this.modalService.open(null, {
      backdrop: 'static',
      size: 'lg'
    });

    modalRef.componentInstance.data = {

    };
  }

  accept($event?: Event, data?: IDataTransfer) {
    if ($event) {
      $event.stopPropagation();
    }
    const modalRef = this.modalService.open(null, {
      backdrop: 'static',
      size: 'lg'
    });

    modalRef.componentInstance.data = {

    };
  }
}

