import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IImportingInventoryDetail, IWareHouseOrderProduct } from '../models/importing-inventory-detail.interface';
import { ActivatedRoute } from '@angular/router';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { ImportInventoryDetailService } from '../import-inventory-detail.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataResponse } from '../../../../shared/models/data-response.model';
import { SubheaderService } from '../../../../_metronic/partials/layout';
import { preventLetter } from '../../../../shared/utitlies/prevent-letter';
import { BaseComponent } from '../../../../shared/components/base/base.component';
import { FileService } from '../../../../shared/services/file.service';
import { DestroyService } from '../../../../shared/services/destroy.service';

@Component({
  selector: 'app-importing-inventory-detail',
  templateUrl: './importing-inventory-detail.component.html',
  styleUrls: ['./importing-inventory-detail.component.scss']
})
export class ImportingInventoryDetailComponent extends BaseComponent implements OnInit, AfterViewInit {

  dataSource: IImportingInventoryDetail;
  importInventoryDetailForm: FormGroup;
  importProductInfos: FormArray = new FormArray([]);
  idImportingInventoryDetail: string;
  isSupplier: boolean;
  status: boolean;
  isInternalCar: boolean;
  preventLetter: (event: KeyboardEvent) => void = preventLetter;
  decimalPattern = /^[0-9]+(\.[0-9]+)?$/;

  constructor(private _route: ActivatedRoute,
              private service: ImportInventoryDetailService,
              private cdr: ChangeDetectorRef,
              private fb: FormBuilder,
              private toarst: ToastrService,
              private subheader: SubheaderService,
              private fileService: FileService,
              private destroy$: DestroyService)
  {
    super();
    this.initImportInventoryDetailForm();
  }

  ngOnInit(): void {
    this._route.paramMap.subscribe(params => this.idImportingInventoryDetail = params.get('id'));
    this.getImportingInventoryDetail();
  }

  ngAfterViewInit(): void {
    this.setBreadcumb();
  }

  initImportInventoryDetailForm(): void {
    this.importInventoryDetailForm = this.fb.group({
      nameDriver: [''],
      licensePlates: [''],
      importProductInfos: this.fb.array([])
    });
  }

  convertToFormArray(data: IWareHouseOrderProduct[]): FormArray {
    const controls = data.map((d: any) => {
      return this.fb.group({
        id: [d.id],
        importProductId: [d.importProductId],
        gasFieldInId: [d.gasFieldInId],
        gasFieldOutId: [d.gasFieldOutId],
        supplierId: [d.supplierId],
        productName: [d.productName],
        unit: [d.unit],
        amountActually: [d.amountActually],
        gasFieldOutName: [d.gasFieldOutName],
        compartment: [ { value: d.compartment, disabled: !this.isSupplier }],
        gasFieldInName: [d.gasFieldInName],
        price: [d.price],
        supplierName: [d.supplierName],
        intoMoney: [d.intoMoney],
        amountRecommended: [d.amountRecommended],
        treasurerRecommend:[d.treasurerRecommend],
        temperatureExport: [{ value: d.temperatureExport, disabled: !this.isSupplier }, [this.isSupplier ? Validators.compose([Validators.pattern(this.decimalPattern), Validators.required]) : Validators.nullValidator]],
        quotaExport: [{ value: d.quotaExport, disabled: !this.isSupplier }, [this.isSupplier ? Validators.compose([Validators.required, Validators.pattern(this.decimalPattern)]) : Validators.nullValidator]],
        quotaImport: [d.quotaImport, [Validators.required, Validators.pattern(this.decimalPattern)]],
        capLead: [{ value: d.capLead, disabled: !this.isSupplier }, [this.isSupplier ? Validators.required : Validators.nullValidator]],
        capValve: [{ value: d.capValve, disabled: !this.isSupplier }, [this.isSupplier ? Validators.required : Validators.nullValidator]],
        temperatureImport: [d.temperatureImport, [Validators.pattern(this.decimalPattern), Validators.required]],
        difference: [d.difference || 1],
        recommend: [d.recommend],
      });
    });
    return this.fb.array(controls);
  }

  getImportingInventoryDetail(): void {
    this.service.getById(this.idImportingInventoryDetail)
      .pipe(
        finalize(() => {
          this.cdr.detectChanges();
        })
      )
      .subscribe((res: DataResponse<IImportingInventoryDetail>) => {
        this.dataSource = res.data;
        this.isSupplier = res.data.orderForm === 'SUPPLIER';
        this.status = this.dataSource.status === 'NOT_ENTER';
        if (!this.dataSource.internalCar) {
          this.initFormValue();
        }
        this.importProductInfos = this.convertToFormArray(res.data.wareHouseOrderProductResponses);
    });
  }

  submit(): void {
    this.importInventoryDetailForm.controls['importProductInfos'] = this.extractData();

    this.importInventoryDetailForm.markAllAsTouched();
    this.importProductInfos.markAllAsTouched();

    if (this.importInventoryDetailForm.invalid || this.importProductInfos.invalid) {
      this.toarst.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const data = this.importInventoryDetailForm.getRawValue();

    this.service.completeImportingInventoryRequest(data, this.idImportingInventoryDetail)
      .pipe(
        finalize(() => {
          this.cdr.detectChanges();
        })
      )
      .subscribe(() => {
        this.getImportingInventoryDetail();
        this.toarst.success('Đã hoàn thành nhập kho');
      });
  }

  initFormValue(): void {
    this.importInventoryDetailForm.controls['nameDriver'].patchValue(this.dataSource?.driver.name);
    this.importInventoryDetailForm.controls['licensePlates'].patchValue(this.dataSource?.licensePlates);

    this.setValidate();

    this.importInventoryDetailForm.controls['importProductInfos'] = this.extractData();

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
          title: 'Nhập kho',
          linkText: 'Nhập kho',
          linkPath: 'kho/nhap-kho'
        },
        {
          title: 'Chi tiết phiếu nhập kho',
          linkText: 'Chi tiết phiếu nhập kho',
          linkPath: null
        }
      ]);
    }, 1);
  }

  extractData(): FormArray {
    const data = this.importProductInfos.getRawValue();

    const controls = data.map((d: any) => {
      return this.fb.group({
        quotaExport: d.quotaExport,
        quotaImport: d.quotaImport,
        capLead: d.capLead,
        capValve: d.capValve,
        temperatureImport: d.temperatureImport,
        temperatureExport: d.temperatureExport,
        difference: d.difference,
        id: d.importProductId,
        compartment: [d.compartment]
      });
    });

    return this.fb.array(controls);
  }

  setValidate(): void {
    this.importInventoryDetailForm.controls['nameDriver'].setValidators([Validators.required]);
    this.importInventoryDetailForm.controls['nameDriver'].updateValueAndValidity();
    this.importInventoryDetailForm.controls['licensePlates'].setValidators([Validators.required]);
    this.importInventoryDetailForm.controls['licensePlates'].updateValueAndValidity();
  }

  exportFile(): void {
    this.service.exportFileWorld(this.idImportingInventoryDetail)
      .pipe(
        tap((res: DataResponse<string>) => {
          if (res) {
            this.fileService.downloadFromUrl(res.data);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

}
