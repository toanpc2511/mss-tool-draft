import {
  Component,
  Input,
  OnInit,
  ViewChild,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { startWith } from 'rxjs/operators';
import {
  CustomerInfo,
  FeeCalculationData,
} from 'src/app/shared/models/common.interface';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';
import {
  CITAD_PRODUCTS,
  CITAD_PRODUCTS_CODES,
  CITAD_ROUTES,
} from '../../../constants/citad';
import {
  DOC_TYPES,
  DOC_TYPES_VI,
  FEE_TYPES,
  FORM_CONTROL_NAMES,
  FORM_VAL_ERRORS,
} from '../../../constants/common';
import { RECIPIENT_SEARCH_TYPE } from '../../../constants/internal';
import { getIssuePlace } from '../../../helpers/common';
import { ExternalTransferFormComponent } from '../external-transfer-form.component';
import { CitadTransferService } from '../../../services/citad/citad-transfer.service';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { CitadBankInfo, CitadIndirectInfo } from '../../../models/citad';
import { Product } from '../../../models/common';
import { Observable, forkJoin } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { TextHelper } from 'src/app/shared/utilites/text';
import { CitadTransferFormService } from '../../../services/citad/citad-transfer-form.service';

@Component({
  selector: 'app-citad-transfer-form',
  templateUrl: './citad-transfer-form.component.html',
  styleUrls: [
    './citad-transfer-form.component.scss',
    '../../../styles/lpb-transfer-form.scss',
  ],
})
export class CitadTransferFormComponent implements OnInit, OnChanges {
  @Input('formGroup') form: FormGroup;
  @Input('disabledForm') disabledForm = false;

  @ViewChild('externalTransferForm', { static: false })
  externalTransferForm: ExternalTransferFormComponent;

  lstProduct = CITAD_PRODUCTS;
  lstRoute = CITAD_ROUTES;
  lstBank: CitadBankInfo[] = [];
  lstIndirectInfo: CitadIndirectInfo[] = [];

  crrBank: CitadBankInfo;
  crrIndirectInfo: CitadIndirectInfo;
  crrCustomerInfo: CustomerInfo;
  directInfo: string = '';

  FEE_TYPES = FEE_TYPES;
  maxDate = new Date();
  DOC_TYPES = [];

  feeCalData: FeeCalculationData;
  ctrlNames = FORM_CONTROL_NAMES;
  FORM_VAL_ERRORS = FORM_VAL_ERRORS;

  warning = {};

  constructor(
    private citadTransferService: CitadTransferService,
    private citadTransferFormService: CitadTransferFormService,
    private customNotificationService: CustomNotificationService
  ) {
    this.DOC_TYPES = DOC_TYPES_VI.map((docType) => ({
      key: docType.code,
      value: docType.radioTxt,
    }));
  }

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
    if (!this.disabledForm) {
      this.getListOfBank();
    }
    this.initForm();
    this.citadTransferService.getSyncCitadStt().subscribe((res) => {
      this.citadTransferFormService.openCitadWarningPopup(res.data);
    });
  }

  getListOfBank(callBack?: (data: CitadBankInfo[]) => void) {
    this.citadTransferService.getBankList().subscribe(
      (res) => {
        let lstBank: CitadBankInfo[] = [];
        if (res && res.data) {
          lstBank = res.data;
        }
        this.lstBank = lstBank;
        if (callBack) {
          callBack(lstBank);
        }
      },
      (error) => {
        this.customNotificationService.error('Thông báo', error?.message);
        if (callBack) {
          callBack(null);
        }
      }
    );
  }

  getIndirectInfoList(
    routeCode: string,
    callBack?: (data: CitadIndirectInfo[]) => void
  ) {
    this.citadTransferService.getIndirectInfoList(routeCode).subscribe(
      (res) => {
        let lstIndirectInfo: CitadIndirectInfo[] = [];
        if (res && res.data) {
          lstIndirectInfo = res.data;
        }
        this.lstIndirectInfo = lstIndirectInfo;
        if (callBack) {
          callBack(lstIndirectInfo);
        }
      },
      (error) => {
        this.customNotificationService.error('Thông báo', error?.message);
        if (callBack) {
          callBack(null);
        }
      }
    );
  }

  get userInfo(): any {
    try {
      return JSON.parse(localStorage.getItem('userInfo'));
    } catch (error) {
      return null;
    }
  }

  initForm() {
    //#region change productCode
    this.form
      .get(this.ctrlNames.OTHERS.productCode)
      .valueChanges.subscribe((code) => {
        if (this.disabledForm) {
          return;
        }
        switch (code) {
          case CITAD_PRODUCTS_CODES.CT03:
          case CITAD_PRODUCTS_CODES.CT04: {
            this.form
              .get(this.ctrlNames.OTHERS.feeType)
              .setValue(FEE_TYPES.EXCLUDING);
            break;
          }

          case CITAD_PRODUCTS_CODES.CT05: {
            this.form
              .get(this.ctrlNames.OTHERS.feeType)
              .setValue(FEE_TYPES.FREE);
            break;
          }
        }
      });
    //#endregion

    //#region change recipientTxtType
    this.form
      .get(this.ctrlNames.RECIPIENT.textType)
      .valueChanges.subscribe((type) => {
        if (this.disabledForm) {
          return;
        }
        const gtxmEnableCtrlNames = [
          this.ctrlNames.RECIPIENT.docNum,
          this.ctrlNames.RECIPIENT.docType,
          this.ctrlNames.RECIPIENT.docIssueDate,
          this.ctrlNames.RECIPIENT.docIssuePlace,
        ];
        const acnControl = this.form.get(this.ctrlNames.RECIPIENT.acn);
        const docNumControl = this.form.get(this.ctrlNames.RECIPIENT.docNum);

        if (type === RECIPIENT_SEARCH_TYPE.ACN) {
          acnControl.enable({ emitEvent: false });
          acnControl.setValue(
            docNumControl.value?.replace(/\D/g, '')?.slice(0, 20)
          );

          gtxmEnableCtrlNames.forEach((ctrlName) => {
            this.form.get(ctrlName).disable();
            this.form.get(ctrlName).setValue('');
          });
        } else {
          gtxmEnableCtrlNames.forEach((ctrlName) => {
            this.form.get(ctrlName).enable();
          });

          docNumControl.setValue(acnControl.value);
          acnControl.disable({ emitEvent: false });
          acnControl.setValue('');

          this.form
            .get(this.ctrlNames.RECIPIENT.docType)
            .setValue(DOC_TYPES.CCCD);
        }
      });
    //#endregion

    //#region watch fields to update accounting note
    const watchChangeForAccountNoteField = [
      this.ctrlNames.OTHERS.note,
      this.ctrlNames.RECIPIENT.acn,
      this.ctrlNames.RECIPIENT.docNum,
      this.ctrlNames.RECIPIENT.docType,
      this.ctrlNames.RECIPIENT.docIssueDate,
      this.ctrlNames.RECIPIENT.docIssuePlace,
      this.ctrlNames.RECIPIENT.name,
      this.ctrlNames.RECIPIENT.bankAddr,
    ];

    const accountNoteObs = watchChangeForAccountNoteField.map((field) => {
      const crrValue = this.form.get(field).value;
      return this.form
        .get(field)
        .valueChanges.pipe(startWith(<string>crrValue), distinctUntilChanged());
    });

    combineLatest(accountNoteObs).subscribe((textList) => {
      if (this.disabledForm) {
        return;
      }
      const docType = DOC_TYPES_VI.find((doc) => doc.code === textList[3]);
      if (docType) {
        textList[3] = docType.radioTxt;
      }

      if (
        this.form.get(this.ctrlNames.RECIPIENT.textType).value ===
        RECIPIENT_SEARCH_TYPE.GTXM
      ) {
        textList = textList.filter((item) => Boolean(item));
        this.form
          .get(this.ctrlNames.OTHERS.accountingNote)
          .setValue(textList.join(' '));
      } else {
        this.form
          .get(this.ctrlNames.OTHERS.accountingNote)
          .setValue(textList[0]);
      }
    });
    //#endregion

    this.form
      .get(this.ctrlNames.RECIPIENT.docIssueDate)
      .valueChanges.subscribe(() => {
        if (!this.disabledForm) {
          this.updateIssuePlace();
        }
      });
  }

  changeRouteCode(routeCode: string){
    this.form.get(this.ctrlNames.RECIPIENT.indirectCodeId).setValue(null);
    this.form.get(this.ctrlNames.RECIPIENT.indirectCode).setValue(null);
    this.form.get(this.ctrlNames.RECIPIENT.directCode).setValue(null);
    this.directInfo = '';

    if (routeCode) {
      this.getIndirectInfoList(routeCode);
    } else {
      this.lstIndirectInfo = [];
    }
  }

  changeBank(bankCode: string) {
    const crrBank = this.lstBank.find((bank) => bank.code === bankCode);
    this.form
      .get(this.ctrlNames.RECIPIENT.bank)
      .setValue(crrBank?.displayName || null);
  }

  changeIndirectCodeId(indirectCodeId: string) {
    this.crrIndirectInfo = this.lstIndirectInfo.find(
      (info) => info.id === indirectCodeId
    );

    this.form
      .get(this.ctrlNames.RECIPIENT.directCode)
      .setValue(this.crrIndirectInfo?.directCode);

    this.form
      .get(this.ctrlNames.RECIPIENT.indirectCode)
      .setValue(this.crrIndirectInfo?.indirectCode);

    this.form
      .get(this.ctrlNames.RECIPIENT.inDirectCodeDesc)
      .setValue(this.crrIndirectInfo?.indirectName);

    this.form
      .get(this.ctrlNames.RECIPIENT.bankName)
      .setValue(this.crrIndirectInfo?.directName);

    this.directInfo = this.getDirectInfoText(this.crrIndirectInfo);
  }

  getDirectInfoText(indirectInfo: CitadIndirectInfo){
    if (indirectInfo) {
      return indirectInfo.directCode + ' - ' + indirectInfo.directName;
    }
    return '';
  }

  checkCustomerMatchProduct(
    customer: CustomerInfo,
    crrProduct: Product
  ): boolean {
    if (!(crrProduct?.type && customer?.customerType)) {
      return true;
    }

    let valid = true;
    switch (crrProduct.code) {
      case CITAD_PRODUCTS_CODES.CT03: {
        if (customer.customerType !== 'I') {
          valid = false;
        }
        break;
      }

      case CITAD_PRODUCTS_CODES.CT04: {
        if (customer.customerType !== 'C') {
          valid = false;
        }
        break;
      }
    }

    return valid;
  }

  changeCustomerInfo(data: CustomerInfo) {
    this.crrCustomerInfo = data;
    this.updateProductWarning();
  }

  updateProductWarning() {
    const controlName = this.ctrlNames.SENDER.cif;
    const isMatchedProduct = this.checkCustomerMatchProduct(
      this.crrCustomerInfo,
      this.getCrrProduct()
    );
    if (!isMatchedProduct) {
      this.warning[controlName] =
        'Mã sản phẩm chưa phù hợp với đối tượng khách hàng, đề nghị chọn lại mã sản phẩm đúng';
    } else {
      this.warning[controlName] = null;
    }
  }

  changeProduct(event) {
    this.updateProductWarning();
  }

  getCrrProduct(): Product {
    const productCode = this.form.get(this.ctrlNames.OTHERS.productCode).value;
    return this.lstProduct.find((prod) => prod.code === productCode);
  }

  updateIssuePlace() {
    const issueDate = this.form.get(
      this.ctrlNames.RECIPIENT.docIssueDate
    ).value;
    const docType = this.form.get(this.ctrlNames.RECIPIENT.docType).value;
    this.form
      .get(this.ctrlNames.RECIPIENT.docIssuePlace)
      .setValue(getIssuePlace(issueDate, docType, this.userInfo));
  }

  clearFormError(controlName: string, errorName: string): void {
    FormHelpers.clearFormError({
      control: controlName,
      errorName,
      form: this.form,
    });
  }

  changeRecipientDocType(event: Event & { target: HTMLInputElement }): void {
    this.updateIssuePlace();
  }

  setFormError(controlName: string, errorName: string, message?: string): void {
    FormHelpers.setFormError({
      control: controlName,
      errorName,
      message,
      form: this.form,
    });
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

    const getBankListObs = new Observable((observer) => {
      this.getListOfBank((data) => {
        observer.next(data);
        observer.complete();
      });
    });

    const getIndirectInfoListObs = new Observable((observer) => {
      const routeCode = this.form.get(this.ctrlNames.OTHERS.routeCode).value;
      this.getIndirectInfoList(routeCode, (data) => {
        observer.next(data);
        observer.complete();
      });
    });

    const observableLst = [
      getSenderInfoObs,
      getFeeObs,
      getBankListObs,
      getIndirectInfoListObs,
    ];

    return new Observable((observer) => {
      forkJoin(observableLst).subscribe((dataList) => {
        let [customerLst, feeData, bankLst, indirectInfoLst] = dataList;
        const cif = this.form.get(this.ctrlNames.SENDER.cif).value;
        const acn = this.form.get(this.ctrlNames.SENDER.acn).value;

        const accounts = customerLst?.[0]?.accounts;
        const senderAcc = accounts?.find((acc) => acc?.acn === acn);
        this.externalTransferForm.loadAccountInfo(senderAcc);
        this.crrCustomerInfo = (customerLst as CustomerInfo[])?.find(
          (cus) => cus.cifNo === cif
        );

        const routeCode = this.form.get(
          this.ctrlNames.OTHERS.routeCode
        ).value;

        const indirectCode = this.form.get(
          this.ctrlNames.RECIPIENT.indirectCode
        ).value;

        const bankName = this.form.get(
          this.ctrlNames.RECIPIENT.bankName
        ).value;

        const inDirectCodeDesc = this.form.get(
          this.ctrlNames.RECIPIENT.inDirectCodeDesc
        ).value;

        this.crrIndirectInfo = (indirectInfoLst as CitadIndirectInfo[])?.find(
          (info) =>
            info.routeCode.trim() === routeCode &&
            info.indirectCode.trim() === indirectCode &&
            info.directName.trim() === bankName &&
            info.indirectName.trim() === inDirectCodeDesc
        );

        this.directInfo = this.getDirectInfoText(this.crrIndirectInfo);
        this.form.get(this.ctrlNames.RECIPIENT.indirectCodeId).setValue(this.crrIndirectInfo.id);

        observer.next(dataList);
        observer.complete();
      });
    });
  }

  validateForm(): boolean {
    this.form.markAllAsTouched();

    // Object.keys(this.form.controls).forEach((key) => {
    //   if(this.form.get(key).errors){
    //     console.log('error: ', key, this.form.get(key).errors);
    //   }
    // })

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

      this.ctrlNames.RECIPIENT.directCode,
      this.ctrlNames.OTHERS.nostroAcn,
      this.ctrlNames.OTHERS.nostroName,
    ];

    if (
      this.form.get(this.ctrlNames.RECIPIENT.textType).value ===
      RECIPIENT_SEARCH_TYPE.ACN
    ) {
      defaultDisableControlList = [
        ...defaultDisableControlList,
        this.ctrlNames.RECIPIENT.docNum,
        this.ctrlNames.RECIPIENT.docType,
        this.ctrlNames.RECIPIENT.docIssueDate,
        this.ctrlNames.RECIPIENT.docIssuePlace,
      ];
    } else {
      defaultDisableControlList = [
        ...defaultDisableControlList,
        this.ctrlNames.RECIPIENT.acn,
      ];
    }

    Object.keys(this.form.controls || {}).forEach((key) => {
      if (!defaultDisableControlList.includes(key)) {
        this.form.controls[key].enable({ emitEvent: false });
      }
    });
  }

  disableForm() {
    this.form.disable();
  }
}
