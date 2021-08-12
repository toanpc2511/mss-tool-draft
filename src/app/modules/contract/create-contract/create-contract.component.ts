import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { IConfirmModalData } from '../../../shared/models/confirm-delete.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DestroyService } from '../../../shared/services/destroy.service';
import { ContractService, IAddress, IProperties } from '../contract.service';
import { concatMap, debounceTime, startWith, take, takeUntil, tap } from 'rxjs/operators';
import { IProduct, IProductType, ProductService } from '../../product/product.service';
import { combineLatest, Observable, of } from 'rxjs';
import { IError } from '../../../shared/models/error.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-contract',
  templateUrl: './create-contract.component.html',
  styleUrls: ['./create-contract.component.scss'],
  providers: [DestroyService, FormBuilder]
})
export class CreateContractComponent implements OnInit {
  today;
  infoForm: FormGroup;
  dataAddress: Array<IAddress> = [];
  listProductType: Array<IProductType> = [];
  totalPrice = 160000000000000000;

  dataProduct;
  productForm: FormGroup;
  areaProduct: string = '';
  dataInfoUser;
  data = [];
  TRANSPORT_METHOD: Array<IProperties>;
  TYPE_CONTRACT: Array<IProperties>;
  PAYMENT_METHOD_CONTRACT: Array<IProperties>;
  addressFull: string = '';
  totalInputDate: number = 0;
  contractForm: FormGroup;

  method: number = 3;

  get expectedDate() {
    return this.contractForm.get('expectedDate') as FormArray;
  }

  constructor(
    private contractService: ContractService,
    private productService: ProductService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
    this.dataAddress = [];
    this.buildFormCustomer();
    this.buildFromProduct();
  }

  ngOnInit(): void {
    this.init();
    const address$ = this.contractForm
      .get('contractAddress')
      .valueChanges.pipe(startWith(0), takeUntil(this.destroy$)) as Observable<number>;

    combineLatest([address$])
      .pipe(
        debounceTime(300),
        concatMap(([addressId]) =>
          of({
            addressId
          })
        ),
        tap((data) => {
          const provinceName = this.dataAddress.find((p) => p.id === Number(data.addressId))?.fullAddress;
          this.areaProduct = this.dataAddress.find((p) => p.id === Number(data.addressId))?.areaType;
          this.contractForm.get('fullAddress').patchValue(provinceName);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.productService.getListProductType()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.listProductType = res.data;
        this.cdr.detectChanges();
      })

    this.productForm.controls['productType']
      .valueChanges.pipe(
      concatMap((categoryId: number) => {
        this.dataProduct = [];
        return this.productService.getListProduct(categoryId);
      }),
      tap((res) => {
        this.dataProduct = res.data;
        this.cdr.detectChanges();
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    this.productForm.controls['productName']
      .valueChanges.pipe(
      concatMap((productId: number) => {
        this.contractForm.controls['contractAddress'].markAllAsTouched();
        if (this.contractForm.controls['contractAddress'].invalid) {
          return
        } else {
          return this.productService.getPriceProduct(productId, this.areaProduct);
        }
      }),
      tap((res) => {
        this.cdr.detectChanges();
      }),
      takeUntil(this.destroy$)
    ).subscribe();

  }

  init() {
    this.expirationDate();
    this.buildForm();
    this.getAddress();
    this.onChangeRadio();
    this.getPropertiesTransport();
    this.getPropertiesContractType();
    this.getPropertiesPayment();
  }

  onChangeRadio() {
    this.contractForm.controls['contractMethod'].valueChanges.subscribe(value => {
      value == 3 ? this.method = 3 : this.method = 4;
      this.contractForm.controls['contractAddress'].patchValue('');
      this.contractForm.controls['fullAddress'].patchValue('');
      this.contractForm.controls['limit'].patchValue('');
      this.contractForm.controls.expectedDate.reset();
    });
  }

  buildForm(): void {
    this.infoForm = this.fb.group({
      phone: ['', [Validators.required]],
      customer: ['', Validators.required],
      enterprise: ['', Validators.required],
      brithday: [''],
      idno: ['', Validators.required],
      email: [''],
      address: ['', Validators.required]
    });
  }

  buildFromProduct(): void {
    this.productForm = this.fb.group({
      productType: ['', [Validators.required]],
      productName: ['', [Validators.required]],
      amount: ['', [Validators.required]]
    })
  }

  buildFormCustomer(): void {
    this.contractForm = this.fb.group({
      contractMethod: ['3'],
      contractName: ['', Validators.required],
      expirationDate: [''],
      transportMethod: [''],
      paymentMethod: ['', Validators.required],
      limit: [''],
      contractAddress: ['', Validators.required],
      fullAddress: [''],
      expectedDate: this.fb.array([
        this.fb.control('')
      ])
    })
  }

  addExpectedDate() {
    this.expectedDate.push(this.fb.control(''));
    console.log(this.expectedDate.controls.length);
    this.totalInputDate = this.expectedDate.controls.length;
  }

  getInfoUser(): void {
    const dataPhone = this.infoForm.getRawValue().phone;
    if (dataPhone !== '') {
      this.contractService.getInfoUser(dataPhone)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
            this.dataInfoUser = res.data;
            this.infoForm.controls['customer'].patchValue(this.dataInfoUser.name);
            this.infoForm.controls['enterprise'].patchValue(this.dataInfoUser.enterpriseName);
            this.infoForm.controls['brithday'].patchValue(this.dataInfoUser.dateOfBirth);
            this.infoForm.controls['idno'].patchValue(this.dataInfoUser.idCard);
            this.infoForm.controls['email'].patchValue(this.dataInfoUser.email);
            this.infoForm.controls['address'].patchValue(this.dataInfoUser.address);
            this.cdr.detectChanges();
        },
          ((error: IError) => {
            this.checkError(error);
          }))
    }
  }

  // Lấy danh sách địa chỉ trạm xăng
  getAddress() {
    this.contractService.getAddress().subscribe((res) => {
      this.dataAddress = res.data;
    });
  }

  // Lấy ds loại hợp đồng
  getPropertiesContractType(): void {
    this.contractService
      .getProperties('TYPE_CONTRACT')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) =>{
        this.TYPE_CONTRACT = res.data;
        this.cdr.detectChanges();
    })
  }

  // Lấy ds hệ thống giao nhận
  getPropertiesTransport(): void {
    this.contractService
      .getProperties('TRANSPORT_METHOD')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) =>{
        this.TRANSPORT_METHOD = res.data;
        this.cdr.detectChanges();
    })
  }

  // Lấy ds HT thanh toán
  getPropertiesPayment(): void {
    this.contractService
      .getProperties('PAYMENT_METHOD_CONTRACT')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) =>{
        this.PAYMENT_METHOD_CONTRACT = res.data;
        this.cdr.detectChanges();
    })
  }

  deleteNumberPhone(): void {
    const modalRef = this.modalService.open(ConfirmDeleteComponent, {
      backdrop: 'static'
    });
    modalRef.componentInstance.data = {
      title: 'Xác nhận',
      message: `Nếu thay đổi số điện thoại, dữ liệu khách hàng sẽ thay đổi theo. Bạn có chắc chắn muốn thay đổi không?`,
      button: { class: 'btn-primary', title: 'Xác nhận' }
    };

    modalRef.result.then((result) => {
      if (result) {
        this.clearFormInfoCustomer();
      }
    });
  }

  clearFormInfoCustomer(): void {
    this.infoForm.reset();
  }

  deleteProduct(): void {
    console.log();
  }

  expirationDate(): void {
    this.today = new Date().toISOString().split('T')[0];
    document.getElementsByName('expirationDate')[0].setAttribute('min', this.today);
    // document.getElementsByName('expectedDate')[0].setAttribute('min', this.today);
  }

  checkError(err: IError) {
    if (err.code === 'SUN-OIL-4811') {
      this.toastr.error('Số điện thoại không thuộc Việt Nam hoặc sai định dạng');
    }
    if (err.code === 'SUN-OIL-4821') {
      this.toastr.error('Không tìm thấy thông tin tài xế với số điện thoại này');
    }
  }

  formatMoney(n) {
    if (n !== '' && n >= 0) {
      return  (Math.round(n * 100) / 100).toLocaleString().split('.').join(',');
    }
  }

  addRow(): void {}
}
