import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IAgent, ICifSearch, ITransaction} from '../../models/vietlott.interface';
import {
  ACC_NAME_VIETLOTT, ACC_VIETLOTT,
  IDENTITY_DOC_TYPES,
  NOTE,
  PAYMENT_METHODS,
  PAYMENT_TYPE, VALUE_CODES,
  WARN
} from '../../constants/vietlott.constant';
import {IError} from '../../../../../system-configuration/shared/models/error.model';
import {VietlottService} from '../../services/vietlott.service';
import {CustomNotificationService} from '../../../../../shared/services/custom-notification.service';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-transaction-info',
  templateUrl: './transaction-info.component.html',
  styleUrls: ['./transaction-info.component.scss']
})
export class TransactionInfoComponent implements OnInit {
  @Input() type = '';
  formPayment: FormGroup;
  note = NOTE;
  warn = WARN;
  identityDocTypes = IDENTITY_DOC_TYPES;
  paymentMethods = PAYMENT_METHODS;
  paymentType = PAYMENT_TYPE;
  customerAccounts: ICifSearch[] = [];
  accSelected: ICifSearch;
  init = false;
  isLoading = false;
  transferFirst = false;
  isTransfer = false;

  constructor(
    private fb: FormBuilder,
    private vietlottService: VietlottService,
    private notifyService: CustomNotificationService,
    private numberPipe: DecimalPipe,
  ) {
    this.initFormGroup();
  }

  ngOnInit(): void {
    if (this.type === 'view') {
      this.formPayment.disable();
    }
    this.paymentTypeChanges();
    this.formPayment.get('paymentMethod').disable();

  }

  paymentAmountChange(): void {
    const amount = Number(this.formPayment.get('paymentAmount').value.split('.').join(''));
    if (amount < 1000000) {
      this.notifyService.error('Lỗi', 'Số tiền cần lớn hơn hoặc bằng 1 triệu đồng');
      this.formPayment.get('paymentAmount').patchValue('');
    }
  }

  initFormGroup(): void {
    this.formPayment = this.fb.group({
      accountNumberCredit: [''],
      accountNameCredit: [ACC_NAME_VIETLOTT],
      paymentAmount: ['', [Validators.required, Validators.minLength(9)]],
      paymentContent: ['', Validators.required],
      paymentType: ['NT01', Validators.required],
      paymentMethod: ['NVL1', Validators.required],
      identityDocType: [this.identityDocTypes[0].value],
      numberDocType: [''], // so Cif
      accountDebit: [null], // STK ghi no
      accountNameDebit: [''], // Ten TK ghi no
      accountBalance: [''],
    });
  }

  paymentTypeChanges(): void {
    this.formPayment.get('paymentType').valueChanges.subscribe(() => {
      if (this.formPayment.get('paymentType').value === VALUE_CODES.PAYMENTTYPE_TM) {
        this.isTransfer = false;
        this.formPayment.get('paymentMethod').patchValue('NVL1');
      } else {
        this.isTransfer = true;
        this.formPayment.get('paymentMethod').patchValue('CK');
      }
      this.setRequired();
    });
  }

  setRequired(): void {
    if (this.isTransfer) {
      // set bat buoc nhap cho chuyen khoan
      this.formPayment.get('numberDocType').setValidators([Validators.required]);
      this.formPayment.get('accountDebit').setValidators([Validators.required]);
      this.formPayment.get('accountNameDebit').setValidators([Validators.required]);
    } else {
      // huy bat buoc nhap cho tien mat
      this.formPayment.get('numberDocType').setValidators(null);
      this.formPayment.get('accountDebit').setValidators(null);
      this.formPayment.get('accountNameDebit').setValidators(null);
    }
    this.formPayment.get('numberDocType').updateValueAndValidity();
    this.formPayment.get('accountDebit').updateValueAndValidity();
    this.formPayment.get('accountNameDebit').updateValueAndValidity();
  }

  // thay doi so Cif
  numberDocTypeChange(): void {
    this.formPayment.get('accountDebit').patchValue(null);
    this.formPayment.get('accountNameDebit').patchValue(null);
    this.formPayment.get('accountBalance').patchValue(null);
    this.customerAccounts = [];
  }

  accountDebitChange(): void {
    const accNo = this.formPayment.get('accountDebit').value;
    if (accNo) {
      this.accSelected = this.customerAccounts.find((item) => item.accountNumber === accNo);
      this.formPayment.get('accountNameDebit').patchValue(this.accSelected.accountName);
      this.formPayment.get('accountBalance').patchValue(this.accSelected.acyCurr_Balance);
      // Tim kiem so du kha dung theo STK
      // this.vietlottService.searchAccountInfo(accNo)
      //   .subscribe((res) => {
      //     if (res.data) {
      //       this.formPayment.get('accountBalance').patchValue(res.data);
      //     }
      //   }, (error: IError) => this.notifyService.error('Thất bại', 'Không tìm thấy thông tin tài khoản'));
    }
  }

  // Tim kiem STK theo so cif
  searchAccNumberSpecial(): void {
    this.formPayment.controls.numberDocType.markAllAsTouched();
    if (this.formPayment.controls.numberDocType.invalid) {
      return;
    }
    const numCif = this.formPayment.get('numberDocType').value;
    this.formPayment.get('numberDocType').setErrors(null);
    const params = {customerCifNumber: numCif, pageNumber: 1, recordPerPage: 9999};
    this.vietlottService.searchCifInfo(params)
      .subscribe((res) => {
        if (res.data) {
          this.customerAccounts = res.data;
          // this.cdr.detectChanges();
        }
      }, (error: IError) => this.notifyService.error('Thất bại', 'Không tìm thấy thông tin tài khoản'));
  }

  // gan gia tri vào form cho man View
  pathValueForm(data: ITransaction): void {
    this.isTransfer = data.productCode === VALUE_CODES.CASH ? false : true;
    this.formPayment.patchValue({
      accountNumberCredit: data.partnerAccNo,
      accountNameCredit: data.partnerAccName,
      paymentAmount: this.numberPipe.transform(data.amount, '1.0'),
      paymentContent: data.trnDesc,
      paymentType: this.isTransfer ? VALUE_CODES.PAYMENTTYPE_CK : VALUE_CODES.PAYMENTTYPE_TM,
      paymentMethod: data.productCode,
      identityDocType: this.identityDocTypes[0].value,
      numberDocType: data?.cusNo, // so Cif
      accountDebit: data?.accNo, // STK ghi no
      accountNameDebit: data?.accDesc, // Ten TK ghi no
      accountBalance: data?.accAvaiBalance, // so du truoc GD
    });
  }

  // gan gia tri thong tin dai ly
  pathValueAgent(data: IAgent): void {
    this.formPayment.patchValue({
      accountNumberCredit: data.accountCore,
      accountNameCredit: [ACC_NAME_VIETLOTT], // data.accName,
    });
  }
}
