import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { merge } from 'rxjs';

import { distinctUntilChanged } from 'rxjs/operators';
import { LpbSignatureListComponent } from 'src/app/shared/components/lpb-signature-list/lpb-signature-list.component';
import { LpbIdentityCertificationComponent } from 'src/app/shared/components/lpb-identity-certification/lpb-identity-certification.component';
import {
  CHARGE_TYPES,
  CURRENCIES,
} from 'src/app/shared/constants/finance';

import {
  DOC_TYPES,
  DOC_TYPES_VI,
} from 'src/app/shared/constants/identity-certification';

import {
  Account,
  CustomerInfo,
  FeeCalculationData,
  FeeCalculationRequest,
  GetCustomerInfoInputType,
  Product
} from 'src/app/shared/models/common.interface';

import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import { PrettyMoneyPipe } from 'src/app/shared/pipes/prettyMoney.pipe';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { DateHelper } from 'src/app/shared/utilites/date-helper';
import { FilesHelper } from 'src/app/shared/utilites/files';
import { TextHelper } from 'src/app/shared/utilites/text';
import { DENOMINATIONS, PRODUCTS_TYPES, WITHDRAW_PRODUCTS, WITHDRAW_PRODUCTS_CODES } from '../../constants/withdraw-common';
import { WithdrawService } from '../../services/withdraw.service';

@Component({
  selector: 'app-withdraw-form',
  templateUrl: './withdraw-form.component.html',
  styleUrls: ['./withdraw-form.component.scss'],
})
export class WithdrawFormComponent implements OnInit, AfterViewInit {
  @Input('formGroup') form: FormGroup;
  @Input('disabledForm') disabledForm = false;

  @ViewChild('negotiatorDocIssueDate', { static: false })
  negDocIssueDate: LpbDatePickerComponent; // Ngày Cấp (Chủ tài khoản)
  @ViewChild('matTabGroup', { static: true }) matTabGroup;

  @ViewChild('lstSign', { static: false })
  lstSign: LpbSignatureListComponent;

  @ViewChild('lstIDCert', { static: false })
  lstIDCert: LpbIdentityCertificationComponent;

  FORM_VAL_ERRORS = {
    REQUIRED: 'required',
    NO_EXIST: 'noExist',
    NOT_MATCH_PROD: 'notMatchProd',
    FROZEN: 'frozen',
    NO_CR: 'noCr',
    NO_DR: 'NO_DR',
    UNDER_MIN: 'underMin',
    OVER_MAX: 'overMax',
    NOT_EXIST_ACC: 'notExistAcc',
    NOT_PERSONAL_ACC: 'notPersonalAcc',
    NOT_ENOUGH_CHARS: 'notEnoughChars',
    TOO_BIG: 'tooBig',
    NOT_IDENTIFIED: 'notIdentified'
  };

  userInfo: any;
  lstCif: CustomerInfo[] = [];
  lstProduct: Product[] = WITHDRAW_PRODUCTS;
  crrProduct: Product;
  lstAccount: Account[] = [];

  DOC_TYPES = [];
  CURRENCIES = CURRENCIES;
  FEE_TYPES = CHARGE_TYPES;

  initPaperMoney = {
    denomination: null,
    quantity: null,
    total: [{ value: null, disabled: true }],
  };
  isAddMoneyList = true;

  employeeName = null;

  feeCalData: FeeCalculationData;
  accountBranch = '';
  acnHoverText = '';
  disabledFeeType = {
    EXCLUDING: false,
    INCLUDING: false,
    FREE: false,
  };
  maxDate = new Date();
  crrMoneyListCurCode = null;

  //#region notChange
  constructor(
    private fb: FormBuilder,
    private withdrawService: WithdrawService,
    private cdr: ChangeDetectorRef,
    private customNotificationService: CustomNotificationService,
    private datePipe: DatePipe,
    private prettyMoneyPipe: PrettyMoneyPipe
  ) {
    this.DOC_TYPES = DOC_TYPES_VI.map((docType) => ({
      key: docType.code,
      value: docType.radioTxt,
    }));
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit(): void {
    if (this.form.get('negotiatorDocIssueDate').disabled) {
      this.negDocIssueDate.disable();
    }
    this.cdr.detectChanges();
  }

  initForm(): void {
    if (this.moneyList.length === 0) {
      const paperMoneyList = Array(5).fill({ ...this.initPaperMoney });
      paperMoneyList.forEach((paperMoney) => {
        this.moneyList.push(this.createMoneyForm(paperMoney));
      });
    }

    //#region watch accountBranchCode
    this.form
      .get('accountBranchCode')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((branchCode) => {
        if (this.disabledForm) {
          return;
        }
        this.getBranchInfo(branchCode);
      });
    //#endregion

    //#region watch moneyList
    this.form.get('moneyList').valueChanges.subscribe((crrValue) => {
      if (this.disabledForm) {
        return;
      }
      const listValues = this.moneyList.getRawValue();
      const sum = listValues.reduce((acc, crr) => acc + Number(crr.total), 0);
      this.form.get('moneyListSum').setValue(sum);
    });
    //#endregion

    //#region watch curCode
    this.form.get('curCode').valueChanges.subscribe((selectedValue) => {
      if (this.disabledForm) {
        return;
      }
      if (selectedValue === CURRENCIES.VND) {
        this.form.get('feeEx').setValue(null);
        this.form.get('feeVATEx').setValue(null);
      }

      const account = this.lstAccount.find(
        (acc) => acc.acn === this.form.get('acn').value?.trim()
      );
      if (account && this.checkAccMatchProduct(account)) {
        this.getFeeAndVAT((data: FeeCalculationData) => {
          this.updateFee();
          this.updateTotal();
        });
      }

      // if curCode is empty or same as crrMoneyListCurCode, not change moneyList
      if (!selectedValue || selectedValue === this.crrMoneyListCurCode) {
        return;
      }

      let newList = Array(5).fill({ ...this.initPaperMoney });

      if (DENOMINATIONS[selectedValue]) {
        newList = DENOMINATIONS[selectedValue]
          .sort((a, b) => b - a)
          .map((deno) => ({
            ...this.initPaperMoney,
            denomination: [deno],
            disableDeno: true,
          }));
        this.isAddMoneyList = false;
      } else {
        this.isAddMoneyList = true;
      }
      this.moneyList.clear();
      newList.forEach((paperMoney) => {
        this.moneyList.push(this.createMoneyForm({ ...paperMoney }));
      });

      // change moneyList curCode only when curCode is not null
      if (selectedValue) {
        this.crrMoneyListCurCode = selectedValue;
      }
    });
    //#endregion
  }
  getBranchInfo(branchCode: string): void {
    if (!branchCode) {
      this.accountBranch = '';
      return;
    }
    this.accountBranch = branchCode;
    this.withdrawService.getBranchInfo(branchCode).subscribe(
      (res) => {
        if (res && res.data?.[0]) {
          this.accountBranch += ' - ' + res.data[0].name;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getEmployeeInfo(employeeId: string, ignoreError: boolean = false): void {
    const handleError = (error?) => {
      if (!ignoreError) {
        this.employeeName = null;
        this.setFormError('employeeId', this.FORM_VAL_ERRORS.NO_EXIST);
      }
    };

    if (!employeeId) {
      handleError();
      return;
    }

    this.withdrawService.getEmployeeInfo(employeeId).subscribe(
      (res) => {
        if (res) {
          this.employeeName = res.data;
        } else {
          handleError();
        }
      },
      (error) => handleError(error),
      () => {}
    );
  }
  //#endregion

  setDocIssueDate(date: string): void {
    if (!date) {
      this.negDocIssueDate.clearDate();
      return;
    }
    try {
      let docIssueDateStr = null;
      let docIssueDate = DateHelper.getDateFromString(date);
      docIssueDateStr = this.datePipe.transform(docIssueDate, 'dd/MM/yyyy');

      this.negDocIssueDate.setValue(docIssueDateStr);
    } catch (error) {
      console.error(error);
    }
  }

  //#region notChange
  getRoundValue(roundType: string, value: number | string): number {
    if (value === null) {
      return null;
    }

    if (roundType === CURRENCIES.VND) {
      return Math.round(Number(value));
    } else {
      return Number(
        Math.round(Number(value.toString() + 'e+2')).toString() + 'e-2'
      );
    }
  }

  getFeeAndVAT(callback: (param: FeeCalculationData) => void): void {
    this.form.get('productCode').markAsTouched();
    this.form.get('transactionAmount').markAsTouched();
    this.form.get('acn').markAsTouched();

    const curCode = this.form.get('curCode').value;
    const productCode = this.form.get('productCode').value;
    const transactionAmount = this.form.get('transactionAmount').value;

    if (!this.crrProduct) {
      return;
    }

    const isAcnValid = this.form.get('acn').valid || this.disabledForm;
    const isAmountValid = this.form.get('transactionAmount').valid || this.disabledForm;
    if (!(productCode && curCode && transactionAmount && isAcnValid && isAmountValid)) {
      return;
    }

    const req: FeeCalculationRequest = {
      curCode,
      productCode,
      amount: transactionAmount,
      acn: this.form.get('acn').value?.trim(),
      branchCode: this.userInfo.branchCode,
    };

    this.withdrawService.getFee(req).subscribe(
      (res) => {
        if (res && res.data) {
          this.feeCalData = res.data;
          this.feeCalData.feeItems = res.data.feeItems.map((item) => ({
            curCode: item.curCode,
            feeAmount: this.getRoundValue(item.curCode, item.feeAmount),
            feeAmountMin: this.getRoundValue(item.curCode, item.feeAmountMin),
            feeAmountMax: this.getRoundValue(item.curCode, item.feeAmountMax),
            vat: this.getRoundValue(item.curCode, item.vat),
            vatMin: this.getRoundValue(item.curCode, item.vatMin),
            vatMax: this.getRoundValue(item.curCode, item.vatMax),
          }));
          this.feeCalData.exchangeRate = Number(res.data.exchangeRate);

          const feeAmountMin = Number(res.data.feeItems[0].feeAmountMin);
          const feeAmountMax = Number(res.data.feeItems[0].feeAmountMax);

          if (!this.disabledForm) {
            // If feeAmountMin = 0 then set feeType is FREE
            if (feeAmountMin === 0) {
              this.form.get('feeType').setValue(this.FEE_TYPES.FREE);
            }
          }

          callback(res.data);
        } else {
          this.feeCalData = null;
        }
      },
      (error) => {
        this.feeCalData = null;
        this.customNotificationService.error('Thông báo', error?.message);
      }
    );
  }

  updateTotal(): void {
    let totalWithdrawAmount = this.form.get('transactionAmount').value;
    let fee = Number(this.form.get('fee').value);
    let vat = Number(this.form.get('feeVAT').value);

    if (this.form.get('curCode').value !== 'VND') {
      fee = Number(this.form.get('feeEx').value);
      vat = Number(this.form.get('feeVATEx').value);
    }
    if (this.form.get('feeType').value === CHARGE_TYPES.INCLUDING) {
      totalWithdrawAmount -= fee + vat;
    }
    this.form.get('totalWithdrawAmount').setValue(totalWithdrawAmount);
  }

  updateFee(): void {
    const feeItemVND = this.feeCalData.feeItems.find(
      (item) => item.curCode === CURRENCIES.VND
    );
    if (feeItemVND) {
      const fee = this.getRoundValue(CURRENCIES.VND, feeItemVND.feeAmount);
      const feeVAT = this.getRoundValue(CURRENCIES.VND, feeItemVND.vat);
      this.form.get('fee').setValue(fee);
      this.form.get('feeVAT').setValue(feeVAT);
    }

    const feeItemEx = this.feeCalData.feeItems.find(
      (item) => item.curCode !== CURRENCIES.VND
    );
    if (feeItemEx) {
      const feeEx = this.getRoundValue('EX', feeItemEx.feeAmount);
      const feeVATEx = this.getRoundValue('EX', feeItemEx.vat);
      this.form.get('feeEx').setValue(feeEx);
      this.form.get('feeVATEx').setValue(feeVATEx);
    }
  }

  updateFeeTypeDisabled(product: Product): void{
     if (product?.code === WITHDRAW_PRODUCTS_CODES.RT03){
      this.disabledFeeType.FREE = false;
      this.disabledFeeType.INCLUDING = true;
      this.disabledFeeType.EXCLUDING = true;
      this.form.get('feeType').setValue(CHARGE_TYPES.FREE);
     }
     else {
      this.disabledFeeType.INCLUDING = false;
      this.disabledFeeType.EXCLUDING = false;
    }
  }

  changeProduct(event: string): void {
    const crrValue = event;
    this.crrProduct = this.lstProduct.find(
      (product) => product.code === crrValue.trim()
    );

    const account = this.lstAccount.find(
      (acc) => acc.acn === this.form.get('acn').value?.trim()
    );

    if (account && this.checkAccMatchProduct(account)) {
      this.getFeeAndVAT((data: FeeCalculationData) => {
        this.updateFeeTypeDisabled(this.crrProduct);
        this.updateFee();
        this.updateTotal();
      });
    } else {
      this.updateFeeTypeDisabled(this.crrProduct);
    }
  }

  updateFeeValidation(type: 'fee' | 'feeEx', crrFee: number): void {
    if (!this.feeCalData) {
      return;
    }
    const feeItem = this.feeCalData.feeItems.find((item) => {
      if (type === 'fee') {
        return item.curCode === CURRENCIES.VND;
      } else {
        return item.curCode !== CURRENCIES.VND;
      }
    });

    if (feeItem.feeAmountMin !== 0 && crrFee < Number(feeItem.feeAmountMin)) {
      this.setFormError(
        type,
        this.FORM_VAL_ERRORS.UNDER_MIN,
        `Phí chưa đủ mức phí tối thiểu:  ${this.prettyMoneyPipe.transform(feeItem.feeAmountMin)}`
      );
      return;
    } else {
      this.clearFormError(type, this.FORM_VAL_ERRORS.UNDER_MIN);
    }

    if (feeItem.feeAmountMax !== 0 && crrFee > Number(feeItem.feeAmountMax)) {
      this.setFormError(
        type,
        this.FORM_VAL_ERRORS.OVER_MAX,
        `Phí vượt mức phí tối đa: ${this.prettyMoneyPipe.transform(feeItem.feeAmountMax)}`
      );
      return;
    } else {
      this.clearFormError(type, this.FORM_VAL_ERRORS.OVER_MAX);
    }
  }

  updateVATValidation(type: 'feeVAT' | 'feeVATEx', crrFee: number): void {
    if (!this.feeCalData) {
      return;
    }
    const feeItem = this.feeCalData.feeItems.find((item) => {
      if (type === 'feeVAT') {
        return item.curCode === CURRENCIES.VND;
      } else {
        return item.curCode !== CURRENCIES.VND;
      }
    });

    if (feeItem.vatMin !== 0 && crrFee < Number(feeItem.vatMin)) {
      this.setFormError(
        type,
        this.FORM_VAL_ERRORS.UNDER_MIN,
        `VAT chưa đủ mức vat tối thiểu: ${this.prettyMoneyPipe.transform(feeItem.vatMin)}`
      );
      return;
    } else {
      this.clearFormError(type, this.FORM_VAL_ERRORS.UNDER_MIN);
    }

    if (feeItem.vatMax !== 0 && crrFee > Number(feeItem.vatMax)) {
      this.setFormError(
        type,
        this.FORM_VAL_ERRORS.OVER_MAX,
        `VAT vượt mức vat tối đa: ${this.prettyMoneyPipe.transform(feeItem.vatMax)}`
      );
      return;
    } else {
      this.clearFormError(type, this.FORM_VAL_ERRORS.OVER_MAX);
    }
  }

  updateTransAmountFeeAndVATValidation(): void {
    let transactionAmount = this.form.get('transactionAmount').value;
    let fee = Number(this.form.get('fee').value);
    let vat = Number(this.form.get('feeVAT').value);

    if (this.form.get('curCode').value !== 'VND') {
      fee = Number(this.form.get('feeEx').value);
      vat = Number(this.form.get('feeVATEx').value);
    }
    if (
      this.form.get('feeType').value === CHARGE_TYPES.INCLUDING &&
      transactionAmount < fee + vat
    ) {
      this.setFormError(
        'transactionAmount',
        this.FORM_VAL_ERRORS.OVER_MAX,
        'Số tiền giao dịch nhỏ hơn mức phí và VAT'
      );
    } else {
      this.clearFormError('transactionAmount', this.FORM_VAL_ERRORS.OVER_MAX);
    }
  }

  changeFeeType(): void {
    this.updateTotal();
    this.updateTransAmountFeeAndVATValidation();
  }

  changeFee(e: number): void {
    const fee = e;
    const newFeeVAT = this.getRoundValue(CURRENCIES.VND, (fee * 10) / 100);
    this.form.get('feeVAT').setValue(newFeeVAT);

    if (this.feeCalData?.exchangeRate) {
      const newFeeEx = this.getRoundValue(
        'EX',
        e / Number(this.feeCalData.exchangeRate)
      );
      const newFeeVATEx = this.getRoundValue('EX', (newFeeEx * 10) / 100);
      this.form.get('feeVATEx').setValue(newFeeVATEx);
      this.form.get('feeEx').setValue(newFeeEx);
    }

    this.updateTotal();
    this.updateFeeValidation('fee', e);
    this.updateTransAmountFeeAndVATValidation();
  }

  changeFeeEx(e: number): void {
    const feeEx = e;
    const newFeeVATEx = this.getRoundValue('EX', (feeEx * 10) / 100);
    this.form.get('feeVATEx').setValue(newFeeVATEx);

    if (this.feeCalData?.exchangeRate) {
      const newFee = this.getRoundValue(
        CURRENCIES.VND,
        e * Number(this.feeCalData.exchangeRate)
      );
      const newFeeVAT = this.getRoundValue(CURRENCIES.VND, (newFee * 10) / 100);
      this.form.get('feeVAT').setValue(newFeeVAT);
      this.form.get('fee').setValue(newFee);
    }

    this.updateTotal();
    this.updateFeeValidation('feeEx', e);
    this.updateTransAmountFeeAndVATValidation();
  }

  changeFeeVAT(e: number): void {
    if (this.feeCalData?.exchangeRate) {
      const newFeeVATEx = this.getRoundValue(
        'EX',
        e / Number(this.feeCalData.exchangeRate)
      );;
      this.form.get('feeVATEx').setValue(newFeeVATEx);
    }
    this.updateTotal();
    this.updateVATValidation('feeVAT', e);
    this.updateTransAmountFeeAndVATValidation();
  }

  changeFeeVATEx(e: number): void {
    if (this.feeCalData?.exchangeRate) {
      const newFeeVAT = this.getRoundValue(
        CURRENCIES.VND,
        e * Number(this.feeCalData.exchangeRate)
      );
      this.form.get('feeVAT').setValue(newFeeVAT);
    }
    this.updateTotal();
    this.updateVATValidation('feeVATEx', e);
    this.updateTransAmountFeeAndVATValidation();
  }

  blurChangeFeeAndVAT(
    type: 'fee' | 'feeEx' | 'feeVAT' | 'feeVATEx',
    e: number
  ) {
    if (type === 'fee' || type === 'feeEx') {
      this.updateFeeValidation(type, e);
    } else {
      this.updateVATValidation(type, e);
    }
    this.updateTotal();
    this.updateTransAmountFeeAndVATValidation();
  }

  changeTransactionAmount(e: number): void {
    this.getFeeAndVAT((data: FeeCalculationData) => {
      this.updateFee();
      this.updateTotal();
      this.updateTransAmountFeeAndVATValidation();
    });
    this.form.get('totalAmount').setValue(e);
  }

  getCustomerInfo(
    controlName: 'docNum' | 'cifNo' | 'acn',
    txtSearch: string,
    callback?: (data: CustomerInfo[]) => void,
    callbackError?: (error: any) => void
  ): void {
    txtSearch = txtSearch?.trim();
    let inputType: GetCustomerInfoInputType = 'acn';
    switch (controlName) {
      case 'cifNo': {
        inputType = 'cif';
        break;
      }
      case 'docNum': {
        inputType = 'gtxm';
        break;
      }
    }

    this.lstCif = []; // reset cif list
    const control = this.form.get(controlName);
    this.withdrawService.getCustomerInfo(txtSearch, inputType).subscribe(
      (res) => {
        if (res && res.data?.length) {
          if (controlName === 'docNum') {
            if (res.data.length > 1) {
              this.lstCif = res.data;
              this.loadCustomerInfo(null, controlName);
            } else {
              this.loadCustomerInfo(res.data[0], controlName);
            }
          }
          // cif & acn
          else {
            this.loadCustomerInfo(res.data[0], controlName);
          }
          if (callback) {
            callback(res.data);
          }
        } else {
          this.setFormError(controlName, this.FORM_VAL_ERRORS.NO_EXIST);
          this.loadCustomerInfo(null, controlName);
        }
      },
      (error) => {
        this.loadCustomerInfo(null, controlName);

        if (error?.code.match(/400/g)) {
          this.setFormError(controlName, this.FORM_VAL_ERRORS.NO_EXIST);
        } else {
          this.customNotificationService.error('Thông báo', error.message);
        }

        if (callbackError) {
          callbackError(error);
        }
      },
      () => {}
    );
  }

  changeCIF(event: { target: HTMLInputElement } | string): void {
    if (!event) {
      return;
    }
    if (typeof event !== 'string') {
      const cif = event.target.value?.toString()?.trim();

      if (cif) {
        this.getCustomerInfo('cifNo', cif);
      }
    } else {
      const selectedInfo = this.lstCif.find((info) => info.cifNo === event);
      if (selectedInfo) {
        this.loadAccountInfo(); // reset account Info
        this.loadCustomerInfo(selectedInfo, 'cifNo');
      }
    }
  }

  changeIdentityCode(event: Event & { target: HTMLInputElement }): void {
    if (!event) {
      return;
    }
    const docNumControl = this.form.get('docNum');

    if (
      !docNumControl.hasError(this.FORM_VAL_ERRORS.REQUIRED) &&
      docNumControl.value
    ) {
      const docNum = event.target.value?.toString().trim();
      this.getCustomerInfo('docNum', docNum);
    }
  }

  changeAccNumber(event: { target: HTMLInputElement } | string): void {
    if (!event) {
      return;
    }
    if (typeof event !== 'string') {
      const acn = event.target.value.toString()?.trim();
      const acnControl = this.form.get('acn');

      if (!acnControl.hasError(this.FORM_VAL_ERRORS.REQUIRED)) {
        if (acn.length < 12) {
          this.setFormError(
            'acn',
            this.FORM_VAL_ERRORS.NOT_ENOUGH_CHARS,
            'Số tài khoản phải 12 kí tự'
          );
          return;
        } else {
          this.clearFormError('acn', this.FORM_VAL_ERRORS.NOT_ENOUGH_CHARS);
        }
        if (acn) {
          this.getCustomerInfo('acn', acn, (data) => {
            if (data[0].accounts.length > 0) {
              this.getFeeAndVAT(() => {
                this.updateFee();
                this.updateTotal();
              });
            }
          });
        } else {
          this.loadCustomerInfo(null, 'cifNo');
        }
      }
    } else {
      const selectedAccount = this.lstAccount.find(
        (acc) => acc.acn === event.trim()
      );
      if (selectedAccount) {
        this.loadAccountInfo(selectedAccount, 'acn');
        this.getFeeAndVAT(() => {
          this.updateFee();
          this.updateTotal();
        });
      }
    }
  }

  changeTellerCode(event: Event & { target: HTMLInputElement }): void {
    const employeeIdCtrl = this.form.get('employeeId');

    if (
      !employeeIdCtrl.hasError(this.FORM_VAL_ERRORS.REQUIRED) &&
      employeeIdCtrl.value
    ) {
      const employeeId = event.target.value?.toString().trim();
      this.getEmployeeInfo(employeeId);
    }
  }

  onAccInputChange(event: Event & { target: HTMLInputElement }): void {
    const crrAcn = event.target.value;
    if (!crrAcn) {
      this.loadCustomerInfo(null, 'acn');
    }
  }

  onCifNoInputChange(event: Event & { target: HTMLInputElement }): void {
    const crrCifNo = event.target.value;
    const employeeIdCtrl = this.form.get('employeeId');
    if (!crrCifNo) {
      this.loadCustomerInfo(null, 'cifNo');
      this.clearFormError('employeeId', this.FORM_VAL_ERRORS.NO_EXIST);
    }
  }

  onEmployeeIdInputChange(event: Event & { target: HTMLInputElement }): void {
    const crrEmployeeID = event.target.value;
    if (!crrEmployeeID) {
      this.employeeName = null;
    }
  }

  onNegDocNumInputChange(event: Event & { target: HTMLInputElement }): void{
    const negDocNum = event.target?.value?.trim();
    if (this.form.get('docNum').value !== negDocNum){
      this.form.get('negotiatorDocIssueDate').setValue(null);
      this.setDocIssueDate(null);
    }
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

  get moneyList(): FormArray {
    return this.form.get('moneyList') as FormArray;
  }
  //#endregion

  clearOptionControl(controlName: 'cifNo' | 'acn'): void {
    switch (controlName) {
      case 'acn': {
        this.acnHoverText = '';
        this.form.get('acn').setValue(null);
        this.form.get('accountBranchCode').setValue(null);
        this.form.get('note').setValue(`RUT TIEN TU SO TK`);
        this.form.get('curCode').setValue(null);
        break;
      }
      case 'cifNo': {
        const docNum = this.form.get('docNum').value;
        const docType = this.form.get('docType').value;
        const docIssueDate = this.form.get('negotiatorDocIssueDate').value;
        const docIssuePlace = this.form.get('negotiatorDocIssuePlace').value;
        this.loadCustomerInfo({ docNum, docType, docIssueDate, docIssuePlace });
        break;
      }
    }
  }

  clearTextControl(): void {
    this.loadCustomerInfo();
  }

  loadCustomerInfo(
    customerInfo?: Partial<CustomerInfo>,
    ignoreControlName?: string
  ): void {
    this.lstSign.startFetching(customerInfo?.cifNo);
    this.lstIDCert.startFetching(customerInfo?.cifNo);
    if (!(ignoreControlName && ignoreControlName === 'cifNo')) {
      this.form.get('cifNo').setValue(customerInfo?.cifNo || null);
    }

    if (customerInfo?.identificationType === 'O') {
      this.setFormError('cifNo', this.FORM_VAL_ERRORS.NOT_IDENTIFIED);
    } else {
      this.clearFormError('cifNo', this.FORM_VAL_ERRORS.NOT_IDENTIFIED);
    }

    if (!(ignoreControlName && ignoreControlName === 'docNum')) {
      this.form.get('docNum').setValue(customerInfo?.docNum || null);
    }

    customerInfo = TextHelper.objectLatinNormalize(customerInfo);

    const negDocNumControl = this.form.get('negotiatorDocNum');
    const negDocTypeControl = this.form.get('negotiatorDocType');
    const negFullNameCtrl = this.form.get('negotiatorFullName');
    const negPhoneControl = this.form.get('negotiatorPhone');
    const negAddrCtrl = this.form.get('negotiatorAddress');

    const docTypeRecord = DOC_TYPES_VI.find(
      (doc) => doc.noneMark === customerInfo?.docType
    );
    this.form.get('docType').setValue(docTypeRecord?.code || DOC_TYPES.CCCD);

    this.form.get('customerName').setValue(customerInfo?.fullName || null);
    this.form.get('docIssueDate').setValue(customerInfo?.docIssueDate || null);

    if (!this.disabledForm) {
      negFullNameCtrl.setValue(customerInfo?.fullName || null);
      negDocNumControl.setValue(customerInfo?.docNum || null);
      negDocTypeControl.setValue(docTypeRecord?.code || DOC_TYPES.CCCD);
      negPhoneControl.setValue(customerInfo?.phoneNumber || null);
      negAddrCtrl.setValue(customerInfo?.address || null);

      this.form
        .get('negotiatorDocIssueDate')
        .setValue(customerInfo?.docIssueDate || null);
      this.setDocIssueDate(customerInfo?.docIssueDate || null);

      this.form
        .get('negotiatorDocIssuePlace')
        .setValue(customerInfo?.docIssuePlace?.toUpperCase());
    }

    if (customerInfo?.accounts && customerInfo?.accounts?.length === 0) {
      if (ignoreControlName) {
        this.setFormError(
          ignoreControlName,
          this.FORM_VAL_ERRORS.NOT_EXIST_ACC
        );
      }
    } else {
      this.clearFormError(
        ignoreControlName,
        this.FORM_VAL_ERRORS.NOT_EXIST_ACC
      );
    }

    if (customerInfo?.accounts && customerInfo?.accounts?.length > 0) {
      if (customerInfo.accounts.length === 1) {
        const account = customerInfo.accounts[0];
        this.loadAccountInfo(account, ignoreControlName); // load the first one
      } else {
        this.loadAccountInfo(null, ignoreControlName); //reset with ignoring
      }
      this.lstAccount = customerInfo.accounts;
    } else {
      this.lstAccount = [];
      this.loadAccountInfo(null, ignoreControlName); //reset with ignoring
    }
  }

  //#region notChange
  checkAccMatchProduct(account: Account): boolean {
    const acnControl = this.form.get('acn');

    if (!(this.crrProduct?.type && account?.curCode)) {
      return true;
    }

    if (this.crrProduct?.type !== PRODUCTS_TYPES.ALL) {
      const checkDomesticMatch =
        this.crrProduct?.type === PRODUCTS_TYPES.DOMESTIC &&
        account?.curCode === CURRENCIES.VND;

      const checkForeignMatch =
        this.crrProduct?.type === PRODUCTS_TYPES.FOREIGN &&
        account?.curCode !== CURRENCIES.VND;

      if (!(checkDomesticMatch || checkForeignMatch)) {
        this.setFormError('acn', this.FORM_VAL_ERRORS.NOT_MATCH_PROD);
        return false;
      }
    }

    this.clearFormError('acn', this.FORM_VAL_ERRORS.NOT_MATCH_PROD);
    return true;
  }
  //#endregion

  fetchAccountBalance(acn: string) {
    if (acn) {
      this.withdrawService.getBalance(acn).subscribe(
        (res) => {
          let balance = Number(res?.data.avalBal);
          balance = balance > 0 ? balance : 0;
          this.form.get('availableBalance').setValue(balance);
        },
        (error) => {
          this.customNotificationService.error('Thông báo', error?.message);
        }
      );
    } else {
      this.form.get('availableBalance').setValue(null);
    }
  }

  loadAccountInfo(account?: Account, ignoreControlName?: string): void {
    if (account) {
      this.checkAccMatchProduct(account);
      if (account.noDrStatus === 'Y') {
        this.setFormError('acn', this.FORM_VAL_ERRORS.NO_DR);
      } else if (account.frozenStatus === 'Y') {
        this.setFormError('acn', this.FORM_VAL_ERRORS.FROZEN);
      }
    }

    if (account) {
      this.acnHoverText =
        account.acn + ' - ' + account.accountName + ' - ' + account.curCode;
    } else {
      this.acnHoverText = '';
    }

    this.form.get('accountName').setValue(account?.accountName || null);
    this.fetchAccountBalance(account?.acn);
    this.lstSign.startFetching(account?.acn, 'acn');

    if (this.disabledForm) {
      return;
    }

    if (!(ignoreControlName && ignoreControlName === 'acn')) {
      this.lstAccount = [];
      this.form.get('acn').setValue(account?.acn || null);
    }

    this.form
      .get('accountBranchCode')
      .setValue(account?.accountBranchCode || null);

    this.form.get('note').setValue(`RUT TIEN TU SO TK ${account?.acn || ''}`);

    if (this.form.get('curCode').value !== account?.curCode) {
      this.form.get('curCode').setValue(account?.curCode || null);
    }
  }


  docIssueDateChange(validateOnly?: boolean): void {
    const negotiatorDocIssueDateControl = this.form.get('negotiatorDocIssueDate');

    if (!this.negDocIssueDate.haveValue()) {
      this.negDocIssueDate.setErrorMsg('Ngày cấp không được bỏ trống');
      negotiatorDocIssueDateControl.setValue(null);
    } else if (!this.negDocIssueDate.haveValidDate()) {
      this.negDocIssueDate.setErrorMsg('Ngày cấp không hợp lệ');
      negotiatorDocIssueDateControl.setValue(null);
      return;
    } else {
      this.negDocIssueDate.setErrorMsg('');
      if (
        !validateOnly &&
        negotiatorDocIssueDateControl.value !== this.negDocIssueDate.getValue()
      ) {
        negotiatorDocIssueDateControl.setValue(this.negDocIssueDate.getValue());
        this.updateIssuePlace();
      }
    }
  }

  changeNegDocType(event: Event & { target: HTMLInputElement }): void{
    const negDocType = event.target?.value?.trim();
    if (this.form.get('docType').value !== negDocType){
      this.form.get('negotiatorDocIssueDate').setValue(null);
      this.setDocIssueDate(null);
    };
    this.updateIssuePlace();
  }

  updateIssuePlace(): void{
    const negDocIssueDateStr = this.form.get('negotiatorDocIssueDate').value;
    const negotiatorDocType = this.form.get('negotiatorDocType').value;
    const negDocPlaceCtrl = this.form.get('negotiatorDocIssuePlace');

    if (this.disabledForm){
      return;
    }

    if (!negotiatorDocType){
      negDocPlaceCtrl.setValue('');
      return;
    }

    switch (negotiatorDocType) {
      case DOC_TYPES.CCCD: {
        const lowDate = moment('01/01/2016', 'DD/MM/YYYY').toDate();
        const highDate = moment('10/10/2018', 'DD/MM/YYYY').toDate();
        if (!negDocIssueDateStr) {
          negDocPlaceCtrl.setValue('');
          return;
        }
        const negDocIssueDate = moment(
          negDocIssueDateStr,
          'DD/MM/YYYY'
        ).toDate();
        if (negDocIssueDate >= lowDate && negDocIssueDate < highDate) {
          negDocPlaceCtrl.setValue('CCS ĐKQL CT VA DLQG VE DC');
        } else if (negDocIssueDate >= highDate) {
          negDocPlaceCtrl.setValue('CCS QLHC VE TTXH');
        } else {
          negDocPlaceCtrl.setValue('');
        }
        break;
      }

      case DOC_TYPES.CMND: {
        let txt = `CONG AN ${this.userInfo?.cityName}`;
        txt = TextHelper.latinNormalize(txt);
        negDocPlaceCtrl.setValue(txt.toUpperCase());
        break;
      }

      case DOC_TYPES.PASSPORT: {
        negDocPlaceCtrl.setValue(`CUC QUAN LY XNC`);
        break;
      }

      default: {
        negDocPlaceCtrl.setValue('');
      }
    }
  }

  //#region notChange
  validateForm(): boolean {
    this.form.markAllAsTouched();
    this.docIssueDateChange(true);

    if (this.form.invalid) {
      const feeControls = ['fee', 'feeVAT', 'feeEx', 'feeVATEx'];
      const errorControls = Object.keys(this.form.controls).filter(
        (controlName) => {
          const errors = this.form.get(controlName)?.errors;
          return errors ? Object.keys(errors).length > 0 : false;
        }
      );

      const onlyFeeTblInvalid = errorControls.every((controlName) =>
        feeControls.some((feeTblCtrl) => feeTblCtrl === controlName)
      );
      const isFree = this.form.get('feeType').value === CHARGE_TYPES.FREE;
      if (onlyFeeTblInvalid && isFree) {
        return true;
      }

      const errorElements = document.querySelectorAll(
        '.ng-invalid[formControlName],.input-error'
      );
      let firstErrorEle: Element;

      for(let index = 0; index < errorElements.length; index++){
        const ele = errorElements.item(index);
        const isInput = ele.tagName === 'INPUT';
        const name = isInput ? (<HTMLInputElement>ele).name : '';
         if (!(isFree && feeControls.includes(name))){
          firstErrorEle = ele;
          break;
        }
      }
      if (firstErrorEle) {
        firstErrorEle.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    return true;
  }

  onMatTabChanged(): void {
    // make tap Scroll to Top
    const ntvEl = this.matTabGroup.nativeElement;
    const myTopnav = document.getElementById('myTopnav');
    const yOffset = -((myTopnav?.offsetHeight || 120) + 10);
    const y = ntvEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
    // make Scroll to Top
  }

  addMoneyType(): void {
    this.moneyList.push(this.createMoneyForm(this.initPaperMoney));
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  }

  disableForm(): void {
    this.form.disable({ emitEvent: false });
    this.moneyList.disable({ emitEvent: false });
    this.negDocIssueDate.disable();
  }
  //#endregion

  enableForm(): void {
    const defaultDisableControlList = [
      'accountBranchCode',
      'curCode',
      'docType',
      'totalAmount',
    ];

    this.negDocIssueDate.enable();

    Object.keys(this.form.controls || {}).forEach((key) => {
      if (!defaultDisableControlList.includes(key) && key !== 'moneyList') {
        this.form.controls[key].enable({ emitEvent: false });
      }
    });

    this.moneyList.controls.forEach((control) => {
      control.get('quantity').enable({ emitEvent: false });
      control.get('denomination').enable({ emitEvent: false });
    });
  }

  //#region notChange
  downloadFile(b64Data: string, contentType: string, fileName: string): void {
    FilesHelper.downLoadFromBase64({ b64Data, contentType, fileName });
  }

  getFirstError(controlName: string): string {
    const errors = this.form.get(controlName)?.errors;
    return Object.keys(errors)[0];
  }

  setFormError(controlName: string, errorName: string, message?: string): void {
    let newErrors = {};
    newErrors[errorName] = message ? { message } : true;

    if (this.form.get(controlName)?.errors) {
      newErrors = { ...newErrors, ...this.form.get(controlName).errors };
    }
    this.form.get(controlName).setErrors(newErrors);
    this.form.get(controlName).markAsTouched();
  }

  clearFormError(controlName: string, errorName: string): void {
    const crrErrors = this.form.get(controlName)?.errors;
    if (crrErrors?.[errorName]) {
      const newErrors = {};
      Object.keys(crrErrors || {})
        .filter((key) => key !== errorName)
        .forEach((key) => {
          newErrors[key] = crrErrors[key];
        });
      this.form.get(controlName).setErrors(newErrors);
      if (Object.keys(newErrors || {})) {
        this.form.get(controlName).updateValueAndValidity();
      }
    }
  }
  //#endregion
}
