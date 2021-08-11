import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { IConfirmModalData } from '../../../shared/models/confirm-delete.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DestroyService } from '../../../shared/services/destroy.service';
import { ContractService, IAddress, IProperties } from '../contract.service';
import { IRole, UserService } from '../../user/user.service';
import { takeUntil } from 'rxjs/operators';
import { IProductType, ProductService } from '../../product/product.service';

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

  TRANSPORT_METHOD: Array<IProperties>;
  TYPE_CONTRACT: Array<IProperties>;
  PAYMENT_METHOD_CONTRACT: Array<IProperties>;
  addressFull: string = '';
  totalInputDate: number = 0;
  contractForm: FormGroup;
  contractTypes = [
    {label: 'Trả trước', value: 'tra-truoc'},
    {label: 'Dự trù sản lượng', value: 'du-tru'}
  ]

  method: string = 'tra-truoc';

  get expectedDate() {
    return this.contractForm.get('expectedDate') as FormArray;
  }

  constructor(
    private contractService: ContractService,
    private productService: ProductService,
    private fb: FormBuilder,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService,
    private modalService: NgbModal
  ) {
    this.dataAddress = [];
    this.buildFormCustomer();
  }

  ngOnInit(): void {
    this.expirationDate();
    this.buildForm();
    this.getAddress();
    this.onChangeRadio();
    this.getProductType();
    this.getPropertiesTransport();
    this.getPropertiesContractType();
    this.getPropertiesPayment();
  }

  onChangeRadio() {
    this.contractForm.controls['contractMethod'].valueChanges.subscribe(value => {
      value == 'tra-truoc' ? this.method = 'tra-truoc' : this.method = 'du-tru';
      console.log(this.method);
      console.log(value);
    });
  }

  buildFormCustomer(): void {
    this.contractForm = this.fb.group({
      contractMethod: ['tra-truoc'],
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
    if (this.infoForm.getRawValue().phone === '0355162255') {
      console.log(this.infoForm.getRawValue());
      this.infoForm.controls.customer.patchValue('Phạm Công Toán');
      this.infoForm.controls.enterprise.patchValue('Công Ty TTC Solutions');
      this.infoForm.controls.brithday.patchValue('1998-11-25');
      this.infoForm.controls.idno.patchValue('036980055584');
      this.infoForm.controls.email.patchValue('toanpc@ttc-solution.com.vn');
      this.infoForm.controls.address.patchValue('31 Nguyễn Quốc Trị');
    } else {
      console.log('Số điện thoại không tồn tại trong hệ thống');
      this.infoForm.controls.customer.patchValue('');
      this.infoForm.controls.enterprise.patchValue('');
      this.infoForm.controls.brithday.patchValue('');
      this.infoForm.controls.idno.patchValue('');
      this.infoForm.controls.email.patchValue('');
      this.infoForm.controls.address.patchValue('');
    }
  }
  eventEnter(e) {
    return this.getInfoUser();
  }

// ^[0-9]+$
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

  // Lấy danh sách địa chỉ trạm xăng
  getAddress() {
    this.contractService.getAddress().subscribe((res) => {
      this.dataAddress = res.data;
    });
  }

  // Lấy danh sách nhóm sản phẩm
  getProductType(): void {
    this.productService.getListProductType().subscribe((res) =>{
      this.listProductType = res.data;
      console.log(this.listProductType);
    })
  }

  // Lấy ds loại hợp đồng
  getPropertiesContractType(): void {
    this.contractService.getProperties('TYPE_CONTRACT').subscribe((res) =>{
      this.TYPE_CONTRACT = res.data;
      console.log('TYPE_CONTRACT', this.TYPE_CONTRACT);
    })
  }

  // Lấy ds hệ thống giao nhận
  getPropertiesTransport(): void {
    this.contractService.getProperties('TRANSPORT_METHOD').subscribe((res) =>{
      this.TRANSPORT_METHOD = res.data;
      console.log('TRANSPORT_METHOD', this.TRANSPORT_METHOD);
    })
  }

  // Lấy ds HT thanh toán
  getPropertiesPayment(): void {
    this.contractService.getProperties('PAYMENT_METHOD_CONTRACT').subscribe((res) =>{
      this.PAYMENT_METHOD_CONTRACT = res.data;
      console.log('PAYMENT_METHOD_CONTRACT', this.PAYMENT_METHOD_CONTRACT);
    })
  }

  deleteNumberPhone(): void {
    const modalRef = this.modalService.open(ConfirmDeleteComponent, {
      backdrop: 'static'
    });
    const data: IConfirmModalData = {
      title: 'Xác nhận',
      message: `Nếu thay đổi số điện thoại, dữ liệu khách hàng sẽ thay đổi theo. Bạn có chắc chắn muốn thay đổi không?`,
      button: { class: 'btn-primary', title: 'Xác nhận' }
    };
    modalRef.componentInstance.data = data;

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

  checkError() {
    this.infoForm.get('phone').setErrors({ codeExisted: true });
  }

  addRow(): void {}
}
