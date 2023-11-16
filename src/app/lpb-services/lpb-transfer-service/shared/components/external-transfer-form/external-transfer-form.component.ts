import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap } from 'rxjs/operators';

import {
  Account,
  CustomerInfo,
  FeeCalculationData,
  FeeCalculationRequest,
} from 'src/app/shared/models/common.interface';

import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';
import {
  CURRENCIES,
  DOC_TYPES_VI,
  FEE_TYPES,
  FORM_CONTROL_NAMES,
  FORM_VAL_ERRORS,
} from '../../constants/common';
import { CalculationHelper } from '../../helpers/calculation.helper';
import { Product } from '../../models/common';
import { OnUpdateFeeTableEmitParams } from '../fee-table/fee-table.component';

import { LpbSignatureListComponent } from 'src/app/shared/components/lpb-signature-list/lpb-signature-list.component';
import { InternalTransferService } from '../../services/internal/internal-transfer.service';

type GetCustomerInfoParams = {
  input: 'cif' | 'acn';
  txtSearch: string;
  controlName?: string;
  callback?: (data: CustomerInfo[]) => void;
};

@Component({
  selector: 'app-external-transfer-form',
  templateUrl: './external-transfer-form.component.html',
  styleUrls: [
    './external-transfer-form.component.scss',
    '../../styles/lpb-transfer-form.scss',
  ],
})
export class ExternalTransferFormComponent implements OnInit {
  @Input('formGroup') form: FormGroup;
  @Input('disabledForm') disabledForm = false;
  @Input('isCurrentAcc') isCurrentAcc = false;
  @Input('lstProduct') lstProduct: Product[];
  @Input('transferType') transferType: 'CITAD' | 'NAPAS' = 'CITAD';
  @Input('warning') warning = {};

  @ViewChild('lstSign', { static: false })
  lstSign: LpbSignatureListComponent;

  @Output() changeCustomerInfo = new EventEmitter<CustomerInfo>();

  FEE_TYPES = FEE_TYPES;
  DOC_TYPES = [];
  CURRENCIES = CURRENCIES;

  feeCalData: FeeCalculationData;
  ctrlNames = FORM_CONTROL_NAMES;
  FORM_VAL_ERRORS = FORM_VAL_ERRORS;

  userInfo: any;
  acnBranch = '';
  acnHoverText = '';

  crrAccountInfo: Account;
  crrCustomerInfo: CustomerInfo;
  accountingNote: string;

  minLength = {
    [this.ctrlNames.SENDER.acn]: 12,
  };

  maxlength = {
    [this.ctrlNames.OTHERS.accountingNote]: 210,
  };

  senderInfoStyle = '';
  recipientInfoStyle = '';

  feeTypeList = [
    { key: this.FEE_TYPES.FREE, text: 'Miễn phí' },
    { key: this.FEE_TYPES.INCLUDING, text: 'Phí trong' },
    { key: this.FEE_TYPES.EXCLUDING, text: 'Phí ngoài' },
  ];
  showAccountingNote: boolean = false;

  constructor(
    private internalTransferService: InternalTransferService,
    private customNotificationService: CustomNotificationService
  ) {
    this.DOC_TYPES = DOC_TYPES_VI.map((docType) => ({
      key: docType.code,
      value: docType.radioTxt,
    }));
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }


  ngOnInit() {
    if (this.transferType === 'NAPAS') {
      this.senderInfoStyle = 'col col-lg-8 col-md-6 col-sm-12 col-12';
      this.recipientInfoStyle = 'col col-lg-4 col-md-6 col-sm-12 col-12';
      this.feeTypeList = this.feeTypeList.filter(
        (item) => item.key !== this.FEE_TYPES.INCLUDING
      );
      this.showAccountingNote = false;
    } else {
      this.senderInfoStyle = 'col col-lg-6 col-md-6 col-sm-12 col-12';
      this.recipientInfoStyle = this.senderInfoStyle;
      this.showAccountingNote = true;
      this.form
        .get(this.ctrlNames.OTHERS.accountingNote)
        .valueChanges.pipe()
        .subscribe((note) => {
          this.accountingNote = note;
          this.form.get(this.ctrlNames.OTHERS.accountingNote).markAsTouched();
        });
    }

    //#region watch productCode
    this.form
      .get(this.ctrlNames.OTHERS.productCode)
      .valueChanges.subscribe((code: string) => {
        if (this.form.get(this.ctrlNames.OTHERS.productCode).disabled) {
          return;
        }
        const crrProduct = this.getCrrProduct();
        this.form.get(this.ctrlNames.OTHERS.note).setValue(crrProduct?.name);

        const account = this.crrAccountInfo;
        if (account) {
          this.getFeeAndVAT((data: FeeCalculationData) => {
            this.updateFee();
            this.updateTotal();
          });
        }
      });
    //#endregion

    //#region watch branchCode
    this.form
      .get(this.ctrlNames.SENDER.branchCode)
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((branchCode) => {
        this.getBranchInfo(branchCode);
      });
    //#endregion
  }

  getBranchInfo(branchCode: string): void {
    if (!branchCode) {
      this.acnBranch = '';
      return;
    }

    this.acnBranch = branchCode;
    this.internalTransferService.getBranchInfo(branchCode).subscribe(
      (res) => {
        if (res && res.data?.[0]) {
          this.acnBranch +=' - ' + res.data[0].name;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  //#region fee
  updateFee(): void {
    const feeItemVND = this.feeCalData.feeItems.find(
      (item) => item.curCode === CURRENCIES.VND
    );
    if (feeItemVND) {
      const fee = CalculationHelper.getRoundValue(
        CURRENCIES.VND,
        feeItemVND.feeAmount
      );
      const feeVAT = CalculationHelper.getRoundValue(
        CURRENCIES.VND,
        feeItemVND.vat
      );
      this.form.get('fee').setValue(fee);
      this.form.get('feeVAT').setValue(feeVAT);
    }
  }

  updateTotal(): void {
    let totalAmount = this.form.get('transactionAmount').value;
    let fee = Number(this.form.get('fee').value);
    let vat = Number(this.form.get('feeVAT').value);

    if (this.form.get('feeType').value === FEE_TYPES.EXCLUDING) {
      totalAmount += fee + vat;
    }
    this.form.get('totalAmount').setValue(totalAmount);
  }

  updateTransAmountFeeAndVATValidation(): void {
    let transactionAmount = this.form.get(
      this.ctrlNames.OTHERS.transactionAmount
    ).value;
    let fee = Number(this.form.get(this.ctrlNames.OTHERS.fee).value);
    let vat = Number(this.form.get(this.ctrlNames.OTHERS.feeVAT).value);

    if (
      this.form.get('feeType').value === FEE_TYPES.INCLUDING &&
      transactionAmount < fee + vat
    ) {
      this.setFormError(
        'transactionAmount',
        this.FORM_VAL_ERRORS.OVER_MAX,
        'Tổng mức phí và VAT lớn hơn số tiền giao dịch'
      );
    } else {
      if(this.validateTransactionAmount(transactionAmount)){
        this.clearFormError('transactionAmount', this.FORM_VAL_ERRORS.OVER_MAX);
      }
    }
  }

  changeFeeType(event): void {
    this.updateTotal();
    this.updateTransAmountFeeAndVATValidation();
  }

  onUpdateFeeTable(params: OnUpdateFeeTableEmitParams) {
    this.updateTotal();
    this.updateTransAmountFeeAndVATValidation();
  }
  //#endregion

  changeTransactionAmount(e: number): void {
    if(this.validateTransactionAmount(e)){
      this.getFeeAndVAT((data: FeeCalculationData) => {
        this.updateFee();
        this.updateTotal();
        this.updateTransAmountFeeAndVATValidation();
      });
    }
  }

  validateTransactionAmount(amount: number){
    if (amount >= 5e8 && this.transferType === 'NAPAS') {
      this.setFormError(
        this.ctrlNames.OTHERS.transactionAmount,
        this.FORM_VAL_ERRORS.OVER_MAX,
        'Số tiền chuyển không được >= 500 triệu đồng'
      );
      return false;
    } else {
      this.clearFormError(
        this.ctrlNames.OTHERS.transactionAmount,
        this.FORM_VAL_ERRORS.OVER_MAX,
      );
      return true;
    }
  }

  clearFormError(controlName: string, errorName: string): void {
    FormHelpers.clearFormError({
      control: controlName,
      errorName,
      form: this.form,
    });
  }

  setFormError(controlName: string, errorName: string, message?: string): void {
    FormHelpers.setFormError({
      control: controlName,
      errorName,
      message,
      form: this.form,
    });
  }

  getCustomerInfo(params: GetCustomerInfoParams): void {
    let { txtSearch, input, callback, controlName } = params;
    txtSearch = txtSearch?.trim();

    this.internalTransferService
      .getCustomerInfo(txtSearch, input)
      .pipe(
        catchError((error: any) => {
          if (error?.code.match(/400/g)) {
            return of(null);
          } else {
            return of(error);
          }
        }),
        switchMap((res): Observable<CustomerInfo[]> => {
          if (res && res?.data && res?.data?.length) {
            if (input === 'acn' && res.data[0].accounts.length === 0) {
              return throwError(FORM_VAL_ERRORS.NO_EXIST);
            }
            return of(res.data);
          } else {
            if(res?.code){
              const error = res;
              return throwError(error);
            }
            return throwError(FORM_VAL_ERRORS.NO_EXIST);
          }
        })
      )
      .subscribe(
        (data) => {
          this.loadCustomerInfo(data[0], controlName);
          this.clearFormError(controlName, this.FORM_VAL_ERRORS.NO_EXIST);
          if (callback) {
            callback(data);
          }
        },
        (error) => {
          this.loadCustomerInfo(null, controlName);

          if (error === FORM_VAL_ERRORS.NO_EXIST) {
            this.setFormError(controlName, this.FORM_VAL_ERRORS.NO_EXIST);
          } else {
            this.customNotificationService.error('Thông báo', error.message);
          }

          if (callback) {
            callback(null);
          }
        },
        () => {}
      );
  }

  loadCustomerInfo(customerInfo?: CustomerInfo, ignoreControlName?: string) {
    this.crrCustomerInfo = customerInfo;
    this.changeCustomerInfo.emit(customerInfo);
    const cifControlName = this.ctrlNames.SENDER.cif;

    this.lstSign.startFetching(customerInfo?.cifNo);
    if (!(ignoreControlName && ignoreControlName === cifControlName)) {
      this.form.get(cifControlName).setValue(customerInfo?.cifNo || null);
    }

    if (customerInfo?.accounts && customerInfo?.accounts?.length === 0) {
      this.setFormError(cifControlName, FORM_VAL_ERRORS.NOT_EXIST_ACC);
    } else {
      this.clearFormError(cifControlName, FORM_VAL_ERRORS.NOT_EXIST_ACC);
    }

    this.form
      .get(this.ctrlNames.SENDER.name)
      .setValue(customerInfo?.fullName || null);

    this.form
      .get(this.ctrlNames.SENDER.address)
      .setValue(customerInfo?.address || null);

    this.form
      .get(this.ctrlNames.SENDER.addressLine1)
      .setValue(customerInfo?.addressLine1 || null);

    this.form
      .get(this.ctrlNames.SENDER.addressLine2)
      .setValue(customerInfo?.addressLine2 || null);

    this.form
      .get(this.ctrlNames.SENDER.addressLine3)
      .setValue(customerInfo?.addressLine3 || null);

    this.form
      .get(this.ctrlNames.SENDER.addressLine4)
      .setValue(customerInfo?.addressLine4 || null);

    if(this.disabledForm){
      return;
    }

    if (customerInfo?.accounts && customerInfo?.accounts?.length > 0) {
      if (customerInfo.accounts.length === 1) {
        const account = customerInfo.accounts[0];
        this.loadAccountInfo(account, ignoreControlName);
      } else {
        this.loadAccountInfo(null, ignoreControlName);
      }
    } else {
      this.loadAccountInfo(null, ignoreControlName);
    }
  }

  updateAccountBalance(acn) {
    if (acn) {
      this.internalTransferService.getBalance(acn).subscribe(
        (res) => {
          let balance = Number(res?.data.overdraftAvalBal);
          balance = balance > 0 ? balance : 0;
          this.form.get(this.ctrlNames.SENDER.balance).setValue(balance);
        },
        (error) => {
          this.customNotificationService.error('Thông báo', error?.message);
        }
      );
    } else {
      this.form.get(this.ctrlNames.SENDER.balance).setValue(null);
    }
  }

  loadAccountInfo(account: Account, ignoreControlName?: string): void {
    this.crrAccountInfo = account;
    let hoverText = '';
    if (account) {
      hoverText =
        account.acn + ' - ' + account.accountName + ' - ' + account.curCode;
    }

    const acnControlName = this.ctrlNames.SENDER.acn;
    const branchControlName = this.ctrlNames.SENDER.branchCode;
    const curCodeControlName = this.ctrlNames.SENDER.curCode;
    this.acnHoverText = hoverText;

    this.lstSign.startFetching(account?.acn, 'acn');

    if (!(ignoreControlName && ignoreControlName === acnControlName)) {
      this.form.get(acnControlName).setValue(account?.acn || null);
    }

    if (account) {
      if (account.noDrStatus === 'Y') {
        this.setFormError(acnControlName, this.FORM_VAL_ERRORS.NO_DR);
      } else if (account.frozenStatus === 'Y') {
        this.setFormError(acnControlName, this.FORM_VAL_ERRORS.FROZEN);
      }
    }

    if (account?.curCode && account?.curCode !== CURRENCIES.VND) {
      this.setFormError(acnControlName, this.FORM_VAL_ERRORS.NOT_MATCH_CURCODE);
    } else {
      this.clearFormError(
        acnControlName,
        this.FORM_VAL_ERRORS.NOT_MATCH_CURCODE
      );
    }

    this.form
      .get(this.ctrlNames.SENDER.accountName)
      .setValue(account?.accountName || null);

    this.updateAccountBalance(account?.acn);

    if (this.disabledForm) {
      return;
    }

    this.form
      .get(branchControlName)
      .setValue(account?.accountBranchCode || null);

    this.form.get(curCodeControlName).setValue(account?.curCode || null);
  }

  getCrrProduct(): Product {
    const productCode = this.form.get(this.ctrlNames.OTHERS.productCode).value;
    return this.lstProduct.find((prod) => prod.code === productCode);
  }

  onAccInputChange(event: Event & { target: HTMLInputElement }) {
    const acn = event.target.value;
    if (!acn) {
      this.loadAccountInfo(null);
    }
  }

  changeAcn(event: { target: HTMLInputElement } | string) {
    if (!event) {
      return;
    }

    const controlName = this.ctrlNames.SENDER.acn;
    if (typeof event !== 'string') {
      const acn = event.target.value.toString()?.trim();

      if (
        !this.form.get(controlName).hasError(this.FORM_VAL_ERRORS.REQUIRED) &&
        !this.form.get(controlName).hasError(this.FORM_VAL_ERRORS.MIN_LENGTH)
      ) {
        this.getCustomerInfo({
          input: 'acn',
          txtSearch: acn,
          controlName,
          callback: (data) => {
            if (data?.[0]?.accounts?.length > 0) {
              this.getFeeAndVAT(() => {
                this.updateFee();
                this.updateTotal();
              });
            }
          },
        });
      }
    } else {
      const selectedAccount = this.crrCustomerInfo?.accounts?.find(
        (acc) => acc.acn === event.trim()
      );
      this.loadAccountInfo(selectedAccount, controlName);
      if(selectedAccount){
        this.getFeeAndVAT(() => {
          this.updateFee();
          this.updateTotal();
        });
      }
    }
  }

  changeCif(event: Event & { target: HTMLInputElement }) {
    const controlName = this.ctrlNames.SENDER.cif;
    const cifNo = event.target.value.toString()?.trim();

    if (!this.form.get(controlName).hasError(this.FORM_VAL_ERRORS.REQUIRED)) {
      this.getCustomerInfo({
        input: 'cif',
        txtSearch: cifNo,
        controlName,
      });
    }
  }

  onCifInputChange(event: Event & { target: HTMLInputElement }) {
    const cif = event.target.value;
    if (!cif) {
      this.loadCustomerInfo(null);
    }
  }

  getFeeAndVAT(
    callback?: (param: FeeCalculationData) => void,
    callbackError?: (data: any) => void
  ): void {
    const acnCtrl = this.form.get(this.ctrlNames.SENDER.acn);
    const curCodeCtrl = this.form.get(this.ctrlNames.SENDER.curCode);
    const productCodeCtrl = this.form.get(this.ctrlNames.OTHERS.productCode);
    const transactionAmountCtrl = this.form.get(
      this.ctrlNames.OTHERS.transactionAmount
    );

    productCodeCtrl.markAsTouched();
    transactionAmountCtrl.markAsTouched();
    acnCtrl.markAsTouched();

    const curCode = curCodeCtrl.value;
    const productCode = productCodeCtrl.value;
    const transactionAmount = transactionAmountCtrl.value;
    const isAcnValid = acnCtrl.valid || this.disabledForm;
    const isAmountValid = transactionAmountCtrl.valid || this.disabledForm;

    if (!(productCode && curCode && isAcnValid && isAmountValid)) {
      return;
    }

    const req: FeeCalculationRequest = {
      curCode,
      productCode,
      amount: transactionAmount,
      acn: acnCtrl.value?.trim(),
      branchCode: this.userInfo.branchCode,
    };

    this.internalTransferService.getFee(req).subscribe(
      (res) => {
        if (res && res.data) {
          this.feeCalData = CalculationHelper.parseNumberFeeData(res.data);

          const feeAmountMin = Number(res.data.feeItems[0].feeAmountMin);
          const feeAmountMax = Number(res.data.feeItems[0].feeAmountMax);

          if (!this.disabledForm) {
            // If feeAmount = 0 then set feeType is FREE
            if (feeAmountMin === 0) {
              this.form.get('feeType').setValue(this.FEE_TYPES.FREE);
            } else if (feeAmountMin > 0 && feeAmountMax > 0) {
              this.form.get('feeType').setValue(this.FEE_TYPES.EXCLUDING);
            }
          }

          callback(res.data);
        } else {
          this.feeCalData = null;
          if (callbackError) {
            callbackError(null);
          }
        }
      },
      (error) => {
        this.feeCalData = null;
        if (callbackError) {
          callbackError(error);
        }
        this.customNotificationService.error('Thông báo', error?.message);
      }
    );
  }

  getFirstError(controlName: string): string {
    const errors = this.form.get(controlName)?.errors;
    return Object.keys(errors)[0];
  }
}
