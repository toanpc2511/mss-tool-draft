import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import {
  Account,
  CustomerInfo,
  FeeCalculationData,
  FeeCalculationRequest,
} from 'src/app/shared/models/common.interface';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';

import { Product } from '../../models/common';
import {
  INTERNAL_TRANSFER_PRODUCTS,
  INTERNAL_TRANSFER_PRODUCTS_CODES,
  RECIPIENT_SEARCH_TYPE,
} from '../../constants/internal';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { DatePipe } from '@angular/common';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';

import {
  FEE_TYPES,
  FORM_VAL_ERRORS,
  PRODUCTS_TYPES,
  RelatedParty,
  CURRENCIES,
  DOC_TYPES,
  DOC_TYPES_VI,
} from '../../constants/common';
import * as moment from 'moment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { OnUpdateFeeTableEmitParams } from '../fee-table/fee-table.component';
import { CalculationHelper } from '../../helpers/calculation.helper';
import { DateHelper } from 'src/app/shared/utilites/date-helper';
import { TextHelper } from 'src/app/shared/utilites/text';
import { getIssuePlace } from '../../helpers/common';

import { LpbSignatureListComponent } from 'src/app/shared/components/lpb-signature-list/lpb-signature-list.component';
import { InternalTransferService } from '../../services/internal/internal-transfer.service';

type GetCustomerInfoParams = {
  type: RelatedParty;
  input: 'cif' | 'gtxm' | 'acn';
  txtSearch: string;
  controlName?: string;
  callback?: (data: CustomerInfo[]) => void;
};

@Component({
  selector: 'app-transfer-form',
  templateUrl: './transfer-form.component.html',
  styleUrls: [
    './transfer-form.component.scss',
    '../../styles/lpb-transfer-form.scss',
  ],
})
export class TransferFormComponent implements OnInit {
  @Input('formGroup') form: FormGroup;
  @Input('disabledForm') disabledForm = false;

  @ViewChild('recipientDocIssueDate', { static: false })
  recipientDocIssueDate: LpbDatePickerComponent; // Ngày Cấp bên nhận

  @ViewChild('lstSign', { static: false })
  lstSign: LpbSignatureListComponent;

  FORM_VAL_ERRORS = FORM_VAL_ERRORS;

  maxDate = new Date();
  userInfo: any;
  lstCif: CustomerInfo[] = [];
  lstProduct: Product[] = INTERNAL_TRANSFER_PRODUCTS;
  lstAccount: Account[] = [];

  DOC_TYPES = [];
  CURRENCIES = CURRENCIES;
  FEE_TYPES = FEE_TYPES;

  feeCalData: FeeCalculationData;
  acnBranch = {
    SENDER: '',
    RECIPIENT: '',
  };
  acnHoverText = {
    SENDER: '',
    RECIPIENT: '',
  };

  disabledSearchType = {
    GTXM: false,
    ACN: false,
  };

  RECIPIENT_SEARCH_TYPE = RECIPIENT_SEARCH_TYPE;

  activeRecipientField = {
    GTXM: [
      'recipientDocNum',
      'recipientDocType',
      'recipientDocIssuePlace',
      'recipientDocIssueDate',
      'recipientCurrentAcn',
      'recipientFullNameGTXM',
      'recipientCurrentAcnName',
      'recipientCurrentAcnCurCode'
    ],
    ACN: ['recipientAcn'],
  };

  formControlNames = {
    SENDER: {
      cif: 'senderCifNo',
      acn: 'senderAcn',
      balance: 'senderAvailableBalance',
      branchCode: 'senderAccountBranchCode',
      curCode: 'senderCurCode',
      name: 'senderName',
      address: 'senderAddress',
      accountName: 'senderAccountName'
    },
    RECIPIENT: {
      acn: 'recipientAcn',
      accountName: 'recipientAccountName',
      cif: 'recipientCif',
      gtxm: 'recipientDocNum',
      balance: 'recipientAvailableBalance',
      branchCode: 'recipientAccountBranchCode',
      curCode: 'recipientCurCode',
      name: 'recipientFullNameACN',
      docType: 'recipientDocType',
      docNum: 'recipientDocNum',
      docIssueDate: 'recipientDocIssueDate',
      docIssuePlace: 'recipientDocIssuePlace',
      crrAcn: 'recipientCurrentAcn',
      crrAcnName: 'recipientCurrentAcnName',
      crrAcnCurCode: 'recipientCurrentAcnCurCode',
      crrAcnBranchCode: 'recipientCurrentAcnBranchCode'
    },
  };

  recipientValidation = {
    [this.formControlNames.RECIPIENT.docNum]: {
      validators: [Validators.required, Validators.minLength(8)],
    },
    [this.formControlNames.RECIPIENT.docIssuePlace]: {
      validators: [Validators.required],
    },
    ['recipientFullNameGTXM']: {
      validators: [Validators.required],
    },
    [this.formControlNames.RECIPIENT.crrAcn]: {
      validators: [Validators.required, Validators.minLength(12)],
      customValidation: () => {
        if(!this.form){
          return;
        }
        this.validateSameAccount("RECIPIENT", this.formControlNames.RECIPIENT.crrAcn);
      }
    },
    [this.formControlNames.RECIPIENT.acn]: {
      validators: [Validators.required, Validators.minLength(12)],
      customValidation: () => {
        if(!this.form){
          return;
        }
        this.validateSameAccount("RECIPIENT", this.formControlNames.RECIPIENT.acn);
      }
    },
    [this.formControlNames.RECIPIENT.docIssueDate]: {
      validators: [Validators.required],
      customValidation: () => {
        if(!this.form || !this.recipientDocIssueDate){
          return;
        }
        this.validateDocIssueDate();
      }
    }
  }

  minChars = {
    [this.formControlNames.RECIPIENT.docNum]: 8,
    [this.formControlNames.RECIPIENT.acn]: 12,
    [this.formControlNames.SENDER.acn]: 12,
    [this.formControlNames.RECIPIENT.crrAcn]: 12,
  };

  warning = {};

  constructor(
    private customNotificationService: CustomNotificationService,
    private internalTransferService: InternalTransferService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {
    this.DOC_TYPES = DOC_TYPES_VI.map((docType) => ({
      key: docType.code,
      value: docType.radioTxt,
    }));
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
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
    Object.keys(this.form.controls).forEach((key) => {
      this.warning[key] = false;
    });
  }

  ngAfterViewInit(): void {
    const activeType = this.form.get('recipientSearchType').value;
    if (activeType) {
      if (activeType === RECIPIENT_SEARCH_TYPE.ACN) {
        this.recipientDocIssueDate.disable();
        this.cdr.detectChanges();
      }
      this.changeRecipientSearchType(activeType);
    }
  }

  initForm() {
    //#region watch productCode
    this.form.get('productCode').valueChanges.subscribe((code: string) => {
      if (this.form.get('productCode').disabled) {
        return;
      }

      const crrRecipientSearchType = this.form.get('recipientSearchType').value;
      switch (code) {
        case INTERNAL_TRANSFER_PRODUCTS_CODES.CT01: {
          this.disabledSearchType.GTXM = true;
          this.disabledSearchType.ACN = false;
          if (crrRecipientSearchType !== 'ACN') {
            this.form.get('recipientSearchType').setValue('ACN');
          }

          break;
        }

        case INTERNAL_TRANSFER_PRODUCTS_CODES.CT02: {
          this.disabledSearchType.GTXM = false;
          this.disabledSearchType.ACN = true;
          if (crrRecipientSearchType !== 'GTXM') {
            this.form.get('recipientSearchType').setValue('GTXM');
          }
          break;
        }

        default: {
          this.disabledSearchType.GTXM = false;
          this.disabledSearchType.ACN = false;
        }
      }

      this.validateMatchCurCode(this.formControlNames.SENDER.acn);
      const crrProduct = this.getCrrProduct();
      this.form.get('note').setValue(crrProduct?.name);

      const account = this.getCrrSenderAccount();
      if (account && this.checkAccMatchProduct(account)) {
        this.getFeeAndVAT((data: FeeCalculationData) => {
          this.updateFee();
          this.updateTotal();
        });
      }
    });
    //#endregion

    //#region watch branchCode
    this.form
      .get(this.formControlNames.SENDER.branchCode)
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((branchCode) => {
        this.getBranchInfo(branchCode, 'SENDER');
      });

    this.form
      .get(this.formControlNames.RECIPIENT.branchCode)
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((branchCode) => {
        this.getBranchInfo(branchCode, 'RECIPIENT');
      });
    //#endregion

    //#region watch recipientDocIssueDate
    this.form
      .get(this.formControlNames.RECIPIENT.docIssueDate)
      .valueChanges.subscribe((value: string) => {
        const isDisabled = this.form.get(
          this.formControlNames.RECIPIENT.docIssueDate
        ).disabled;

        if (isDisabled) {
          this.recipientDocIssueDate.disable();
          this.recipientDocIssueDate.setValue(value);
        } else {
          this.recipientDocIssueDate.enable();
        }
      });
    //#endregion

    //#region watch recipientSearchType
    this.form
      .get('recipientSearchType')
      .valueChanges.subscribe((activeType: 'GTXM' | 'ACN') => {
        if (!activeType || this.form.get('recipientSearchType').disabled) {
          return;
        }
        this.changeRecipientSearchType(activeType);
      });
    //#endregion

    //#region watch curCode
    this.form.get('senderCurCode').valueChanges.subscribe((selectedValue) => {
      if (this.disabledForm) {
        return;
      }

      if (selectedValue && selectedValue !== CURRENCIES.VND) {
        this.form.get('fee').disable();
        this.form.get('feeVAT').disable();
      } else {
        this.form.get('fee').enable();
        this.form.get('feeVAT').enable();
      }

      if (selectedValue === CURRENCIES.VND) {
        this.form.get('feeEx').setValue(null);
        this.form.get('feeVATEx').setValue(null);
      }

      const account = this.getCrrSenderAccount();
      if (account && this.checkAccMatchProduct(account)) {
        this.getFeeAndVAT((data: FeeCalculationData) => {
          this.updateFee();
          this.updateTotal();
        });
      }
    });
    //#endregion

    //#region watch feeType
    this.form.get('feeType').valueChanges.subscribe((value) => {
      this.cdr.detectChanges();
    });
    //#endregion
  }

  setDocIssueDate(dateStr: string): void {
    if (!dateStr) {
      this.recipientDocIssueDate.clearDate();
      return;
    }
    try {
      let docIssueDateStr = null;
      let docIssueDate = DateHelper.getDateFromString(dateStr);
      docIssueDateStr = this.datePipe.transform(docIssueDate, 'dd/MM/yyyy');
      this.recipientDocIssueDate.setValue(docIssueDateStr);
    } catch (error) {
      console.error(error);
    }
  }

  getBranchInfo(branchCode: string, type: RelatedParty): void {
    if (!branchCode) {
      this.acnBranch[type] = '';
      return;
    }
    this.acnBranch[type] = branchCode;
    this.internalTransferService.getBranchInfo(branchCode).subscribe(
      (res) => {
        if (res && res.data?.[0]) {
          this.acnBranch[type] += ' - ' + res.data[0].name;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getCustomerInfo(params: GetCustomerInfoParams): void {
    let { txtSearch, input, type, callback, controlName } = params;
    txtSearch = txtSearch?.trim();

    controlName = controlName || this.formControlNames?.[type]?.[input];
    if (!controlName) {
      return;
    }

    const loadCustomerInfo = (
      customerInfo?: Partial<CustomerInfo>,
      ignoreControlName?: string
    ) => {
      if (type === 'SENDER') {
        this.loadSenderInfo(customerInfo, ignoreControlName);
      } else if (type === 'RECIPIENT') {
        this.loadRecipientInfo(customerInfo, ignoreControlName);
      }
    };

    this.internalTransferService.getCustomerInfo(txtSearch, input).subscribe(
      (res) => {
        if (res && res.data?.length) {
          loadCustomerInfo(res.data[0], controlName);
          this.clearFormWarning(controlName, this.FORM_VAL_ERRORS.NO_EXIST);
          this.clearFormError(controlName, this.FORM_VAL_ERRORS.NO_EXIST);
          if (callback) {
            callback(res.data);
          }
        } else {
          if (callback) {
            callback(null);
          }
        }
      },
      (error) => {
        loadCustomerInfo(null, controlName);

        if (error?.code.match(/400/g)) {
          if (controlName === this.formControlNames.RECIPIENT.docNum) {
            this.setFormWarning(controlName, this.FORM_VAL_ERRORS.NO_EXIST);
          } else {
            this.setFormError(controlName, this.FORM_VAL_ERRORS.NO_EXIST);
          }
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

  loadSenderInfo(
    customerInfo?: Partial<CustomerInfo>,
    ignoreControlName?: string
  ) {
    const cifControlName = this.formControlNames.SENDER.cif;
    if (!(ignoreControlName && ignoreControlName === cifControlName)) {
      this.form.get(cifControlName).setValue(customerInfo?.cifNo || null);
    }
    this.lstSign.startFetching(this.form.get(cifControlName).value);
    this.updateExistValidationAcn(customerInfo?.accounts, ignoreControlName);

    this.form
      .get(this.formControlNames.SENDER.name)
      .setValue(customerInfo?.fullName || null);
    this.form
      .get(this.formControlNames.SENDER.address)
      .setValue(customerInfo?.address || null);

    if (customerInfo?.accounts && customerInfo?.accounts?.length > 0) {
      if (customerInfo.accounts.length === 1) {
        const account = customerInfo.accounts[0];
        this.loadAccountInfo('SENDER', account, ignoreControlName);
      } else {
        this.loadAccountInfo('SENDER', null, ignoreControlName);
      }
      this.lstAccount = customerInfo.accounts;
    } else {
      this.lstAccount = [];
      this.loadAccountInfo('SENDER', null, ignoreControlName);
    }
  }

  loadRecipientInfo(
    customerInfo?: Partial<CustomerInfo>,
    ignoreControlName?: string
  ) {
    const notPersonalAcc =
      customerInfo?.customerType !== 'I' && customerInfo?.customerType;

    if (ignoreControlName === this.formControlNames.RECIPIENT.acn) {
      this.form
        .get(this.formControlNames.RECIPIENT.cif)
        .setValue(customerInfo?.cifNo || null);
      this.form
        .get(this.formControlNames.RECIPIENT.name)
        .setValue(customerInfo?.fullName || null);
      this.updateExistValidationAcn(customerInfo?.accounts, ignoreControlName);
      this.loadAccountInfo(
        'RECIPIENT',
        customerInfo?.accounts?.[0],
        ignoreControlName
      );
      return;
    }

    if (notPersonalAcc) {
      this.setFormError(
        this.formControlNames.RECIPIENT.docNum,
        this.FORM_VAL_ERRORS.NOT_PERSONAL_ACC
      );
      return;
    }

    this.clearFormError(
      this.formControlNames.RECIPIENT.docNum,
      this.FORM_VAL_ERRORS.NOT_PERSONAL_ACC
    );
  }

  updateExistValidationAcn(accounts: Account[], controlName: string) {
    if (accounts && accounts?.length === 0) {
      if (controlName) {
        this.setFormError(
          controlName,
          this.FORM_VAL_ERRORS.NOT_EXIST_ACC
        );
      }
    } else {
      this.clearFormError(
        controlName,
        this.FORM_VAL_ERRORS.NOT_EXIST_ACC
      );
    }
  }

  updateAccountBalance() {
    const acn = this.form.get(this.formControlNames.SENDER.acn).value;
    if (acn) {
      this.internalTransferService.getBalance(acn).subscribe(
        (res) => {
          let balance = Number(res?.data.overdraftAvalBal);
          // const checkSameCif =
          //   this.form.get(this.formControlNames.SENDER.cif).value ===
          //   this.form.get(this.formControlNames.RECIPIENT.cif).value;
          // const checkGTXM =
          //   this.form.get('recipientSearchType').value ===
          //   RECIPIENT_SEARCH_TYPE.GTXM;

          // if (checkSameCif || checkGTXM) {
          //   balance = Number(res?.data.avalBal);
          // }
          balance = balance > 0 ? balance : 0;
          this.form.get(this.formControlNames.SENDER.balance).setValue(balance);
        },
        (error) => {
          this.customNotificationService.error('Thông báo', error?.message);
        }
      );
    } else {
      this.form.get(this.formControlNames.SENDER.balance).setValue(null);
    }
  }

  loadAccountInfo(
    type: RelatedParty,
    account?: Account,
    ignoreControlName?: string
  ): void {
    let hoverText = '';
    if (account) {
      hoverText =
        account.acn + ' - ' + account.accountName + ' - ' + account.curCode;
    }

    const acnControlName = this.formControlNames[type].acn;
    const branchControlName = this.formControlNames[type].branchCode;
    const curCodeControlName = this.formControlNames[type].curCode;
    const accountNameControlName = this.formControlNames[type].accountName;
    this.acnHoverText[type] = hoverText;

    if (!(ignoreControlName && ignoreControlName === acnControlName)) {
      this.form.get(acnControlName).setValue(account?.acn || null);
    }

    if (type === 'SENDER') {
      this.lstSign.startFetching(account?.acn, 'acn');
    }

    if (account) {
      if (type === 'SENDER') {
        this.checkAccMatchProduct(account, acnControlName);
      }
      if (account.noDrStatus === 'Y' && type === 'SENDER') {
        this.setFormError(acnControlName, this.FORM_VAL_ERRORS.NO_DR);
      } else if (account.noCrStatus === 'Y' && type === 'RECIPIENT') {
        this.setFormError(acnControlName, this.FORM_VAL_ERRORS.NO_CR);
      } else if (account.frozenStatus === 'Y') {
        this.setFormError(acnControlName, this.FORM_VAL_ERRORS.FROZEN);
      }
    }

    this.form
      .get(accountNameControlName)
      .setValue(account?.accountName || null);

    this.updateAccountBalance();

    if (this.disabledForm) {
      return;
    }

    this.form
      .get(branchControlName)
      .setValue(account?.accountBranchCode || null);
    this.form.get(curCodeControlName).setValue(account?.curCode || null);
    this.validateMatchCurCode(acnControlName);
    this.validateSameAccount(type, acnControlName);
  }

  validateSameAccount(type: RelatedParty, acnControlName: string) {
    const acn = this.form.get(acnControlName).value;

    let theOtherAcn = this.form.get(this.formControlNames.SENDER.acn).value;
    if (type === 'SENDER') {
      theOtherAcn =
        this.form.get(this.formControlNames.RECIPIENT.acn).value ||
        this.form.get(this.formControlNames.RECIPIENT.crrAcn).value;
    }

    if (acn === theOtherAcn && acn && theOtherAcn) {
      this.setFormError(acnControlName, this.FORM_VAL_ERRORS.SAME_ACN);
    } else {
      const controlNames = [
        this.formControlNames.SENDER.acn,
        this.formControlNames.RECIPIENT.acn,
        this.formControlNames.RECIPIENT.crrAcn,
      ];

      controlNames.forEach((controlName) => {
        this.clearFormError(controlName, this.FORM_VAL_ERRORS.SAME_ACN);
      });
    }
  }

  validateMatchCurCode(acnControlName: string) {
    const senderCurCode = this.form.get(
      this.formControlNames.SENDER.curCode
    ).value;
    const recipientCurCode =
      this.form.get(this.formControlNames.RECIPIENT.curCode).value ||
      this.form.get(this.formControlNames.RECIPIENT.crrAcnCurCode).value;

    if (
      senderCurCode !== recipientCurCode &&
      senderCurCode &&
      recipientCurCode
    ) {
      this.setFormError(acnControlName, this.FORM_VAL_ERRORS.NOT_MATCH_CURCODE);
    } else {
      const controlNames = [
        this.formControlNames.SENDER.acn,
        this.formControlNames.RECIPIENT.acn,
        this.formControlNames.RECIPIENT.crrAcn,
      ];

      controlNames.forEach((controlName) => {
        this.clearFormError(
          controlName,
          this.FORM_VAL_ERRORS.NOT_MATCH_CURCODE
        );
      });
    }
  }

  changeSenderCif(event: { target: HTMLInputElement }): void {
    const cif = event.target.value?.toString()?.trim();

    if (cif) {
      this.getCustomerInfo({ input: 'cif', type: 'SENDER', txtSearch: cif });
    }
  }

  inputChangeSenderCif(event: Event & { target: HTMLInputElement }): void {
    const crrCifNo = event.target.value;
    if (!crrCifNo) {
      this.loadSenderInfo(null, this.formControlNames.SENDER.cif);
    }
  }

  changeAcn(
    event: { target: HTMLInputElement } | string,
    type: RelatedParty
  ): void {
    if (!event) {
      return;
    }
    if (typeof event !== 'string') {
      const acn = event.target.value.toString()?.trim();
      const controlName = this.formControlNames[type].acn;

      if (
        !this.form.get(controlName).hasError(this.FORM_VAL_ERRORS.REQUIRED) &&
        !this.form.get(controlName).hasError(this.FORM_VAL_ERRORS.MIN_LENGTH)
      ) {
        this.getCustomerInfo({
          type: type,
          input: 'acn',
          txtSearch: acn,
          callback: (data) => {
            if (data?.[0]?.accounts?.length > 0) {
              if (type === 'RECIPIENT') {
                return;
              }
              this.getFeeAndVAT(() => {
                this.updateFee();
                this.updateTotal();
              });
            }
          },
        });
      }
    } else {
      const selectedAccount = this.lstAccount.find(
        (acc) => acc.acn === event.trim()
      );
      this.loadAccountInfo(
        type,
        selectedAccount,
        this.formControlNames[type].acn
      );
      if(selectedAccount && type === 'SENDER'){
        if(selectedAccount){
          this.getFeeAndVAT(() => {
            this.updateFee();
            this.updateTotal();
          });
        }
      }
    }
  }

  changeCrrAcn(event: { target: HTMLInputElement }) {
    const crrAcn = event.target.value?.trim();
    const crrAcnCtrlName = this.formControlNames.RECIPIENT.crrAcn;

    if (
      !this.form.get(crrAcnCtrlName).hasError(this.FORM_VAL_ERRORS.REQUIRED) &&
      !this.form.get(crrAcnCtrlName).hasError(this.FORM_VAL_ERRORS.MIN_LENGTH)
    ) {
      this.getCrrAccountInfo(crrAcn);
      this.validateSameAccount('RECIPIENT', crrAcnCtrlName);
    }
  }

  getCrrAccountInfo(crrAcn: string, callback?: (data: any) => void) {
    const crrAcnCtrlName = this.formControlNames.RECIPIENT.crrAcn;
    this.getCustomerInfo({
      type: null,
      input: 'acn',
      txtSearch: crrAcn,
      controlName: crrAcnCtrlName,
      callback: (data) => {
        const account = data?.[0]?.accounts?.[0];
        this.form
          .get(this.formControlNames.RECIPIENT.crrAcnName)
          .setValue(account?.accountName || null);

        this.form
          .get(this.formControlNames.RECIPIENT.crrAcnCurCode)
          .setValue(account?.curCode || null);

        this.form
          .get(this.formControlNames.RECIPIENT.crrAcnBranchCode)
          .setValue(account?.accountBranchCode || null);

        this.form
          .get(this.formControlNames.RECIPIENT.cif)
          .setValue(data?.[0]?.cifNo || null);

        this.updateAccountBalance();

        if (account) {
          this.validateMatchCurCode(crrAcnCtrlName);
          this.clearFormError(crrAcnCtrlName, this.FORM_VAL_ERRORS.NO_EXIST);

          if (account.noCrStatus === 'Y') {
            this.setFormError(crrAcnCtrlName, this.FORM_VAL_ERRORS.NO_CR);
          } else if (account.frozenStatus === 'Y') {
            this.setFormError(crrAcnCtrlName, this.FORM_VAL_ERRORS.FROZEN);
          }
        } else {
          this.setFormError(crrAcnCtrlName, this.FORM_VAL_ERRORS.NO_EXIST);
        }

        if (callback) {
          callback(account);
        }
      },
    });
  }

  onInputCrrAcnChange(event: Event & { target: HTMLInputElement }) {
    const crrAcn = event.target.value;
    if (!crrAcn) {
      this.form.get(this.formControlNames.RECIPIENT.crrAcnName).setValue(null);
      this.form
        .get(this.formControlNames.RECIPIENT.crrAcnCurCode)
        .setValue(null);
    }
  }

  onAccInputChange(
    event: Event & { target: HTMLInputElement },
    type: RelatedParty
  ): void {
    const acn = event.target.value;
    if (!acn) {
      this.lstAccount = [];
      this.loadAccountInfo(type, null);
    }
  }

  changeRecipientDocNum(customerInfo: CustomerInfo): void {
    const controlName = this.formControlNames.RECIPIENT.docNum;
    this.loadRecipientInfo(customerInfo, controlName);

    if (!customerInfo && this.form.get(controlName).value) {
      this.setFormWarning(controlName, this.FORM_VAL_ERRORS.NO_EXIST);
    } else {
      this.clearFormWarning(controlName, this.FORM_VAL_ERRORS.NO_EXIST);
    }
  }

  onInputDocNumChange(event: Event & { target: HTMLInputElement }) {
    const controlName = this.formControlNames.RECIPIENT.docNum;
    if (!event.target.value) {
      this.clearFormWarning(controlName, this.FORM_VAL_ERRORS.NO_EXIST);
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

  clearFormWarning(controlName: string, errorName: string): void {
    if (this.warning[controlName]?.[errorName]) {
      this.warning[controlName][errorName] = null;
    }
    if (
      this.warning[controlName] &&
      Object.values(this.warning[controlName]).every((value) => value === null)
    ) {
      this.warning[controlName] = null;
    }
  }

  setFormWarning(
    controlName: string,
    errorName: string,
    message?: string
  ): void {
    let warning = {};
    if (this.warning[controlName]) {
      warning = { ...this.warning[controlName] };
    }
    warning[errorName] = message ? { message } : true;
    this.warning[controlName] = warning;
  }

  getFirstWarning(controlName: string): string {
    return Object.keys(this.warning[controlName])[0];
  }

  clearTextControl(type: RelatedParty, controlName: string) {
    this.form.get(controlName).setValue('');
    if (type === 'RECIPIENT') {
      if (controlName === this.formControlNames.RECIPIENT.crrAcn) {
        this.form
          .get(this.formControlNames.RECIPIENT.crrAcnName)
          .setValue(null);
      } else {
        this.loadRecipientInfo(null, controlName);
      }
    } else {
      this.loadSenderInfo(null, controlName);
    }
  }

  validateDocIssueDate() {
    if (!this.recipientDocIssueDate.isDisable) {
      if (!this.recipientDocIssueDate.haveValue()) {
        this.recipientDocIssueDate.setErrorMsg('Ngày cấp không được bỏ trống');
        return false;
      } // Invalid Date
      else if (!this.recipientDocIssueDate.haveValidDate()) {
        this.recipientDocIssueDate.setErrorMsg('Ngày cấp không hợp lệ');
        return false;
      }
    }
    this.recipientDocIssueDate.setErrorMsg('');
    return true;
  }

  docIssueDateChange(): void {
    const recipientDocIssueDateCtrl = this.form.get(
      this.formControlNames.RECIPIENT.docIssueDate
    );

    if (this.validateDocIssueDate()) {
      const crrDateStr = this.recipientDocIssueDate.getValue();
      recipientDocIssueDateCtrl.setValue(crrDateStr, { emitEvent: false });
      if (!this.disabledForm) {
        this.updateIssuePlace();
      }
    } else {
      recipientDocIssueDateCtrl.setValue(null);
    }
  }

  getFeeAndVAT(
    callback: (param: FeeCalculationData) => void,
    callbackError?: (data: any) => void
  ): void {
    const sendAcnCtrlName = this.formControlNames.SENDER.acn;
    const sendCurCodeCtrlName = this.formControlNames.SENDER.curCode;

    this.form.get('productCode').markAsTouched();
    this.form.get('transactionAmount').markAsTouched();
    this.form.get(sendAcnCtrlName).markAsTouched();

    const curCode = this.form.get(sendCurCodeCtrlName).value;
    const productCode = this.form.get('productCode').value;
    const transactionAmount = this.form.get('transactionAmount').value;
    const isAcnValid =
      this.form.get(sendAcnCtrlName).valid || this.disabledForm;
    const isAmountValid =
      this.form.get('transactionAmount').valid || this.disabledForm;

    if (!(productCode && curCode && isAcnValid && isAmountValid)) {
      return;
    }

    const req: FeeCalculationRequest = {
      curCode,
      productCode,
      amount: transactionAmount,
      acn: this.form.get(sendAcnCtrlName).value?.trim(),
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

    const feeItemEx = this.feeCalData.feeItems.find(
      (item) => item.curCode !== CURRENCIES.VND
    );
    if (feeItemEx) {
      const feeEx = CalculationHelper.getRoundValue('EX', feeItemEx.feeAmount);
      const feeVATEx = CalculationHelper.getRoundValue('EX', feeItemEx.vat);
      this.form.get('feeEx').setValue(feeEx);
      this.form.get('feeVATEx').setValue(feeVATEx);
    }
  }

  updateTotal(): void {
    let totalAmount = this.form.get('transactionAmount').value;
    let fee = Number(this.form.get('fee').value);
    let vat = Number(this.form.get('feeVAT').value);

    const sendCurCodeCtrlName = this.formControlNames.SENDER.curCode;
    if (this.form.get(sendCurCodeCtrlName).value !== 'VND') {
      fee = Number(this.form.get('feeEx').value);
      vat = Number(this.form.get('feeVATEx').value);
    }
    if (this.form.get('feeType').value === FEE_TYPES.EXCLUDING) {
      totalAmount += fee + vat;
    }
    this.form.get('totalAmount').setValue(totalAmount);
  }

  getCrrProduct(): Product {
    const productCode = this.form.get('productCode').value;
    return INTERNAL_TRANSFER_PRODUCTS.find((prod) => prod.code === productCode);
  }

  getCrrSenderAccount(): Account {
    const senderAcn = this.form.get(this.formControlNames.SENDER.acn).value;
    return this.lstAccount.find((account) => account.acn === senderAcn?.trim());
  }

  checkAccMatchProduct(account: Account, acnControlName?: string): boolean {
    const crrProduct = this.getCrrProduct();
    if (!(crrProduct?.type && account?.curCode)) {
      return true;
    }

    const checkDomesticMatch =
      crrProduct?.type === PRODUCTS_TYPES.DOMESTIC &&
      account?.curCode === CURRENCIES.VND;

    const checkForeignMatch =
      crrProduct?.type === PRODUCTS_TYPES.FOREIGN &&
      account?.curCode !== CURRENCIES.VND;

    if (!(checkDomesticMatch || checkForeignMatch)) {
      this.setFormError(
        acnControlName ? acnControlName : this.formControlNames.SENDER.acn,
        this.FORM_VAL_ERRORS.NOT_MATCH_PROD
      );
      return false;
    }

    this.clearFormError(
      acnControlName ? acnControlName : this.formControlNames.SENDER.acn,
      this.FORM_VAL_ERRORS.NOT_MATCH_PROD
    );
    return true;
  }

  changeFeeType(event): void {
    this.updateTotal();
    this.updateTransAmountFeeAndVATValidation();
  }

  updateTransAmountFeeAndVATValidation(): void {
    let transactionAmount = this.form.get('transactionAmount').value;
    let fee = Number(this.form.get('fee').value);
    let vat = Number(this.form.get('feeVAT').value);

    const sendCurCodeCtrlName = this.formControlNames.SENDER.curCode;
    if (this.form.get(sendCurCodeCtrlName).value !== 'VND') {
      fee = Number(this.form.get('feeEx').value);
      vat = Number(this.form.get('feeVATEx').value);
    }
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
      this.clearFormError('transactionAmount', this.FORM_VAL_ERRORS.OVER_MAX);
    }
  }

  onUpdateFeeTable(params: OnUpdateFeeTableEmitParams) {
    this.updateTotal();
    this.updateTransAmountFeeAndVATValidation();
  }

  changeTransactionAmount(e: number): void {
    this.getFeeAndVAT((data: FeeCalculationData) => {
      this.updateFee();
      this.updateTotal();
      this.updateTransAmountFeeAndVATValidation();
    });
  }

  changeRecipientSearchType(activeType: 'GTXM' | 'ACN'): void {
    const inactiveType = activeType === 'GTXM' ? 'ACN' : 'GTXM';
    this.handleRecipientSearch(activeType, true);
    this.handleRecipientSearch(inactiveType, false);
  }

  handleRecipientSearch(type: 'GTXM' | 'ACN', enable: boolean) {
    if (this.disabledForm) {
      return;
    }

    if (!enable) {
      if (type === 'ACN') {
        this.form
          .get(this.formControlNames.RECIPIENT.branchCode)
          .setValue(null);
        this.form.get(this.formControlNames.RECIPIENT.curCode).setValue(null);
        this.form.get(this.formControlNames.RECIPIENT.name).setValue(null);
      } else {
        this.form
          .get(this.formControlNames.RECIPIENT.crrAcnBranchCode)
          .setValue(null);
      }
    }

    const activeFields = this.activeRecipientField[type];
    activeFields.forEach((field) => {
      const fieldControl = this.form.get(field);
      if (enable) {
        fieldControl.enable();
        if (this.recipientValidation[field]?.validators) {
          let validators = this.recipientValidation[field].validators;
          fieldControl.setValidators(validators);
        }
        fieldControl.updateValueAndValidity();

        if (this.recipientValidation[field]?.customValidation) {
          this.recipientValidation[field]?.customValidation();
        }
      } else {
        if (field === this.formControlNames.RECIPIENT.docType) {
          fieldControl.setValue(DOC_TYPES.CCCD);
        } else {
          fieldControl.setValue(null);
        }

        fieldControl.disable();
        fieldControl.clearValidators();
        fieldControl.updateValueAndValidity();
        this.warning[field] = null;
      }
    });
  }

  getFirstError(controlName: string): string {
    const errors = this.form.get(controlName)?.errors;
    return Object.keys(errors)[0];
  }

  validateForm(): boolean {
    this.validateDocIssueDate();
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      const errorElements = document.querySelectorAll(
        '.ng-invalid[formControlName],.input-error,input.ng-invalid'
      );
      let firstErrorEle: Element = errorElements.item(0);

      if (firstErrorEle) {
        firstErrorEle.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    return true;
  }

  changeRecipientDocType(event: Event & { target: HTMLInputElement }): void {
    this.updateIssuePlace();
  }

  updateIssuePlace() {
    const issueDate = this.form.get(
      this.formControlNames.RECIPIENT.docIssueDate
    ).value;
    const docType = this.form.get(
      this.formControlNames.RECIPIENT.docType
    ).value;
    this.form
      .get(this.formControlNames.RECIPIENT.docIssuePlace)
      .setValue(getIssuePlace(issueDate, docType, this.userInfo));
  }

  disableForm(): void {
    this.form.disable();
    this.warning = {};
  }

  enableForm(): void {
    const defaultDisableControlList = [
      this.formControlNames.SENDER.branchCode,
      this.formControlNames.SENDER.curCode,
      'totalAmount',
      'employeeId',
      this.formControlNames.RECIPIENT.curCode,
      this.formControlNames.RECIPIENT.branchCode,
      this.formControlNames.RECIPIENT.crrAcnBranchCode,
    ];

    const sendCurCodeCtrlName = this.formControlNames.SENDER.curCode;
    const curCode = this.form.get(sendCurCodeCtrlName).value;
    if (curCode && curCode !== CURRENCIES.VND) {
      defaultDisableControlList.push('fee');
      defaultDisableControlList.push('feeVAT');
    }

    Object.keys(this.form.controls || {}).forEach((key) => {
      if (!defaultDisableControlList.includes(key)) {
        this.form.controls[key].enable({ emitEvent: false });
      }
    });

    const recipientSearchType = this.form.get('recipientSearchType').value;
    this.changeRecipientSearchType(recipientSearchType);

    const productCode = this.form.get('productCode').value;
    if (productCode === INTERNAL_TRANSFER_PRODUCTS_CODES.CT01) {
      this.disabledSearchType.GTXM = true;
      this.disabledSearchType.ACN = false;
    } else if (productCode === INTERNAL_TRANSFER_PRODUCTS_CODES.CT02) {
      this.disabledSearchType.ACN = true;
      this.disabledSearchType.GTXM = false;
    } else {
      this.disabledSearchType.ACN = false;
      this.disabledSearchType.GTXM = false;
    }
  }

  customSearchRecipientDocNumFn(term: string, item: any): boolean {
    return item['docNum'].includes(term?.trim());
  }
}
