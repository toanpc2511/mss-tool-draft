import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from '../../../../_metronic/partials/layout';
import { BaseComponent } from '../../../../shared/components/base/base.component';
import { pluck, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { Subject } from 'rxjs';
import {
  IExportInventoryDetail,
  InventoryManagementService,
  IProductExportInventory
} from '../../inventory-management.service';
import { IError } from '../../../../shared/models/error.model';
import { error } from 'protractor';
import { convertMoney } from '../../../../shared/helpers/functions';

@Component({
  selector: 'app-export-inventory-detail',
  templateUrl: './export-inventory-detail.component.html',
  styleUrls: ['./export-inventory-detail.component.scss'],
  providers: [DestroyService, FormBuilder]
})
export class ExportInventoryDetailComponent extends BaseComponent implements OnInit, AfterViewInit {
  isInitDataUpdateSubject = new Subject();
  exportInventoryId:  string;
  dataDetail: IExportInventoryDetail;
  dataProductResponses;

  driverNameControl: FormControl = new FormControl('', [Validators.required]);

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private subheader: SubheaderService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private inventoryManagementService: InventoryManagementService,
    private destroy$: DestroyService
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
          title: 'Xuất kho',
          linkText: 'Xuất kho',
          linkPath: 'kho/xuat-kho'
        },
        {
          title: 'Chi tiết phiếu xuất kho',
          linkText: 'Chi tiết phiếu xuất kho',
          linkPath: null
        }
      ]);
    }, 1);
  }

  ngOnInit(): void {
    this.activeRoute.params
      .pipe(
        pluck('id'),
        take(1),
        switchMap((id) => {
          this.setBreadcumb();
          this.exportInventoryId = id;
          return this.inventoryManagementService.getDetailExportInventory(id);
        }),
        tap((res) => {
          this.dataDetail = res.data;
          this.dataProductResponses = this.convertToFormArray(this.dataDetail?.wareHouseOrderProductResponses);
          this.driverNameControl.patchValue(this.dataDetail?.driverName || '');
          this.cdr.detectChanges();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.setBreadcumb();
  }

  convertToFormArray(data: IProductExportInventory[]): FormArray {
    const controls = data.map((p) => {
      return this.fb.group({
        importProducId: [p.id],
        productName:[p.productName],
        unit: [p.unit],
        supplierName: [p.supplierName],
        compartment: [p.compartment],
        amountActually: [p.amountActually],
        gasFieldOutName: [p.gasFieldOutName],
        gasFieldInName: [p.gasFieldInName],
        temperatureExport: [p.temperatureExport, [Validators.required]],
        quotaExport: [p.quotaExport, [Validators.required]],
        capLead: [p.capLead, [Validators.required]],
        capValve: [p.capValve, [Validators.required]]
      });
    });
    return this.fb.array(controls);
  }

  onSubmit() {
    this.driverNameControl.markAllAsTouched();
    this.dataProductResponses.markAllAsTouched();

    if (this.driverNameControl.invalid || this.dataProductResponses.invalid) {
      return;
    }

    const dataProductReq = this.dataProductResponses.value.map((x) => ({
      capLead: x.capLead,
      capValve: x.capValve,
      importProducId: x.importProducId,
      quotaExport: convertMoney(x.quotaExport.toString()),
      temperatureExport: convertMoney(x.temperatureExport.toString())
    }))

    const dataReq = {
      driverName: this.driverNameControl.value || this.dataDetail.driverName,
      licensePlates: this.dataDetail.licensePlates,
      importProductRequests: dataProductReq
    }

    this.inventoryManagementService.submitExportInventory(this.exportInventoryId, dataReq)
      .subscribe((res) => {
        if (res.data) {
          this.ngOnInit();
          this.toastr.success('Lưu thông tin thành công');
        }
      }, (error: IError) => {
        this.checkError(error);
      })
  }

  checkError(error: IError) {
    if (error.code === 'SUN-OIL-4279') {
      this.toastr.error('Phiếu xuất kho không tồn tại');
    }
  }

}
