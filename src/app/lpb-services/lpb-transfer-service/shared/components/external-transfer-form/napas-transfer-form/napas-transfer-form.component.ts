import { Component, Input, OnInit, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CustomerInfo, FeeCalculationData } from 'src/app/shared/models/common.interface';
import {
  FEE_TYPES,
  FORM_CONTROL_NAMES,
  FORM_VAL_ERRORS,
} from '../../../constants/common';
import { NAPAS_PRODUCTS, NAPAS_SEARCH_TYPES } from '../../../constants/napas';
import { ExternalTransferFormComponent } from '../external-transfer-form.component';
import { startWith } from 'rxjs/operators';
import { Observable, combineLatest, forkJoin } from 'rxjs';
import { NapasTransferService } from '../../../services/napas/napas-tranfer.service';
import { NapasBankInfo } from '../../../models/napas';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';

@Component({
  selector: 'app-napas-transfer-form',
  templateUrl: './napas-transfer-form.component.html',
  styleUrls: [
    './napas-transfer-form.component.scss',
    '../../../styles/lpb-transfer-form.scss',
  ],
})
export class NapasTransferFormComponent implements OnInit, OnChanges {
  @Input('formGroup') form: FormGroup;
  @Input('disabledForm') disabledForm = false;

  @ViewChild('externalTransferForm', { static: false })
  externalTransferForm: ExternalTransferFormComponent;

  lstProduct = NAPAS_PRODUCTS;
  lstBank: NapasBankInfo[] = [];

  FEE_TYPES = FEE_TYPES;
  maxDate = new Date();
  DOC_TYPES = [];

  feeCalData: FeeCalculationData;
  ctrlNames = FORM_CONTROL_NAMES;
  FORM_VAL_ERRORS = FORM_VAL_ERRORS;

  NAPAS_SEARCH_TYPES = NAPAS_SEARCH_TYPES;

  matTooltip = `Thực hiện truy vấn thông tin người thụ hưởng theo số tài khoản/ số thẻ.
                Bắt buộc chọn Ngân hàng nếu người thụ hưởng nhận bằng số tài khoản.`;

  enabledBtn = false;
  recipientFullName = '';
  recipientBankName = '';

  constructor(
    private napasTransferService: NapasTransferService,
    private customNotificationService: CustomNotificationService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.disabledForm) {
      if (changes.disabledForm.currentValue) {
        this.disableForm();
      } else {
        this.enableForm();
      }
    }
  }

  ngOnInit() {
    this.initForm();
    this.getListBank();
  }

  initForm() {
    //#region  watch change to disable button
    const watchChangeForButton = [
      this.ctrlNames.RECIPIENT.acn,
      this.ctrlNames.RECIPIENT.cardNum,
      this.ctrlNames.RECIPIENT.textType,
      this.ctrlNames.RECIPIENT.bankId,
    ];

    const buttonObs = watchChangeForButton.map((field) => {
      const crrValue = this.form.get(field).value;
      return this.form
        .get(field)
        .valueChanges.pipe(startWith(<string>crrValue));
    });

    combineLatest(buttonObs).subscribe(([acn, cardNum, textType, benId]) => {
      if (textType === NAPAS_SEARCH_TYPES.ACN) {
        this.enabledBtn = Boolean(benId) && Boolean(acn);
      } else {
        this.enabledBtn = Boolean(cardNum);
      }
    });
    //#endregion

    //#region watch change recipientFullName
    this.form
      .get(this.ctrlNames.RECIPIENT.name)
      .valueChanges.subscribe((name) => {
        this.recipientFullName = name;
      });
    //#endregion

    //#region watch change recipientBankName
    this.form
      .get(this.ctrlNames.RECIPIENT.bankName)
      .valueChanges.subscribe((bankName) => {
        this.recipientBankName = bankName;
      });
    //#endregion
  }

  getListBank(callback?: (data: NapasBankInfo[]) => void) {
    this.napasTransferService.getListBank().subscribe(
      (res) => {
        this.lstBank = res?.data;
        if (callback) {
          callback(this.lstBank);
        }
      },
      (error) => {
        this.lstBank = [];
        if (callback) {
          callback(this.lstBank);
        }
        throw error;
      }
    );
  }

  changeBank(benId: string) {
    if(!benId){
      this.form.get(this.ctrlNames.RECIPIENT.name).setValue(null);
      return;
    }

    const selectedBank = this.lstBank.find((bank) => bank.benId === benId);
    this.form
      .get(this.ctrlNames.RECIPIENT.bankName)
      .setValue(selectedBank?.bankName);
  }

  changeSearchType(type: string) {
    const acnCtrl = this.form.get(this.ctrlNames.RECIPIENT.acn);
    const cardNumCtrl = this.form.get(this.ctrlNames.RECIPIENT.cardNum);
    const bankCtrl = this.form.get(this.ctrlNames.RECIPIENT.bankId);
    const bankNameCtrl = this.form.get(this.ctrlNames.RECIPIENT.bankName);

    if (type === NAPAS_SEARCH_TYPES.ACN) {
      cardNumCtrl.disable({ emitEvent: false });
      bankNameCtrl.disable({ emitEvent: false });
      acnCtrl.enable( { emitEvent: false });
      bankCtrl.enable({ emitEvent: false });
    } else {
      acnCtrl.disable({ emitEvent: false });
      cardNumCtrl.enable({ emitEvent: false });
      bankNameCtrl.enable({ emitEvent: false });
      bankCtrl.disable({ emitEvent: false });
    }
    this.clearTextSearchError();
    this.clearRecipientInfo();
  }

  changeTextSearch(event: Event & { target: HTMLInputElement }) {
    this.form.get(this.ctrlNames.RECIPIENT.name).setValue(null);
  }

  clearRecipientInfo() {
    this.form.get(this.ctrlNames.RECIPIENT.bankName).setValue(null);
    this.form.get(this.ctrlNames.RECIPIENT.name).setValue(null);
    this.form.get(this.ctrlNames.RECIPIENT.bankId).setValue(null);
  }

  setTextSearchError() {
    const textCtrl = this.getCurrentTextSearchControl();
    FormHelpers.setFormError({
      control: textCtrl,
      errorName: FORM_VAL_ERRORS.NO_EXIST,
    });
  }

  getCurrentTextSearchControl() {
    const textType = this.form.get(this.ctrlNames.RECIPIENT.textType).value;
    if (textType === NAPAS_SEARCH_TYPES.ACN) {
      return this.form.get(this.ctrlNames.RECIPIENT.acn);
    } else {
      return this.form.get(this.ctrlNames.RECIPIENT.cardNum);
    }
  }

  clearTextSearchError() {
    const textCtrl = this.getCurrentTextSearchControl();
    FormHelpers.clearFormError({
      control: textCtrl,
      errorName: FORM_VAL_ERRORS.NO_EXIST,
    });
  }

  searchInfo() {
    const textCtrl = this.getCurrentTextSearchControl();
    const textTypeCtrl = this.form.get(this.ctrlNames.RECIPIENT.textType);
    const recipientNameCtrl = this.form.get(this.ctrlNames.RECIPIENT.name);
    const bankCtrl = this.form.get(this.ctrlNames.RECIPIENT.bankId);
    const bankNameCtrl = this.form.get(this.ctrlNames.RECIPIENT.bankName);

    if (textTypeCtrl.value === NAPAS_SEARCH_TYPES.CARD_NO) {
      this.napasTransferService.getCardInfo(textCtrl.value?.trim()).subscribe(
        (res) => {
          if (res && res.data) {
            this.clearTextSearchError();
            recipientNameCtrl.setValue(res.data.customerName);
            bankNameCtrl.setValue(res.data.bankName);
          } else {
            this.setTextSearchError();
          }
        },
        (error) => {
          this.customNotificationService.error('Thông báo', error?.message);
          this.setTextSearchError();
        }
      );
    } else {
      this.napasTransferService
        .getCustomerNameByAcnAndBankCode({
          acn: textCtrl.value,
          bankCode: bankCtrl.value,
        })
        .subscribe(
          (res) => {
            if (res && res.data) {
              this.clearTextSearchError();
              recipientNameCtrl.setValue(res.data);
            } else {
              this.setTextSearchError();
            }
          },
          (error) => {
            this.customNotificationService.error('Thông báo', error?.message);
            this.setTextSearchError();
          }
        );
    }
  }

  getFirstError(controlName: string): string {
    const errors = this.form.get(controlName)?.errors;
    return Object.keys(errors)[0];
  }

  // Fetch data in detail or edit, approve page
  fetchData() {
    const getSenderInfoObs = new Observable<CustomerInfo[]>((observer) => {
      const cif = this.form.get(this.ctrlNames.SENDER.cif).value;
      this.externalTransferForm.getCustomerInfo({
        input: 'cif',
        txtSearch: cif,
        callback: (data) => {
          observer.next(data);
          observer.complete();
        },
      });
    });

    const getFeeObs = new Observable((observer) => {
      this.externalTransferForm.getFeeAndVAT(
        (data) => {
          observer.next(data);
          observer.complete();
        },
        (error) => {
          observer.next(null);
          observer.complete();
        }
      );
    });

    const observableLst = [getSenderInfoObs, getFeeObs];

    return new Observable((observer) => {
      forkJoin(observableLst).subscribe((dataList) => {
        let [customerLst, feeData] = dataList;
        const cif = this.form.get(this.ctrlNames.SENDER.cif).value;
        const acn = this.form.get(this.ctrlNames.SENDER.acn).value;

        const accounts = customerLst?.[0]?.accounts;
        const senderAcc = accounts?.find((acc) => acc?.acn === acn);
        this.externalTransferForm.loadAccountInfo(senderAcc);

        observer.next(dataList);
        observer.complete();
      });
    });
  }

  validateForm(): boolean {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      const errorElements = document.querySelectorAll(
        '.ng-invalid[formControlName],.input-error'
      );
      let firstErrorEle: Element = errorElements.item(0);

      if (firstErrorEle) {
        firstErrorEle.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    return true;
  }

  enableForm() {
    let defaultDisableControlList = [
      this.ctrlNames.SENDER.branchCode,
      this.ctrlNames.SENDER.curCode,
      this.ctrlNames.OTHERS.totalAmount,

      this.ctrlNames.OTHERS.intermediaryAcn,
      this.ctrlNames.OTHERS.intermediaryAcnName,
    ];

    const textType = this.form.get(this.ctrlNames.RECIPIENT.textType).value;
    if (textType === NAPAS_SEARCH_TYPES.ACN) {
      defaultDisableControlList = [
        ...defaultDisableControlList,
        this.ctrlNames.RECIPIENT.cardNum,
        this.ctrlNames.RECIPIENT.bankName,
      ];
    } else {
      defaultDisableControlList = [
        ...defaultDisableControlList,
        this.ctrlNames.RECIPIENT.acn,
        this.ctrlNames.RECIPIENT.bankId,
      ];
    }

    Object.keys(this.form.controls || {}).forEach((key) => {
      if (!defaultDisableControlList.includes(key)) {
        this.form.controls[key].enable({emitEvent: false});
      }
    });
  }

  disableForm() {
    this.form.disable();
  }
}
