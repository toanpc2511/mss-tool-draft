import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { BaseComponent } from '../../../../shared/components/base/base.component';
import {
  EWarehouseOrderStatus,
  InventoryManagementService, IShippingTeam, IStationActiveByToken, ISupplier, ITransitCar,
  IWareHouseOrderDetail, IWareHouseOrderProductResponses, LIST_WAREHOUSE_ORDER_FORM, PaymentMethod
} from '../../inventory-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubheaderService } from '../../../../_metronic/partials/layout';
import { pluck, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { convertMoney, ofNull } from '../../../../shared/helpers/functions';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { IError } from '../../../../shared/models/error.model';
import { ToastrService } from 'ngx-toastr';
import { TValidators } from '../../../../shared/validators';

@Component({
  selector: 'app-create-warehouse-order',
  templateUrl: './create-warehouse-order.component.html',
  styleUrls: ['./create-warehouse-order.component.scss'],
  providers: [DestroyService, FormBuilder]
})
export class CreateWarehouseOrderComponent extends BaseComponent implements OnInit, AfterViewInit {
  listWarehouseOrderForm = LIST_WAREHOUSE_ORDER_FORM;
  paymentMethod = PaymentMethod;
  eWarehouseStatus = EWarehouseOrderStatus;
  dataDetail: IWareHouseOrderDetail;
  dataSupplier: ISupplier[] = [];
  dataSupplierProduct: Array<any> = [];
  dataTransitCars: ITransitCar[] = [];
  dataShippingTeam: IShippingTeam[] = [];
  isInternalCar: boolean;
  stationByToken: IStationActiveByToken[] = [];
  reasonChange: FormControl;

  exportedWarehouseNameId: number;
  oderForm: string;

  orderInfoForm: FormGroup;
  transportInfoForm: FormGroup;
  dataProductResponses;
  gasArray$: Array<Observable<any>> = [];
  listItemGas: Array<any> = [];
  totalMoney: number;
  isRequired: boolean;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private inventoryManagementService: InventoryManagementService,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService,
    private activeRoute: ActivatedRoute,
    private subheader: SubheaderService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    super();
    this.totalMoney = 0;
    this.reasonChange = new FormControl('', Validators.required);
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
          title: 'Tạo yêu cầu đặt kho',
          linkText: 'Tạo yêu cầu đặt kho',
          linkPath: null
        }
      ]);
    }, 1);
  }

  ngOnInit(): void {
    this.getWareHouseOrderRequestById();
    this.getTransitCars();
    this.getShippingTeam();

    this.buildFormOrderInfo();
    this.buildTransportinfoForm();
    this.hanldChangeOrderInfo();
    this.getListSuppliers();
  }

  ngAfterViewInit(): void {
    this.setBreadcumb();
  }

  buildFormOrderInfo() {
    this.orderInfoForm = this.fb.group({
      oderForm: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      exportedWarehouseName: ['', Validators.required],
      exportedWarehouseAddress: [{ value: '', disabled: true }]
    });
  }

  buildTransportinfoForm() {
    this.transportInfoForm = this.fb.group({
      internalCar: [''],
      vehicleCostMethod: ['', Validators.required],
      freightCharges: ['', [Validators.required, TValidators.min(1)]],
      transportCost: [{ value: '', disabled: true }],
      licensePlates: [null, [!this.isInternalCar ? Validators.required : Validators.nullValidator]],
      capacity: [{ value: '', disabled: true }],
      driver: [null, [!this.isInternalCar ? Validators.required : Validators.nullValidator]]
    })
  }

  pathValue(data) {
    this.orderInfoForm.get('oderForm').patchValue(data.oderForm || '');
    this.orderInfoForm.get('paymentMethod').patchValue(data.paymentMethod || '');
    this.orderInfoForm.controls['exportedWarehouseAddress'].patchValue(data.exportedWarehouseAddress || '');
    this.orderInfoForm.get('exportedWarehouseName').patchValue(data.exportedWarehouseId || '');

    this.transportInfoForm.get('internalCar').patchValue(data.internalCar || 'false');
    this.transportInfoForm.get('vehicleCostMethod').patchValue(data.vehicleCostMethod || '');
    this.transportInfoForm.get('transportCost').patchValue(data.transportCost?.toLocaleString('en-US') || '');
    this.transportInfoForm.get('freightCharges').patchValue(data.freightCharges || '');
    this.transportInfoForm.get('licensePlates').patchValue(data.licensePlates || null);
    this.transportInfoForm.get('capacity').patchValue(data.capacity || null);
    this.transportInfoForm.get('driver').patchValue(data.driver?.id || null);
  }

  hanldChangeOrderInfo() {
    this.orderInfoForm.get('oderForm').valueChanges
      .subscribe((x) => {
        this.dataSupplier = [];
        if (x) {
          x !== 'SUPPLIER' ? this.isRequired = true : this.isRequired = false;
          this.dataProductResponses?.value.map((_, index) => {
            this.isRequired
              ? this.dataProductResponses.at(index).get('gasFieldOut').setValidators(Validators.required)
              : this.dataProductResponses.at(index).get('gasFieldOut').setValidators(Validators.nullValidator);
          })
          this.orderInfoForm.get('exportedWarehouseName').patchValue('');
          this.orderInfoForm.controls['exportedWarehouseAddress'].patchValue('');
          this.inventoryManagementService.getListSuppliers(x)
            .subscribe((res) => {
              this.dataSupplier = res.data;
              this.cdr.detectChanges();
            })
        }
      });
  }

  hanldChangeWarehouse() {
    this.exportedWarehouseNameId = this.orderInfoForm.get('exportedWarehouseName').value;
    this.oderForm = this.orderInfoForm.get('oderForm').value;

    const itemExportedWarehouse = this.dataSupplier.find((x) => {
      return x.id === Number(this.exportedWarehouseNameId);
    });
    this.orderInfoForm.controls['exportedWarehouseAddress'].patchValue(itemExportedWarehouse?.address);

    this.getListGasFuelWrehouse(this.renderListApi(true));
  }

  renderListApi (loadData: boolean) {
    return this.dataProductResponses.value.map((product, index) => {
      if (loadData) {
        this.dataProductResponses.at(index).get('gasFieldOut').patchValue('');
      }

      if (product.id && this.exportedWarehouseNameId && this.oderForm) {
        return this.inventoryManagementService.getListGasFuelWrehouse(product.id, this.exportedWarehouseNameId, this.oderForm);
      }
      return ofNull()
    })
  }

  changeInternalCar() {
    this.transportInfoForm.get('internalCar').valueChanges
      .subscribe((x) => {
        if ((x === 'true')) {
          this.isInternalCar = true;
          this.transportInfoForm.get('licensePlates').enable();
          this.transportInfoForm.get('driver').enable();
        } else {
          this.isInternalCar = false;
          this.transportInfoForm.get('licensePlates').disable();
          this.transportInfoForm.get('driver').disable();
          this.transportInfoForm.get('licensePlates').patchValue(null);
          this.transportInfoForm.get('driver').patchValue(null);
          this.transportInfoForm.get('capacity').patchValue('');
        }
      } );
  }

  changeLicensePlates() {
    this.transportInfoForm.get('licensePlates').valueChanges
      .subscribe(() => {
        const licensePlateName: string = this.transportInfoForm.get('licensePlates').value;

        const itemlicensePlate = this.dataTransitCars.find((x) => {
          return x.licensePlates === licensePlateName;
        });
        this.transportInfoForm.controls['capacity'].patchValue(itemlicensePlate?.capacity);
      } );
  }

  getListSuppliers() {
    this.inventoryManagementService.getListSuppliers('SUPPLIER')
      .subscribe((res) => {
        this.dataSupplierProduct = res.data;
        this.cdr.detectChanges();
      })
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
          this.initData(res.data);
          this.cdr.detectChanges();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  initData(data: IWareHouseOrderDetail) {
    this.exportedWarehouseNameId = data.exportedWarehouseId;
    this.pathValue(data);

    this.extractStatusOrder(data);

    this.oderForm = data.oderForm;
    this.getListGasFuelWrehouse(this.renderListApi(false));

    this.transportInfoForm.get('internalCar').patchValue(data.internalCar || 'false');

    this.extractInternalCar(data.internalCar);

    this.sumTotalMoney();
  }

  sumTotalMoney() {
    for (let i = 0; i < this.dataProductResponses?.value.length; i++) {
      this.totalMoney += convertMoney(this.dataProductResponses.value[i].intoMoney?.toString());
    }
  }

  extractInternalCar(internalCar: boolean) {
    if ( internalCar) {
      this.transportInfoForm.get('licensePlates').enable();
      this.transportInfoForm.get('driver').enable();
      this.isInternalCar = true;
    } else {
      this.isInternalCar = false;
      this.transportInfoForm.get('licensePlates').disable();
      this.transportInfoForm.get('driver').disable();
    }
  }

  extractStatusOrder(data: IWareHouseOrderDetail) {
    this.dataProductResponses = !data.checkChange ? this.convertToFormArray(data.wareHouseOrderProductResponsesOld) :
      this.convertToFormArray(this.dataDetail.wareHouseOrderProductResponsesNew);

    if (!data.checkBallot) {
      this.transportInfoForm.get('internalCar').disable();
      this.transportInfoForm.get('vehicleCostMethod').disable();
      this.transportInfoForm.get('freightCharges').disable();
    } else {
      this.transportInfoForm.get('internalCar').enable();
      this.transportInfoForm.get('vehicleCostMethod').enable();
      this.transportInfoForm.get('freightCharges').enable();
    }
  }

  getListGasFuelWrehouse(listApi) {
      forkJoin(...listApi)
        .pipe(take(1)).subscribe((res) => {
        this.listItemGas = [];
        res.map((x) => {
          this.gasArray$ = [];
          this.listItemGas.push(x?.data);
        })
        this.cdr.detectChanges();
      })
  }

  getTransitCars() {
    this.inventoryManagementService.getTransitCars()
      .subscribe((res) => {
        this.dataTransitCars = res.data;
        this.cdr.detectChanges();
      });
  }

  getShippingTeam() {
    this.inventoryManagementService.getShippingTeam()
      .subscribe((res) => {
        this.dataShippingTeam = res.data;
        this.cdr.detectChanges();
      });
  }

  convertToFormArray(data: IWareHouseOrderProductResponses[]): FormArray {
    const controls = data.map((d) => {
      const fb = this.fb.group({
        recommend: [this.dataDetail?.status === 'NEW' || this.dataDetail?.status === "SWAP" ? d.amountRecommended : d.recommend, Validators.required],
        gasFieldOut: [d.gasFieldOutId],
        compartment: [d.compartment],
        price: [d.price, Validators.required],
        supplierId: [d.supplierId || '', Validators.required],
        gasFieldInName: [d.gasFieldInName],
        id: [d.id],
        intoMoney: [d.intoMoney],
        productName: [d.productName],
        unit: [d.unit],
        importProductId: [d.importProductId]
      });
     fb.get('gasFieldOut').patchValue(d.gasFieldOutId || '')
      return fb;
    });

    return this.fb.array(controls);
  }

  changeValuePrice(index: number) {
    const recommend: number = convertMoney(
      this.dataProductResponses.at(index).get('recommend').value.toString()
    );

    const price: number = convertMoney(
      this.dataProductResponses.at(index).get('price').value.toString()
    );

    this.dataProductResponses.at(index).get('intoMoney').patchValue(recommend * price);

    this.totalMoney = 0;
    for (let i = 0; i < this.dataProductResponses.value.length; i++) {
      this.totalMoney += this.dataProductResponses.value[i].intoMoney;
    }
    this.sumFreightCharge();
  }

  sumFreightCharge() {
    const freightCharges = convertMoney(this.transportInfoForm.get('freightCharges').value.toString());
    let totalRecommend = 0;

    for (let i = 0; i < this.dataProductResponses.value.length; i++) {
      totalRecommend += convertMoney(this.dataProductResponses.value[i].recommend.toString());
    }

    this.transportInfoForm.get('transportCost').patchValue((freightCharges * totalRecommend).toLocaleString('en-US'));
  }

  onSubmit() {
    this.orderInfoForm.markAllAsTouched();
    this.dataProductResponses.markAllAsTouched();
    this.transportInfoForm.markAllAsTouched();

    if (this.orderInfoForm.invalid || this.dataProductResponses.invalid || this.transportInfoForm.invalid) {
      this.toastr.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const driver = this.dataShippingTeam.find((x) => {
      return x.id === Number(this.transportInfoForm.getRawValue().driver);
    });
    delete driver?.code;

    const importProducts = this.dataProductResponses.value.map((p, index) => ({
      id: Number(p.importProductId),
      amountRecommended: convertMoney(p.recommend.toString()),
      compartment: p.compartment,
      price: convertMoney(p.price.toString()),
      supplierId: Number(p.supplierId),
      gasField: this.listItemGas[index].find((x) => {
        return x.id ===  Number(p.gasFieldOut)
      }),
      supplier: this.dataSupplierProduct.find((x) => {
        return x.id  === Number(p.supplierId)
      })
    }))

    const dataReq = {
      orderForm: this.orderInfoForm.getRawValue().oderForm,
      storeExportId: Number(this.orderInfoForm.getRawValue().exportedWarehouseName),
      storeExportAddress: this.orderInfoForm.getRawValue().exportedWarehouseAddress,
      paymentMethod: this.orderInfoForm.getRawValue().paymentMethod,
      internalCar: this.transportInfoForm.getRawValue().internalCar,
      vehicleCostMethod: this.transportInfoForm.getRawValue().vehicleCostMethod,
      freightCharges: convertMoney(this.transportInfoForm.getRawValue().freightCharges.toString()),
      importRequestId: this.dataDetail.importRequestId,
      capacity: Number(this.transportInfoForm.getRawValue().capacity) || null,
      licensePlates: this.transportInfoForm.getRawValue().licensePlates,
      importProducts: importProducts,
      driver: driver || null
    };

    if (this.dataDetail?.checkChange) {
      this.inventoryManagementService.updateWarehouseOrder(this.dataDetail.id, dataReq)
        .subscribe((res) => {
          if (res) {
            this.router.navigate(['/kho/don-dat-kho']);
            this.toastr.success('Gửi yêu cầu đặt kho thành công')
          }
        }, (err: IError) => {
          this.checkError(err);
        })
    } else {
      this.inventoryManagementService.putWarehouseOrders(this.dataDetail.id, dataReq)
        .subscribe((res) => {
          if (res) {
            this.router.navigate(['/kho/don-dat-kho']);
            this.toastr.success('Gửi yêu cầu đặt kho thành công')
          }
        }, (err: IError) => {
          this.checkError(err);
        })
    }
  }

  goBack() {
    this.router.navigate(['/kho/don-dat-kho']);
  }

  checkError(error: IError) {
    if (error.code === 'SUN-OIL-4268') {
      this.toastr.error('Đơn đặt kho không tồn tại')
    }
    if (error.code === 'SUN-OIL-4934') {
      this.toastr.error('Cước vận tải/lit không được để trống')
    }
  }
}
