import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { IConfirmModalData } from '../../../shared/models/confirm-delete.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DestroyService } from '../../../shared/services/destroy.service';
import { ContractService, IAddress } from '../contract.service';
import { ProductService } from '../../product/product.service';
import { IRole, UserService } from '../../user/user.service';
import { takeUntil } from 'rxjs/operators';

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
  totalPrice = 160000000000000000;

  constructor(
    private contractService: ContractService,
    private fb: FormBuilder,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService,
    private modalService: NgbModal
  ) {
    this.dataAddress = [];
  }

  ngOnInit(): void {
    this.expirationDate();
    this.buildForm();
    this.getAddress();
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
    // this.today = new Date().toISOString().split('T')[0];
    // document.getElementsByName('expirationDate')[0].setAttribute('min', this.today);
  }

  checkError() {
    this.infoForm.get('phone').setErrors({ codeExisted: true });
  }

  addRow(): void {}
}
