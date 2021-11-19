import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { BaseComponent } from '../../../../shared/components/base/base.component';
import {
  EWarehouseOrderStatus,
  InventoryManagementService, IShippingTeam, ISupplier, ITransitCar,
  IWareHouseOrderDetail, IWareHouseOrderProductResponses, LIST_WAREHOUSE_ORDER_FORM, PaymentMethod
} from '../../inventory-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubheaderService } from '../../../../_metronic/partials/layout';
import { pluck, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ofNull } from '../../../../shared/helpers/functions';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  dataTransitCars: ITransitCar[] = [];
  dataShippingTeam: IShippingTeam[] = [];
  isInternalCar: boolean;

  exportedWarehouseNameId: number;

  orderInfoForm: FormGroup;
  transportInfoForm: FormGroup;
  productForm: FormGroup;
  dataProductResponses: FormArray = new FormArray([]);

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private inventoryManagementService: InventoryManagementService,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService,
    private activeRoute: ActivatedRoute,
    private subheader: SubheaderService,
    private fb: FormBuilder
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
    this.buildFormProduct();
    this.hanldChangeOrderInfo();
    this.hanldChangeWarehouse();
    this.changeInternalCar();
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
      internalCar: ['true'], /*Chọn xe*/
      vehicleCostMethod: ['', Validators.required], /* Hình thức thanh toán cước xe */
      transportCost: ['', Validators.required], /* Cước vận tải/lit */
      freightCharges: [{ value: '', disabled: true }], /* Thành tiền */
      licensePlates: [''], /*Biển số xe*/
      capacity: [{ value: '', disabled: true }], /* Dung tích */
      driver: [''] /*Tài xế*/
    })
  }

  buildFormProduct() {
    this.productForm = this.fb.group({
      amountActually: ['', Validators.required],
      gasFieldOutName: ['', Validators.required],
      compartment: ['', Validators.required],
      price: ['', Validators.required],
      supplierName: ['', Validators.required]
    })
  }

  pathValue(data) {
    this.orderInfoForm.get('oderForm').patchValue(data.oderForm);
    this.orderInfoForm.get('paymentMethod').patchValue(data.paymentMethod);
    this.orderInfoForm.get('exportedWarehouseAddress').patchValue(data.exportedWarehouseAddress);


    this.transportInfoForm.get('internalCar').patchValue(data.internalCar.toString());
    this.transportInfoForm.get('vehicleCostMethod').patchValue(data.vehicleCostMethod);
    this.transportInfoForm.get('transportCost').patchValue(data.transportCost);
    this.transportInfoForm.get('freightCharges').patchValue(data.freightCharges);
    this.transportInfoForm.get('licensePlates').patchValue(data.licensePlates);
    this.transportInfoForm.get('capacity').patchValue(data.capacity);
    this.transportInfoForm.get('driver').patchValue(data.driver.id);
  }

  hanldChangeOrderInfo() {
    this.orderInfoForm.get('oderForm').valueChanges
      .subscribe((x) => {
        this.dataSupplier = [];
        if (x) {
          this.orderInfoForm.get('exportedWarehouseName').patchValue('');
          this.inventoryManagementService.getListSuppliers(x)
            .subscribe((res) => {
              this.dataSupplier = res.data;
              this.cdr.detectChanges();
            })
        }
      });
  }

  hanldChangeWarehouse() {
    this.orderInfoForm.get('exportedWarehouseName').valueChanges.subscribe(() => {
      this.exportedWarehouseNameId = this.orderInfoForm.get('exportedWarehouseName').value;

      const itemExportedWarehouse = this.dataSupplier.find((x) => {
        return x.id === Number(this.exportedWarehouseNameId);
      });
      this.orderInfoForm.controls['exportedWarehouseAddress'].patchValue(itemExportedWarehouse?.address);
    });
  }

  changeInternalCar() {
    this.transportInfoForm.get('internalCar').valueChanges
      .subscribe((x) => {
        if ((x === 'true')) {
          this.transportInfoForm.get('licensePlates').enable();
          this.transportInfoForm.get('capacity').enable();
          this.transportInfoForm.get('driver').enable();
        } else {
          this.transportInfoForm.get('licensePlates').disable();
          this.transportInfoForm.get('capacity').disable();
          this.transportInfoForm.get('driver').disable();
          this.transportInfoForm.get('licensePlates').patchValue('');
          this.transportInfoForm.get('capacity').patchValue('');
          this.transportInfoForm.get('driver').patchValue('');
        }
      } );
  }

  changeLicensePlates() {
    this.transportInfoForm.get('licensePlates').valueChanges
      .subscribe(() => {
        const licensePlateId: number = this.transportInfoForm.get('licensePlates').value;

        const itemlicensePlate = this.dataTransitCars.find((x) => {
          return x.id === Number(licensePlateId);
        });
        this.transportInfoForm.controls['capacity'].patchValue(itemlicensePlate?.capacity);
      } );
  }

  getWareHouseOrderRequestById() {
    this.activeRoute.params
      .pipe(
        pluck('id'),
        switchMap((id: string) => {
          if (id) {
            return this.inventoryManagementService.viewDetailOrderWarehouse("516");
          }
          this.router.navigate(['']);
          return ofNull();
        }),
        tap((res) => {
          this.dataDetail = res.data;
          this.pathValue(this.dataDetail);
          this.dataProductResponses = this.convertToFormArray(this.dataDetail.wareHouseOrderProductResponses);
          console.log(this.dataDetail);
          this.cdr.detectChanges();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
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
      return this.fb.group({
        amountActually: [d.amountRecommended, Validators.required],
        gasFieldOutName: [d.gasFieldOutName, Validators.required],
        compartment: [d.compartment, Validators.required],
        price: [d.price, Validators.required],
        supplierName: [d.supplierName, Validators.required],
        gasFieldInName: [d.gasFieldInName],
        id: [d.id],
        intoMoney: [d.intoMoney],
        productName: [d.productName],
        unit: [d.unit]
      });
    });
    return this.fb.array(controls);
  }

  onSubmit() {
    // console.log(this.orderInfoForm.value);
    // console.log(this.transportInfoForm.value);
    console.log(this.dataProductResponses.value);
  }
}
