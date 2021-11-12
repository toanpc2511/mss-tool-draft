import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IStationEployee } from '../../../history-of-using-points/history-of-using-points.service';
import { takeUntil } from 'rxjs/operators';
import { IGasFuel, InventoryManagementService } from '../../inventory-management.service';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { IInfoProduct, IProduct, ProductService } from 'src/app/modules/product/product.service';
import { ToastrService } from 'ngx-toastr';
import { IError } from '../../../../shared/models/error.model';
import { convertDateToServer, convertMoney } from '../../../../shared/helpers/functions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
  providers: [DestroyService, FormBuilder]
})
export class CreateOrderComponent implements OnInit {
  stationEmployee: Array<IStationEployee> = [];
  requestForm: FormGroup;
  productForm: FormGroup;
  productFormArray: FormArray;
  products: Array<Array<any>> = [];
  productFuels: IProduct[] = [];
  listGasField: IGasFuel[] = [];
  stationId: number;

  currentDate = moment().add({
    day: 1
  });
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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getStationEmployee();
    this.getListProductFuels();
    this.buildForm();
    this.buildProductForm();
    this.handleStationChange();
  }

  buildForm() {
    this.requestForm = this.fb.group({
      stationId: ['', Validators.required ],
      fullAddress: [{ value: '', disabled: true }],
      expectedDate: ['',Validators.required],
    })
  }

  buildProductForm() {
    this.productForm = this.fb.group({
      products: this.fb.array([
        this.fb.group({
          productId: ['', Validators.required],
          gasFieldId: ['', Validators.required],
          unit: [''],
          amountActually: ['', [Validators.required, Validators.min(1)]]
        })
      ])
    });

    this.productFormArray = this.productForm.get('products') as FormArray;
    this.cdr.detectChanges();
  }

  handleStationChange() {
    this.requestForm.get('stationId')
      .valueChanges.subscribe(() => {
        this.stationId = this.requestForm.get('stationId').value;
      this.buildProductForm();

      const itemStation = this.stationEmployee.find((x) => {
        return x.id === Number(this.stationId);
      })

      this.requestForm.get('fullAddress').patchValue(itemStation.address);
    })
  }

  getStationEmployee() {
    this.inventoryManagementService
      .getStationEmployee()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.stationEmployee = res.data;
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
      (p, index) => p.productId && i !== index && Number(p.productId) === Number(productId)
    );

    if (checkExisted) {
      this.toastr.error('Sản phẩm này đã được thêm');
      this.productFormArray.at(i).get('productId').patchValue('');
      return;
    }
    if (!productId) {
      this.productFormArray.at(i).get('unit').patchValue(0);
    }

    if (!this.stationId) {
      this.productFormArray.at(i).get('productId').patchValue('')
      this.toastr.error('Bạn chưa chọn trạm');
      return;
    }

    this.inventoryManagementService.getListGasFuel(productId, this.stationId).subscribe((res) => {
      this.listGasField = res.data;
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
        productId: ['', Validators.required],
        unit: [''],
        amountActually: ['', [Validators.required, Validators.min(1)]]
      })
    );
  }

  deleteItem(index: number): void {
    this.productFormArray.removeAt(index);
  }

  onSubmit() {
    this.requestForm.markAllAsTouched();
    this.productForm.markAllAsTouched();
    if (this.requestForm.invalid || this.productForm.invalid) {
      return;
    }

    const productData = this.productForm.value.products.map(
      (p) => ({
        ...p,
        amountActually: convertMoney(p.amountActually),
        id: Number(p.productId),
        gasFieldId: Number(p.gasFieldId)
      })
    );

    const dataReq = {
      stationId: Number(this.stationId),
      fullAddress: this.requestForm.get('fullAddress').value.toString(),
      expectedDate: convertDateToServer(this.requestForm.get('expectedDate').value),
      productInfoRequests: productData
    }

    this.inventoryManagementService.createOrderRequest(dataReq)
      .subscribe((res) => {
        if (res) {
          this.router.navigate(['/kho/yeu-cau-dat-hang']);
        }
      }), (err: IError) => {
      this.checkError(err);
    };
  }

  checkError(error: IError) {
    this.toastr.error(error.code)
  }

}