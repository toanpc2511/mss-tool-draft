import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DestroyService} from '../../../../shared/services/destroy.service';
import {ElectricService} from '../../shared/services/electric.service';
import {IError} from '../../../../shared/models/error.model';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {ultis} from '../../../../shared/utilites/function';
import {IAccountInfos, ICifSearch} from '../../shared/models/electric.interface';
import {BreadCrumbHelper} from '../../../../shared/utilites/breadCrumb-helper';

@Component({
  selector: 'app-register-transaction-auto-payment',
  templateUrl: './register-transaction-auto-payment.component.html',
  styleUrls: ['./register-transaction-auto-payment.component.scss']
})
export class RegisterTransactionAutoPaymentComponent implements OnInit {
  actions: ActionModel[] = [{
    actionName: 'Lưu thông tin',
    actionIcon: 'send',
    hiddenType: 'none',
    actionClick: () => this.onCreateTransaction()
  }];
  accNumbers: ICifSearch[];
  searchForm: FormGroup;
  infoForm: FormGroup;
  settleDates = ultis.calcRecurringPaymentDate();
  isEmailRequired = true;

  constructor(
    private fb: FormBuilder,
    private destroy$: DestroyService,
    private electricService: ElectricService,
    private notify: CustomNotificationService,
    private cdr: ChangeDetectorRef
  ) {
    this.initSearchForm();
    this.initInfoForm();
    this.infoForm.disable({ emitEvent: false});
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
      supplierCode: [null, [Validators.required]],
      customerId: ['', [Validators.required]],
    });
  }

  initInfoForm(): void {
    this.infoForm = this.fb.group({
      custName: [''],
      custId: [''],
      custDesc: [''],
      custType: [''],
      cif: ['', [Validators.required]],
      acNumber: [null, [Validators.required]],
      acName: [''],
      debitAccountPreBalance: [''],
      settleDate: [null, [Validators.required]],
      receiveEmail: [true],
      email: [null, [Validators.required, Validators.email]],
      phone: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'Thanh toán hóa đơn điện',
      'Thanh toán tự động',
      'Đăng ký thanh toán tự động'
    ]);
  }

  onChangeSearchForm(): void {
    this.infoForm.disable({emitEvent: false});
    this.initInfoForm();
    this.cdr.detectChanges();
  }

  changeCif(): void {
    this.accNumbers = [];
    this.infoForm.get('acNumber').reset();
  }

  get getValueSearchForm(): any {
    return this.searchForm.value;
  }

  onSearchCustomer(): void {
    this.searchForm.markAllAsTouched();
    if (this.searchForm.invalid) {
      return;
    }
    const params = {
      ...this.getValueSearchForm,
      serviceType: 'ELECTRIC_SERVICE'
    };
    this.electricService.searchCustomerNewRegister(params)
      .pipe()
      .subscribe((res) => {
        if (res.data) {
          this.infoForm.enable({onlySelf: true, emitEvent: true});
          this.infoForm.patchValue({
            custName: (res.data as IAccountInfos).customerInfo.custName,
            custId: (res.data as IAccountInfos).customerInfo.custId,
            custDesc: (res.data as IAccountInfos).customerInfo.custDesc,
            custType: (res.data as IAccountInfos).customerInfo.custType,
          });
          this.cdr.detectChanges();
        }
      }, (error: IError) => this.notify.handleErrors(error));
  }

  onSearchCif(): void {
    this.infoForm.get('cif').markAllAsTouched();
    if (this.infoForm.get('cif').invalid) {
      return;
    }
    const cifValue = this.infoForm.get('cif').value;
    this.electricService.getAccountCustomers(cifValue, 9999, 1)
      .subscribe((res) => {
        if (res.data) {
          this.accNumbers = res.data;
          this.infoForm.patchValue({
            acNumber: this.accNumbers[0],
          });
        }
      }, (error: IError) => this.notify.handleErrors(error));
  }

  onCreateTransaction(): void {
    this.searchForm.markAllAsTouched();
    this.infoForm.markAllAsTouched();
    if (this.infoForm.disabled) {
      this.notify.warning('Cảnh báo', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (this.searchForm.invalid || this.infoForm.invalid) {
      return;
    }
    const valueSearchForm = this.searchForm.value;
    const valueInfoForm = this.infoForm.value;
    const body = {
      acName: valueInfoForm.acNumber?.accountName,
      acNumber: valueInfoForm.acNumber?.accountNumber,
      branchCode: valueInfoForm.acNumber?.branchCode,
      cif: valueInfoForm.cif,
      custClass: valueInfoForm.acNumber?.custClass,
      customerInfo: {
        custDesc: valueInfoForm.custDesc,
        custId: valueInfoForm.custId,
        custName: valueInfoForm.custName,
        custType: valueInfoForm.custType,
        custMobile: '0',
      },
      email: valueInfoForm.email,
      phone: valueInfoForm.phone,
      paymentRule: '01',
      serviceType: 'ELECTRIC_SERVICE',
      settleDate: valueInfoForm.settleDate,
      supplierCode: valueSearchForm.supplierCode,
      sendMail: valueInfoForm.receiveEmail
    };
    this.electricService.createTransactionAutoPayment(body)
      .subscribe((res) => {
        if (res.data) {
          this.notify.success('Thông báo', 'Tạo mới thành công');
          this.initSearchForm();

          this.infoForm.disable({emitEvent: false});
          this.initInfoForm();
          this.cdr.detectChanges();
        }
      }, (error: IError) => this.notify.handleErrors(error));
  }

  onChangeEmail($event): void {
    this.isEmailRequired = $event.value;
    $event.value
      ? this.infoForm.controls.email.setValidators([Validators.required, Validators.email])
      : this.infoForm.controls.email.clearValidators();
    this.infoForm.controls.email.updateValueAndValidity();
  }
}
