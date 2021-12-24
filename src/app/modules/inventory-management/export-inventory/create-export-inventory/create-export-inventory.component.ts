import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from '../../../../_metronic/partials/layout';
import {
  IGasFieldByStation,
  InventoryManagementService,
  IStationActiveByToken
} from '../../inventory-management.service';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { BaseComponent } from '../../../../shared/components/base/base.component';
import { takeUntil } from 'rxjs/operators';
import { IInfoProduct, IProduct, ProductService } from '../../../product/product.service';
import { convertMoney } from '../../../../shared/helpers/functions';
import { IError } from '../../../../shared/models/error.model';

@Component({
  selector: 'app-create-export-inventory',
  templateUrl: './create-export-inventory.component.html',
  styleUrls: ['./create-export-inventory.component.scss'],
  providers: [FormBuilder]
})
export class CreateExportInventoryComponent extends BaseComponent implements OnInit, AfterViewInit {
  stationId: number;
  decimalPattern = /^[0-9]+(\.[0-9]+)?$/;
  listStation: IStationActiveByToken[] = [];
  listProduct: IProduct[] = [];
  dataSupplierProduct: Array<any> = [];
  listItemGas: Array<any> = [];
  listGasField: IGasFieldByStation[] = [];

  infoForm: FormGroup;
  productForm: FormGroup;
  productFormArray: FormArray;
  gasFuels: Array<Array<any>> = [];

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private subheader: SubheaderService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private inventoryManagementService: InventoryManagementService,
    private productService: ProductService,
    private destroy$: DestroyService
    ) {
    super();
  }

  ngOnInit(): void {
    this.getListStation();
    this.getListProductFuels();
    this.getListSuppliers();
    this.buildFormInfo();
    this.buildProductForm();

    this.changeStation();
  }

  ngAfterViewInit(): void {
    this.setBreadcumb();
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
          title: 'Tạo phiếu xuất kho',
          linkText: 'Tạo phiếu xuất kho',
          linkPath: null
        }
      ]);
    }, 1);
  }

  buildFormInfo() {
    this.infoForm = this.fb.group({
      representativeTakeName: ['', Validators.required],
      importedWarehouseName: ['', Validators.required],
      importedWarehouseAddress: ['', Validators.required],
      storeExport: ['', Validators.required],
      exportedWarehouseAddress: [{ value: '', disabled: true }],
      driverName: ['', Validators.required],
      licensePlates: ['', Validators.required]
    })
  }

  listControlForm() {
    return this.fb.group({
      productId: ['', Validators.required],
      productName: [''],
      compartment: ['', Validators.required],
      gasFieldOut: ['', Validators.required],
      suppliers: [''],
      temperatureExport: ['', [Validators.required, Validators.pattern(this.decimalPattern)]],
      quotaExport: ['', Validators.required],
      capLead: ['', Validators.required],
      capValve: ['', Validators.required],
      unit: [''],
      amountActually: ['', [Validators.required, Validators.min(1)]]
    })
  }

  buildProductForm() {
    this.productForm = this.fb.group({
      products: this.fb.array([
        this.listControlForm()
      ])
    });

    this.productFormArray = this.productForm.get('products') as FormArray;
    this.cdr.detectChanges();
  }

  getListStation() {
    this.inventoryManagementService
      .getStationByToken('ACTIVE', 'false')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.listStation = res.data;
        this.cdr.detectChanges();
      });
  }

  getListProductFuels() {
    this.productService
      .getListOilProduct()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.listProduct = res.data;
        this.cdr.detectChanges();
      });
  }

  getListSuppliers() {
    this.inventoryManagementService.getListSuppliers('SUPPLIER')
      .subscribe((res) => {
        this.dataSupplierProduct = res.data;
        this.cdr.detectChanges();
      })
  }

  changeStation() {
    this.infoForm.get('storeExport').valueChanges
      .subscribe((value: number | string) => {
        this.stationId = Number(value);
        const itemStoreExport = this.listStation.find((x) => {
          return x.id === Number(value);
        });
        this.infoForm.controls['exportedWarehouseAddress'].patchValue(itemStoreExport?.fullAddress);

        this.inventoryManagementService.getGasFields(value, 'ACTIVE')
          .subscribe((res) => {
            this.listGasField = res.data;
            this.cdr.detectChanges();
          })
        const allProduct = this.productFormArray.value as Array<any>;
        allProduct.map((item, index) => {
          this.productFormArray.at(index).get('gasFieldOut').patchValue('')
        });

        this.buildProductForm();
      })
  }

  productChanged($event, i: number) {
    const value = ($event.target as HTMLSelectElement).value;
    this.patchInfoProduct(value, i);
  }

  patchInfoProduct(productId: string | number, i: number) {
    const allProduct = this.productFormArray.value as Array<any>;
    const checkExisted = allProduct.some(
      (p, index) => p.productId && i !== index && Number(p.productId) === Number(productId)
    );

    if (checkExisted) {
      this.toastr.error('Sản phẩm này đã được thêm');
      this.productFormArray.at(i).get('productId').patchValue('');
      this.productFormArray.at(i).get('gasFieldOut').patchValue('');
      return;
    }
    if (!productId) {
      this.productFormArray.at(i).get('unit').patchValue('');
      this.productFormArray.at(i).get('gasFieldOut').patchValue('');
    }

    if (!this.stationId) {
      this.productFormArray.at(i).get('productId').patchValue('');
      this.toastr.error('Bạn chưa chọn trạm');
      return;
    }

    this.inventoryManagementService.getListGasFuel(productId, this.stationId).subscribe((res) => {
      this.gasFuels[i] = res.data;
      this.cdr.detectChanges();
    });

    this.productService.getInfoProductOther(Number(productId)).subscribe((res) => {
      const productInfo: IInfoProduct = res.data;
      this.productFormArray.at(i).get('unit').patchValue(productInfo.unit);
      this.productFormArray.at(i).get('productName').patchValue(productInfo.name);
      this.cdr.detectChanges();
    });
  }

  addItem() {
    this.productFormArray.push(
      this.listControlForm()
    );
  }

  deleteItem(index: number): void {
    this.productFormArray.removeAt(index);
    this.gasFuels = [...this.gasFuels].filter((_, i) => i !== index);
  }

  onSubmit() {
    this.infoForm.markAllAsTouched();
    this.productForm.markAllAsTouched();

    if (this.infoForm.invalid || this.productForm.invalid) {
      this.toastr.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    const valueInfoForm = this.infoForm.value;

    const dataReq = {
      representativeTakeName: valueInfoForm.representativeTakeName,
      importedWarehouseName: valueInfoForm.importedWarehouseName,
      importedWarehouseAddress: valueInfoForm.importedWarehouseAddress,
      driverName: valueInfoForm.driverName,
      licensePlates: valueInfoForm.licensePlates,
      storeExport: this.getValueStoreExport(),
      importProductRequests: this.getValueListProduct()
    }

    this.inventoryManagementService.createExportInventory(dataReq)
      .subscribe((res) => {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions,@typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        this.router.navigate([`/kho/xuat-kho/chi-tiet/${res.data.id}`]);
        this.toastr.success('Tạo phiếu xuất kho thành công');
      }, (error: IError) => {
        this.checkError(error);
      })
  }

  getValueStoreExport() {
    const valueForm = this.infoForm.value;
    const itemStation = this.listStation.find((x) => {
      return x.id === Number(valueForm.storeExport);
    })
    return {
      id: Number(itemStation.id),
      name: itemStation.name,
      address: itemStation.fullAddress,
      chip: itemStation.chip
    }
  }

  getValueListProduct() {
    return this.productForm.value.products.map((p) => ({
      ...p,
      suppliers: this.dataSupplierProduct.find((x) => {
        return x.id === Number(p.suppliers)
      }) || null,
      gasFieldOut: this.listGasField.find((x) => {
        return x.id === Number(p.gasFieldOut)
      }),
      amountActually: convertMoney(p.amountActually.toString()),
      temperatureExport: convertMoney(p.temperatureExport.toString()),
      quotaExport: convertMoney(p.quotaExport.toString()),
      productId: Number(p.productId)
    }));
  }

  checkError(error: IError) {
    this.toastr.error(error.code);
  }
}
