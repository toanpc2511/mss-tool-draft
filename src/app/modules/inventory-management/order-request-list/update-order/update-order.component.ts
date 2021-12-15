import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../shared/components/base/base.component';
import {
  IGasFuel,
  IInfoOrderRequest,
  InventoryManagementService,
  IStationActiveByToken
} from '../../inventory-management.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IInfoProduct, IProduct, ProductService } from '../../../product/product.service';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from '../../../../_metronic/partials/layout';
import { finalize, pluck, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { convertDateToDisplay, convertDateToServer, convertMoney, ofNull } from '../../../../shared/helpers/functions';
import { IError } from '../../../../shared/models/error.model';
import { LIST_STATUS_ORDER_REQUEST } from '../../../../shared/data-enum/list-status';

@Component({
  selector: 'app-update-order',
  templateUrl: './update-order.component.html',
  styleUrls: ['./update-order.component.scss'],
  providers: [DestroyService, FormBuilder]
})
export class UpdateOrderComponent extends BaseComponent implements OnInit, AfterViewInit {
  stationByToken: IStationActiveByToken[] = [];
  requestForm: FormGroup;
  productForm: FormGroup;
  productFormArray: FormArray;
  products: Array<Array<any>> = [];
  productFuels: IProduct[] = [];
  listGasField: IGasFuel[] = [];
  stationId: number;
  dataDetail: IInfoOrderRequest;
  orderRequestId: number;
  isInitDataUpdateSubject = new Subject();
  listStatus = LIST_STATUS_ORDER_REQUEST;
  reasonChange: FormControl;

  currentDate = moment();
  minDate: NgbDateStruct = {
    day: this.currentDate.date(),
    month: this.currentDate.month() + 1,
    year: this.currentDate.year()
  };

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
          title: 'Yêu cầu đặt hàng',
          linkText: 'Yêu cầu đặt hàng',
          linkPath: 'kho/yeu-cau-dat-hang'
        },
        {
          title: 'Cập nhật yêu cầu đạt hàng',
          linkText: 'Cập nhật yêu cầu đặt hàng',
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
        switchMap((id: number) => {
          if (id) {
            this.orderRequestId = id;
            this.minDate = null;
            return this.inventoryManagementService.viewDetailOrderRequest(id);
          }
          return ofNull();
        }),
        tap((res) => {
          if (res?.data) {
            this.loadDataUpdate(res.data);
          }
        }),
        finalize(() => this.isInitDataUpdateSubject.next(true)),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.getStationToken();
    this.getListProductFuels();
    this.buildForm();
    this.buildProductForm();
  }

  ngAfterViewInit(): void {
    this.setBreadcumb();
  }

  buildForm() {
    this.requestForm = this.fb.group({
      stationId: ['', Validators.required],
      fullAddress: [{ value: '', disabled: true }],
      expectedDate: ['', Validators.required]
    });
  }

  buildProductForm() {
    this.productForm = this.fb.group({
      products: this.fb.array([
        this.fb.group({
          id: ['', Validators.required],
          gasFieldId: ['', Validators.required],
          unit: [''],
          amountRecommended: ['', [Validators.required, Validators.min(1)]]
        })
      ])
    });

    this.productFormArray = this.productForm.get('products') as FormArray;
    this.cdr.detectChanges();
  }

  loadDataUpdate(data: IInfoOrderRequest) {
    this.dataDetail = data;

    this.stationId = data.stationId;
    this.pathValueRequestForm(data);
    this.pathValueProduct(data);
  }

  pathValueRequestForm(data: IInfoOrderRequest) {
    this.requestForm.get('stationId').patchValue(data.stationId);
    this.requestForm.get('fullAddress').patchValue(data.address);
    this.reasonChange.patchValue(data.reasonChange);
    this.requestForm.get('expectedDate').patchValue(convertDateToDisplay(data.requestDate));
  }

  pathValueProduct(data: IInfoOrderRequest) {
    (data.status === 'WAIT_CONFIRM' ? data.productResponses : data.productNewResponses)
      .forEach((product, i) => {
        if (i >= 1) {
          this.addItem();
        }

        this.inventoryManagementService
          .getListGasFuel(product.productId, data.stationId)
          .subscribe((res) => {
            this.products[i] = res.data;
            this.cdr.detectChanges();
          });

        this.productFormArray.at(i).get('id').patchValue(product.productId);
        this.productFormArray.at(i).get('gasFieldId').patchValue(product.gasFieldIn.id);
        this.productFormArray.at(i).get('unit').patchValue(product.unit);
        this.productFormArray.at(i).get('amountRecommended').patchValue(product.amountRecommended);
      });
  }

  handleStationChange() {
    this.requestForm.get('stationId').valueChanges.subscribe(() => {
      this.stationId = this.requestForm.get('stationId').value;
      this.buildProductForm();

      const itemStation = this.stationByToken.find((x) => {
        return x.id === Number(this.stationId);
      });

      this.requestForm.get('fullAddress').patchValue(itemStation.fullAddress);
    });
  }

  getStationToken() {
    this.inventoryManagementService
      .getStationByToken('ACTIVE', 'false')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.stationByToken = res.data;
        this.cdr.detectChanges();
      });
  }

  getListProductFuels() {
    this.productService
      .getListOilProduct()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.productFuels = res.data;
        this.cdr.detectChanges();
      });
  }

  productChanged($event, i: number) {
    const value = ($event.target as HTMLSelectElement).value;
    this.patchInfoProduct(value, i);
  }

  patchInfoProduct(productId: string | number, i: number) {
    const allProduct = this.productFormArray.value as Array<any>;
    const checkExisted = allProduct.some(
      (p, index) => p.id && i !== index && Number(p.id) === Number(productId)
    );

    if (checkExisted) {
      this.toastr.error('Sản phẩm này đã được thêm');
      this.productFormArray.at(i).get('id').patchValue('');
      return;
    }
    if (!productId) {
      this.productFormArray.at(i).get('unit').patchValue(0);
    }

    if (!this.stationId) {
      this.productFormArray.at(i).get('id').patchValue('');
      this.toastr.error('Bạn chưa chọn trạm');
      return;
    }

    this.inventoryManagementService.getListGasFuel(productId, this.stationId).subscribe((res) => {
      this.products[i] = res.data;
      this.cdr.detectChanges();
    });

    this.productService.getInfoProductOther(Number(productId)).subscribe((res) => {
      const productInfo: IInfoProduct = res.data;
      this.productFormArray.at(i).get('unit').patchValue(productInfo.unit);
      this.cdr.detectChanges();
    });
  }

  addItem() {
    this.productFormArray.push(
      this.fb.group({
        gasFieldId: ['', Validators.required],
        id: ['', Validators.required],
        unit: [''],
        amountRecommended: ['', [Validators.required, Validators.min(1)]]
      })
    );
  }

  deleteItem(index: number): void {
    this.productFormArray.removeAt(index);
    this.products = [...this.products].filter((_, i) => i !== index);
  }

  onSubmit() {
    this.requestForm.markAllAsTouched();
    this.reasonChange.markAllAsTouched();
    this.productForm.markAllAsTouched();
    if (this.requestForm.invalid || this.productForm.invalid || this.reasonChange.invalid) {
      return;
    }

    const productData = this.productForm.value.products.map((p) => ({
      ...p,
      amountRecommended: convertMoney(p.amountRecommended.toString()),
      id: Number(p.id),
      gasFieldId: Number(p.gasFieldId)
    }));

    if (this.dataDetail.status === 'WAIT_CONFIRM') {
      const dataReq = {
        stationId: Number(this.stationId),
        fullAddress: this.requestForm.get('fullAddress').value,
        expectedDate: convertDateToServer(this.requestForm.get('expectedDate').value),
        productInfoRequests: productData
      };

      this.inventoryManagementService.updateOrderRequest(dataReq, this.orderRequestId)
        .subscribe((res) => {
          if (res) {
            this.router.navigate(['/kho/yeu-cau-dat-hang']);
            this.toastr.success('Sửa yêu cầu đặt hàng thành công')
          }
        }, (err: IError) => {
          this.checkError(err);
        })
    } else {
      const dataReq = {
        reasonChange: this.reasonChange.value,
        productInfoRequests: productData
      };

      this.inventoryManagementService.changeOrderRequest(this.dataDetail.id, dataReq)
        .subscribe((res) => {
          if (res) {
            this.router.navigate(['/kho/yeu-cau-dat-hang']);
            this.toastr.success('Sửa yêu cầu đặt hàng thành công')
          }
        }, (err: IError) => {
          this.checkError(err);
        })
    }
  }

  checkError(error: IError) {
    if (error.code === 'SUN-OIL-4801') {
      this.toastr.error('Nhập lượng đề xuất nhỏ hơn 1,000,000,000');
    }
    if (error.code === 'SUN-OIL-4910') {
      this.toastr.error('Không tìm thầy thông tin đặt hàng');
    }

  }

  onBack() {
    this.router.navigate(['/kho/yeu-cau-dat-hang']);
  }
}
