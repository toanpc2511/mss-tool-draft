import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  ACC_NAME_VIETTEL_POST,
  ACC_VIETTEL_POST,
  IDENTITY_DOC_TYPES,
  PAYMENT_TYPE,
  CURRENCIES, MONETARY_VALUE
} from '../../constants/viettel-post.constant';
import {ICifSearch, ITransaction} from '../../models/viettel-post.interface';
import * as moment from 'moment';
import {ultis} from '../../../../../shared/utilites/function';
import {IError} from '../../../../../system-configuration/shared/models/error.model';
import {CustomNotificationService} from '../../../../../shared/services/custom-notification.service';
import {DecimalPipe} from '@angular/common';
import {ViettelPostService} from '../../services/viettelpost.service';
import {ISupplierViettelPost} from '../../../../../system-configuration/shared/models/lvbis-config.interface';
import {merge} from 'rxjs';

@Component({
  selector: 'app-transaction-info',
  templateUrl: './transaction-info.component.html',
  styleUrls: ['./transaction-info.component.scss']
})
export class TransactionInfoComponent implements OnInit {
  @Input() type = '';
  @Input() rule = '';
  formPayment: FormGroup;
  paymentType = PAYMENT_TYPE;
  identityDocTypes = IDENTITY_DOC_TYPES;
  isTransfer: boolean;
  customerAccounts: ICifSearch[] = [];
  accSelected: ICifSearch;
  today = new Date();
  // bang ke TM
  crrMoneyListCurCode = '';
  CURRENCIES = CURRENCIES;
  isAddMoneyList = true;
  initPaperMoney = {
    denomination: null,
    quantity: null,
    total: [{value: null, disabled: true}],
  };

  constructor(
    private fb: FormBuilder,
    private viettelPostService: ViettelPostService,
    private notifyService: CustomNotificationService,
    private numberPipe: DecimalPipe,
    private cdr: ChangeDetectorRef,
  ) {
    this.initFormGroup();
  }

  ngOnInit(): void {
    this.isTransfer = false;
    if (this.type === 'view') {
      this.formPayment.disable();
    }
    this.paymentTypeChanges();
  }

  initFormGroup(): void {
    this.formPayment = this.fb.group({
      accountNumberCredit: [''],
      accountNameCredit: [''],
      paymentAmount: ['', [Validators.required]],
      paymentContent: [''],
      paymentType: ['NT01', Validators.required],
      identityDocType: [this.identityDocTypes[0].value],
      numberDocType: [''], // so Cif
      accountDebit: [null], // STK ghi no
      accountNameDebit: [''], // Ten TK ghi no
      accountBalance: [0],
      payerName: ['', Validators.required],
      payerGttt: ['', Validators.required],
      payerGtttDate: [ultis.formatDate(this.today)],
      moneyList: this.fb.array([]),
      moneyListSum: ['']
    });
    this.setInputBill();
  }

  setInputBill(): void {
    if (this.moneyList.length === 0) {
      const paperMoneyList = Array(11).fill({...this.initPaperMoney});
      paperMoneyList.forEach((paperMoney) => {
        this.moneyList.push(this.createMoneyForm(paperMoney));
      });
    }
    this.formPayment.get('moneyList').patchValue(MONETARY_VALUE);
    //#region watch moneyList
    this.formPayment.get('moneyList').valueChanges.subscribe((crrValue) => {
      if (this.isTransfer) {
        return;
      }
      const listValues = this.moneyList.getRawValue();
      const sum = listValues.reduce((acc, crr) => acc + Number(crr.total), 0);
      this.formPayment.get('moneyListSum').setValue(sum);
    });
  }

  paymentAmountChange(): void {
  }

  numberDocTypeChange(): void {
  }

  accountDebitChange(): void {
    console.log('accountDebitChange');
    const accNo = this.formPayment.get('accountDebit').value;
    if (accNo) {
      this.accSelected = this.customerAccounts.find((item) => item.accountNumber === accNo);
      this.formPayment.get('accountNameDebit').patchValue(this.accSelected.accountName);
      this.formPayment.get('accountBalance').patchValue(this.accSelected.acyCurr_Balance);
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
    this.viettelPostService.searchCifInfo(params)
      .subscribe((res) => {
        if (res.data) {
          this.customerAccounts = res.data;
          // this.cdr.detectChanges();
        }
      }, (error: IError) => this.notifyService.error('Thất bại', 'Không tìm thấy thông tin tài khoản'));
  }

  paymentTypeChanges(): void {
    this.formPayment.get('paymentType').valueChanges.subscribe((value) => {
      this.isTransfer = value === 'CT01';
      this.setRequired();
    });
  }

  setRequired(): void {
    if (this.isTransfer) {
      // set bat buoc nhap cho chuyen khoan
      this.formPayment.get('numberDocType').setValidators([Validators.required]);
      this.formPayment.get('accountDebit').setValidators([Validators.required]);
      this.formPayment.get('accountNameDebit').setValidators([Validators.required]);
      this.formPayment.get('payerName').setValidators(null);
      this.formPayment.get('payerGttt').setValidators(null);
      this.formPayment.get('payerGtttDate').setValidators(null);
    } else {
      // huy bat buoc nhap cho tien mat
      this.formPayment.get('numberDocType').setValidators(null);
      this.formPayment.get('accountDebit').setValidators(null);
      this.formPayment.get('accountNameDebit').setValidators(null);
      this.formPayment.get('payerName').setValidators([Validators.required]);
      this.formPayment.get('payerGttt').setValidators([Validators.required]);
      this.formPayment.get('payerGtttDate').setValidators([Validators.required]);
    }
    this.formPayment.get('numberDocType').updateValueAndValidity();
    this.formPayment.get('accountDebit').updateValueAndValidity();
    this.formPayment.get('accountNameDebit').updateValueAndValidity();
    this.formPayment.get('payerName').updateValueAndValidity();
    this.formPayment.get('payerGttt').updateValueAndValidity();
    this.formPayment.get('payerGtttDate').updateValueAndValidity();
  }

  getPaymentContent(billCode: string, dataBills: any): void {
    console.log('getPaymentContent-- ', billCode);
    const content = `${billCode}_dataBills`;
    this.formPayment.get('paymentContent').patchValue(content);
  }

  getToday(): string {
    return moment().format('yyyy-MM-DD');
  }

// gan gia tri vào form cho man View
  pathValueForm(data: ITransaction): void {
    this.isTransfer = data.paymentType === 'CT01';
    this.formPayment.patchValue({
      accountNumberCredit: data.transactionPostResponses[0].acNumber,
      accountNameCredit: data.trnName,
      paymentAmount: this.numberPipe.transform(data.totalAmount, '1.0'),
      paymentContent: data.trnDesc,
      paymentType: data.paymentType,
      identityDocType: this.identityDocTypes[0].value,
      numberDocType: data?.cif, // so Cif
      accountDebit: data?.accNumber, // STK ghi no
      accountNameDebit: data?.accName, // Ten TK ghi no
      accountBalance: data?.preBalance, // so du truoc GD
      payerName: data?.payerName,
      payerGttt: data?.payerGttt,
      payerGtttDate: moment(data?.payerGtttDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
      moneyList: data?.categoryCashResponses || [],
    });
  }

  // gan gia tri thong tin NCC
  pathValueSupplier(dataSupplier: ISupplierViettelPost, dataBills: any []): void {
    let contentFirst = dataSupplier.content;
    contentFirst = contentFirst.replace('${billCode}', dataBills[0].billCode);
    contentFirst = contentFirst.replace('${custId}', dataBills[0].custId);
    contentFirst = contentFirst.replace('${custName}', dataBills[0].custName);
    contentFirst = contentFirst.replace('${billAmount}', dataBills[0].billAmount);
    const content = contentFirst;
    this.formPayment.patchValue({
      accountNumberCredit: dataSupplier.accNo,
      accountNameCredit: dataSupplier.accName,
      paymentContent: content,
      paymentAmount: this.numberPipe.transform(dataBills[0].billAmount, '1.0'),
    });
  }

  // BANG KE TIEN MAT
  get moneyList(): FormArray {
    return this.formPayment.get('moneyList') as FormArray;
  }

  addMoneyType(): void {
    this.moneyList.push(this.createMoneyForm(this.initPaperMoney));
    setTimeout(() => {
      window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    }, 100);
  }

  createMoneyForm(till): FormGroup {
    const form = this.fb.group(till);
    form.get('total').disable();
    merge(
      form.get('denomination').valueChanges,
      form.get('quantity').valueChanges
    ).subscribe(() => {
      const crrDenomination = form.get('denomination').value;
      const crrQuantity = form.get('quantity').value;
      let total = crrDenomination * crrQuantity;
      if (crrDenomination === null || crrQuantity === null) {
        total = null;
      }
      form.get('total').setValue(total);
    });
    return form;
  }
}
