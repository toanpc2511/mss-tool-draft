import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {TaxService} from '../../../shared/services/tax.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IBeneficiaryBank, ICifInfo, ITaxInfo} from '../../../shared/interfaces/tax.interface';
import {SelectionModel} from '@angular/cdk/collections';
import {
  API_CITY,
  API_DISTRICT,
  API_WARD,
  DECISION_COLUMNS,
  LAND_COLUMNS
} from '../../../shared/constants/columns-tax.constant';
import {EPaymentChannelType, ETaxType, PAYMENT_METHODS} from '../../../shared/constants/tax.constant';
import {IError} from '../../../../../shared/models/error.model';
import {CustomNotificationService} from '../../../../../shared/services/custom-notification.service';
import {ActionModel} from '../../../../../shared/models/ActionModel';
import {ultis} from '../../../../../shared/utilites/function';
import * as moment from 'moment';
import {VnCurency} from '../../../../../shared/pipes/vn-curentcy.pipe';
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.scss']
})
export class CreateTransactionComponent implements OnInit {
  transferForm: FormGroup;
  payerInfoForm: FormGroup;
  cifInfoForm: FormGroup;
  creditForm: FormGroup;
  payInfoForm: FormGroup; // thông tin thuế
  subsectionFormArr: FormArray = new FormArray([]); // thông tin tiểu mục
  column: any[];
  paymentMethods = PAYMENT_METHODS;
  apiCity = API_CITY;
  taxType = ETaxType;
  apiDistrict = '';
  apiWard = '';
  billAmount: number;
  billSelected: any;
  isPayer = false;
  isTransfer = true;
  chapterChange: number = 0;
  beneficiaryBanks: IBeneficiaryBank[] = [];
  actions: ActionModel[];
  accNumbers: ICifInfo[] = [];
  @Input() data: ITaxInfo;
  @Input() selection = new SelectionModel<any>(true, []);

  config = {
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: false,
    hiddenActionColumn: true,
  };

  constructor(
    private taxService: TaxService,
    private fb: FormBuilder,
    private notify: CustomNotificationService,
    private vnCurrency: VnCurency,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.initForm();
    this.actions = [
      {
        actionName: 'Lưu giao dịch',
        actionIcon: 'send',
        actionClick: () => this.onSave()
      },
      {
        actionName: 'Làm lại',
        actionIcon: 'replay',
        actionClick: () => this.resetForm()
      }
    ];
  }

  /** init form */
  initForm(): void {
    this.initTransferForm();
    this.initCifForm();
    this.initPayInfoForm();
    this.initCreditForm();
    this.initPayerInfoForm();
  }

  initPayInfoForm(): void {
    this.payInfoForm = this.fb.group({
      payerName: ['', [Validators.required]],
      payerAddress: ['', [Validators.required]],
      administrationCode: ['', [Validators.required]],
    });
  }

  initTransferForm(): void {
    this.transferForm = this.fb.group({
      paymentType: [this.paymentMethods[0].value],
      fee: [{value: 0, disabled: true}],
      amount: [{value: '', disabled: true}],
      detail: [{value: '', disabled: true}, [Validators.required, Validators.maxLength(210)]],
      note: [''],
    });
  }

  initCifForm(): void {
    this.cifInfoForm = this.fb.group({
      cif: [null, [Validators.required]],
      account: [null, [Validators.required]],
      accountName: [''],
      accountNumber: [''],
      availableBalance: [''],
      branchCode: ['']
    });
  }

  initCreditForm(): void {
    this.creditForm = this.fb.group({
      bankInfo: ['', [Validators.required]],
    });
  }

  initPayerInfoForm(): void {
    this.payerInfoForm = this.fb.group({
      payerName: [''],
      taxCode: [''],
      payerAddress: [''],
      city: [''],
      district: [''],
      ward: [''],
      replacerAddress: [{value: '', disabled: true}],
    });
    this.payerInfoForm.disable();
  }

  ngOnInit(): void {
    this.initData();
    this.changeAccNumber();
  }

  initData(): void {
    this.payInfoForm.patchValue({
      payerName: this.data.infoData.payerName,
      payerAddress: this.data.infoData.payerAddress,
      administrationCode: this.data.infoData.administrationCode
    });
    if (this.data.beneficiaryBank) {
      this.beneficiaryBanks.push(this.data.beneficiaryBank);
      this.creditForm.get('bankInfo').patchValue(this.data.beneficiaryBank);
      // this.creditForm.disable();
    } else {
      this.taxService.getBeneficiaryBanks().subscribe((res) => {
        if (res.data) {
          this.beneficiaryBanks = res.data;
        }
      }, (error: IError) => this.notify.handleErrors(error));
    }
    this.subsectionFormArr = this.convertToFormArray();
    switch (this.data?.taxTypeCode) {
      case 'TCT_QUERY_LPTB':
        this.column = DECISION_COLUMNS;
        break;
      case 'TCT_QUERY_TND':
        this.column = LAND_COLUMNS;
        break;
      default:
        this.column = [];
        break;
    }
    this.cdr.detectChanges();
  }

  convertToFormArray(): FormArray {
    const control = this.data.subSectionResponses.map((item) => {
      return this.fb.group({
        id: [item.id],
        chapter: [item.chapter, [Validators.required, Validators.minLength(3)]],
        subSectionCode: [item.subSectionCode],
        subSectionName: [item.subSectionName],
        billAmount: [item.billAmount],
        fund: [item.fund],
        decisionNumber: [item.decisionNumber || ''],
        taxCycle: [item.taxCycle || '']
      });
    });
    return this.fb.array(control);
  }

  /** Handle form transaction */
  changePaymentType(): void {
    this.cifInfoForm.reset();
    this.isTransfer = this.transferForm.get('paymentType').value === this.paymentMethods[0].value;
  }

  /** Handle form debt info */
  onSearchCifInfo(): void {
    this.cifInfoForm.get('cif').markAsTouched();
    if (this.cifInfoForm.get('cif').invalid) {
      return;
    }
    const params = {
      customerCifNumber: this.cifInfoForm.get('cif').value,
      pageNumber: 1,
      recordPerPage: 9999
    };
    this.taxService.searchCif(params)
      .subscribe((res) => {
        if (res.data) {
          this.accNumbers = res.data;
          this.cifInfoForm.patchValue({
            account: this.accNumbers[0],
            accountNumber: this.accNumbers[0].accountNumber,
            accountName: res.data[0].accountName,
            availableBalance: res.data[0].availableBalance,
            branchCode: res.data[0].branchCode
          });
        }
      }, (error: IError) => this.notify.handleErrors(error));
  }

  changeCifInfo(): void {
    this.accNumbers = [];
    this.cifInfoForm.controls.accountNumber.patchValue(null);
  }

  changeAccNumber(): void {
    this.cifInfoForm.get('account').valueChanges
      .subscribe((value) => {
        this.cifInfoForm.patchValue({
          accountNumber: value?.accountNumber || '',
          accountName: value?.accountName || '',
          availableBalance: value?.availableBalance || '',
          branchCode: value?.branchCode || ''
        });
      });
  }

  /** Select transaction other */
  backSearchTrans(): void {
    this.taxService.taxInfoSubject.next(null);
  }

  /** Handle info address */
  changeCity(): void {
    const cityCode = this.payerInfoForm.get('city').value;
    this.apiDistrict = cityCode ? `${API_DISTRICT}?cityCode=${cityCode.code}` : '';
    this.payerInfoForm.controls.district.reset();
    this.payerInfoForm.controls.ward.reset();
    this.handleReplacerAddress();

  }

  changeDistrict(): void {
    const districtCode = this.payerInfoForm.get('district').value;
    this.apiWard = districtCode ? `${API_WARD}?districtCode=${districtCode.code}` : '';
    this.payerInfoForm.controls.ward.reset();
    this.handleReplacerAddress();
  }

  handleReplacerAddress(): void {
    const valueForm = this.payerInfoForm.value;
    let address = '';
    const payerAddress = valueForm.payerAddress ?  `${valueForm.payerAddress}, ` : '';
    const city = valueForm.city ?  `${valueForm.city.name}, ` : '';
    const district = valueForm.district ?  `${valueForm.district.name}, ` : '';
    const ward = valueForm.ward ?  `${valueForm.ward.name}, ` : '';
    address = payerAddress + ward + district + city;
    this.payerInfoForm.controls.replacerAddress.setValue(address);
    this.cdr.detectChanges();
  }

  /** Add payer other */
  addInfoUser(): void {
    this.isPayer = !this.isPayer;
    this.payerInfoForm.reset();
    this.isPayer
      ? this.payerInfoForm.enable({onlySelf: true, emitEvent: true})
      : this.payerInfoForm.disable({onlySelf: false, emitEvent: false});
    this.payerInfoForm.get('replacerAddress').disable();
    return;
  }

  /** Table custom */
  onCheckAllChange(checked: any): void {
    this.subsectionFormArr.value.map((x) => {
      if (checked) {
        this.selection.select(x.id);
      } else {
        this.selection.deselect(x.id);
      }
    });
    this.handleSelectBill();
  }

  isSelectedAll(): any {
    const data = this.subsectionFormArr.value.filter((row) => {
      return this.selection.isSelected(row.id);
    });
    return this.subsectionFormArr.value.length === data.length;
  }

  isIndeterminate(): any {
    const data = this.subsectionFormArr.value.filter((row) => {
      return this.selection.isSelected(row.id);
    });
    return data.length > 0 && data.length < this.subsectionFormArr.value.length;
  }

  onCheckRowChange(checked: any, row: any): void {
    if (checked) {
      this.selection.select(row?.id);
    } else {
      this.selection.deselect(row?.id);
    }
    this.handleSelectBill();
  }

  isSelected(row: any): any {
    return this.selection.isSelected(row.id);
  }

  /** Event selected bill */
  handleSelectBill(): void {
    let totalAmount = 0;
    const billSelected = this.subsectionFormArr.value
      .filter((x) => this.selection.selected.includes(x.id));
    billSelected.map((item) => {
      totalAmount += item.billAmount;
    });
    this.billSelected = billSelected;
    const vatValue = Number(this.transferForm.getRawValue().fee);
    this.billAmount = totalAmount - vatValue;
    this.transferForm.get('amount').patchValue(this.vnCurrency.transform(this.billAmount));
    this.handleContentBill(billSelected);
  }

  handleContentBill(billSelected: any): void {
    const data = {
      KB: this.data?.treasuryNumber,
      NgayNT: moment().format('DDMMyyyy'),
      MST: this.data?.taxCode,
      DBHC: this.data?.administrationCode,
      TKNS: this.data?.subSectionResponses[0].fund,
      CQT: this.data?.organReceive,
      LThue: this.data?.taxTypeApi,
      STB: this.data?.decisionNumber,
      NTB: moment(this.data?.decisionDate).format('DDMMyyyy'),
      SK: this.data?.metadataList[0]?.containerNumber || '',
      SM: this.data?.metadataList[0]?.engineNumber || '',
      billSelected: billSelected.map((item) => ({
        C: item.chapter,
        TM: item.subSectionCode,
        KT: item.subSectionCode,
        ST: item.billAmount,
        Gchu: item.note
      }))
    };
    // console.log(ultis.handleContentBill(data));
    this.transferForm.get('detail').patchValue(ultis.handleContentBill(data));
    if (ultis.handleContentBill(data).length > 210) {
      this.transferForm.get('detail').enable();
    }
  }

  changeChapter(index: number): void {
    const chapterValue = this.subsectionFormArr.value[index].chapter;
    const params = {
      code: chapterValue
    };
    if (this.subsectionFormArr.controls[index].get('chapter').invalid) {
      return;
    }
    this.taxService.checkChapter(params).subscribe(() => {
      this.subsectionFormArr.controls[index].get('chapter').setErrors(null);
      this.chapterChange = Number(chapterValue);
      this.subsectionFormArr.controls.forEach((control, i: number) => {
        if (i !== index) {
          control.get('chapter').patchValue(chapterValue);
        }
      });
    }, (error: IError) => {
      this.subsectionFormArr.controls[index].get('chapter').setErrors({existed: true});
      this.notify.handleErrors(error);
    });
    this.cdr.detectChanges();
  }

  /** Event Save | Reset Form */
  resetForm(): void {
    this.initData();
    this.selection.clear();
    this.isPayer = false;
    this.initPayerInfoForm();
    this.initTransferForm();
    this.initCifForm();
  }

  onSave(): void {
    this.creditForm.markAllAsTouched();
    this.payInfoForm.markAllAsTouched();
    this.transferForm.markAllAsTouched();
    this.cifInfoForm.markAllAsTouched();
    if (this.subsectionFormArr.invalid) {
      return;
    }
    if (
      this.creditForm.invalid
      || this.payInfoForm.invalid
      || this.transferForm.invalid
      || (this.isTransfer && this.cifInfoForm.invalid)
    ) {
      return;
    }
    if (this.selection.selected.length <= 0) {
      this.notify.warning('Cảnh báo', 'Vui lòng chọn hóa đơn để tiếp tục thanh toán');
      return;
    }
    this.handleSave();
  }

  handleSave(): void {
    const valueCreditForm = this.creditForm.getRawValue();
    const valueCifInfoForm = this.cifInfoForm.value;
    const valuePayInfoForm = this.payInfoForm.value;
    const valuePayerInfoForm = this.payerInfoForm.getRawValue();
    const valueTransactionForm = this.transferForm.getRawValue();
    const subSectionResponses = this.billSelected.map((item) => {
      delete item.id;
      return {
      ...item,
          chapter: Number(item.chapter)
      };
    });
    const body = {
      accountCreditName: valueCreditForm.bankInfo.bankName,
      accountCreditNumber: valueCreditForm.bankInfo.bankNumber,
      accountDebitName: valueCifInfoForm.accountName,
      accountDebitNumber: valueCifInfoForm?.accountNumber,
      administrationCodeChange: valuePayInfoForm.administrationCode,
      billAmount: this.billAmount,
      branchCodeCredit: valueCreditForm.bankInfo.branchCode,
      branchCodeDebit: valueCifInfoForm.branchCode,
      chapterChange: this.chapterChange,
      cif: valueCifInfoForm.cif,
      description: valueTransactionForm.detail,
      infoData: {
        ...this.data.infoData,
        administrationCodeChange: valuePayInfoForm.administrationCode,
      },
      metadataList: this.data.metadataList,
      note: valueTransactionForm.note,
      payerAddressChange: valuePayInfoForm.payerAddress,
      payerNameChange: valuePayInfoForm.payerName,
      payerPhone: valuePayInfoForm.payerPhone,
      paymentChannelType: EPaymentChannelType.TELLER,
      paymentType: valueTransactionForm.paymentType,
      preBalance: valueCifInfoForm.availableBalance,
      replacerName: valuePayerInfoForm.payerName,
      replacerAddress: valuePayerInfoForm.replacerAddress,
      replacerTaxCode: valuePayerInfoForm.taxCode,
      subSectionResponses,
      taxCode: this.data.infoData.taxCode,
      taxType: this.data.infoData.taxTypeCode,
      treasuryCode: this.data.treasuryNumber,
    }
    console.log(body);
    this.taxService.createTransactionPersonal(body).subscribe((res) => {
      if (res.data) {
        this.notify.success('Thông báo', 'Tạo giao dịch thành công!');
        this.router.navigate(['tax-service/personal-tax/detail'], {queryParams: {id: res.data.id}});
      }
    }, (error: IError) => this.notify.handleErrors(error));
  }
}
