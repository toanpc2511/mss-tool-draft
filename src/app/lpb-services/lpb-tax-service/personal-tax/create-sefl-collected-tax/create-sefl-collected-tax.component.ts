import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, AbstractControl, Validators } from '@angular/forms';
import { SUBSECTION_CREATE_COLUMNS } from '../../shared/constants/columns-tax2.constant';
import { ECategoryType, EPaymentChannelType, ETaxType, PAYMENT_METHODS } from '../../shared/constants/tax.constant';
import { TaxService } from '../../shared/services/tax.service';
import { FormMessageService } from 'src/app/shared/services/form-message.service';
import { ICifSearch, IFilterCifSearch } from '../../shared/interfaces/tax.interface';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { API_DISTRICT, API_WARD } from '../../shared/constants/columns-tax.constant';
import { forkJoin } from 'rxjs';
import { ultis } from 'src/app/shared/utilites/function';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-sefl-collected-tax',
  templateUrl: './create-sefl-collected-tax.component.html',
  styleUrls: ['./create-sefl-collected-tax.component.scss']
})
export class CreateSeflCollectedTaxComponent implements OnInit {
  private uid = 0;
  maxLength = 210;
  paymentMethods = PAYMENT_METHODS;
  createForm = this.fb.group({
    treasury: [null, Validators.required],
    organReceiver: [null, Validators.required],
    taxCode: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(14)]],
    taxPayerName: ["", Validators.required],
    identityNumber: ["", Validators.required],
    address: ["", Validators.required],
    administrativeAreaCode: ["", Validators.required],
    frameNumber: [""],
    machineNumber: [""],
    propertyInfo: [""],
    tableRows: this.fb.array([this.initRows()]),
    //
    paymentMethod: [this.paymentMethods[0].value, Validators.required],
    fee: [0],
    paymentAmount: [0, Validators.required],
    paymentContent: ["", [Validators.required, Validators.maxLength(this.maxLength)]],
    receivedBank: [null, Validators.required],
    note: [""],
    cifNumber: ["", Validators.required],
    debitAcc: [null, Validators.required],
    //
    insteaderName: [""],
    insteaderTaxCode: [""],
    insteaderAddress: [""],
    city: [null],
    district: [null],
    ward: [null],
  })

  configSelect = {
    paging: true,
    isNewApi: true,
  }

  customerAccounts: ICifSearch[] = [];
  isLoading = false;
  columns = SUBSECTION_CREATE_COLUMNS;
  allowInputInsteader = false;
  oldValue = "";

  get tableRows() {
    return this.createForm.get("tableRows") as FormArray;
  }

  treasuries = [];
  agencies = [];
  chapters = [];
  subsections = [];
  editPaymentContent = false;

  apiDistrict = "";
  apiWard = "";

  actions: ActionModel[] = [
    {
      actionName: "Lưu giao dịch",
      actionIcon: "save",
      actionClick: () => this.save()
    },
    {
      actionName: "Làm lại",
      actionIcon: "autorenew",
      actionClick: () => this.reset()
    }
  ]

  constructor(
    private fb: FormBuilder,
    private taxService: TaxService,
    private formMessageService: FormMessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setInit();
  }

  setInit() {
    
  }

  invalid(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
  }

  formValueChange() {
    this.setPaymentContent();
  }


  setPaymentContent() {
    this.createForm.patchValue({
      paymentContent: this.getPaymentContent()
    })
  }

  editContent() {
    if (this.createForm.controls["paymentContent"].value.length > this.maxLength) {
      this.editPaymentContent = !this.editPaymentContent;
    }
  }

  blurEdit() {
    this.editPaymentContent = false;
  }

  getPaymentContent() {
    const valueCreateForm = this.createForm.getRawValue();
    const curDate = new Date();
    const [day, month, year] = [curDate.getDate(), curDate.getMonth() + 1, curDate.getFullYear()]
    const strDate = `${day}${month}${year}`;
    let paymentContentDetail = "";
    const count = this.tableRows.length;
    let budgetAcc = "";
    let countBudgetAcc = 1;
    for (let index = 0; index < count; index++) {
      if (index === 0) {
        budgetAcc = this.tableRows.at(index).get("budgetAcc").value
      } else {
        if (this.tableRows.at(index).get("budgetAcc").value != budgetAcc) {
          countBudgetAcc++;
        }
      }
      let content = "";
      content += `C:${this.tableRows.at(index).get("chapterCode").value || ""}`
      content += `-TM:${this.tableRows.at(index).get("subsection").value?.code || ""}`
      content += `-KT:${this.tableRows.at(index).get("taxPeriod").value}`
      content += `-ST:${this.tableRows.at(index).get("amount").value.split(".").join("")}`
      content += `-Gchu:`;
      paymentContentDetail += `(${content})`
    }

    let paymentContent = `KB:${valueCreateForm.treasury?.code || ""}`
    paymentContent += `+NgayNT:${strDate}+MST:${valueCreateForm.taxCode || ""}`
    paymentContent += `+DBHC:${valueCreateForm.administrativeAreaCode || ""}`
    paymentContent += `+TKNS:${countBudgetAcc === 1 ? budgetAcc : ''}`
    paymentContent += `+CQT:${valueCreateForm.organReceiver?.code || ""}+LThue:`

    paymentContent += paymentContentDetail;
    return paymentContent;
  }

  getTotalAmount() {
    let totalAmount = 0;
    const count = this.tableRows.length;
    for (let index = 0; index < count; index++) {
      const amount = ultis.stringToNumber(this.tableRows.at(index).get("amount").value);
      totalAmount += amount;
    }
    return totalAmount;
  }

  initRows() {
    return this.fb.group({
      uid: this.nextUid(),
      chapterCode: [null, Validators.required],
      subsection: [null, Validators.required],
      decisionNumber: ["", Validators.required],
      taxPeriod: ["", Validators.required],
      amount: ["", Validators.required],
      budgetAcc: ["", Validators.required],
    });
  }

  trackByFn(index: number, row: AbstractControl) {
    return row.value.uid;
  }

  private nextUid() {
    this.uid++;
    return this.uid;
  }

  addRow() {
    this.tableRows.push(this.initRows());
  }

  deleteRow(idx) {
    this.tableRows.removeAt(idx);
  }

  focusInput(value) {
    this.oldValue = value;
  }

  valueChange(event, dataRow, columnName) {
    if (columnName === "amount") {
      this.createForm.patchValue({
        paymentAmount: this.getTotalAmount()
      })
    }
    if (columnName !== "decisionNumber") {
      this.setPaymentContent();
    }
  }

  async searchAccountCustomers() {
    if (!this.createForm.value["cifNumber"] || !this.createForm.value["cifNumber"].trim()) {
      this.createForm.controls["cifNumber"].markAsTouched();
      return;
    }
    this.isLoading = true;
    let params: IFilterCifSearch = {
      customerCifNumber: this.createForm.value["cifNumber"].trim(),
      pageNumber: 999999,
      recordPerPage: 1,
    }
    await this.taxService.getAccountCustomers(params.customerCifNumber, params.pageNumber, params.recordPerPage).toPromise().then(res => {
      if (res["data"]) {
        this.customerAccounts = res["data"];
        this.createForm.patchValue({
          debitAcc: this.customerAccounts[0]
        })
      }
    }).catch(err => {
      this.formMessageService.handleError(err);
    }).finally(() => {
      this.isLoading = false;
    })
  }

  allowInputInsteaderChange() {
    this.allowInputInsteader = !this.allowInputInsteader;
  }

  changeCity(): void {
    const cityCode = this.createForm.get('city').value.code;
    this.apiDistrict = cityCode ? `${API_DISTRICT}?cityCode=${cityCode}` : '';
    this.createForm.controls.district.reset();
    this.createForm.controls.ward.reset();
  }

  changeDistrict(): void {
    const districtCode = this.createForm.get('district').value;
    this.apiWard = districtCode ? `${API_WARD}?districtCode=${districtCode}` : '';
    this.createForm.controls.ward.reset();
  }

  reset() {
    this.createForm.reset();
    this.uid = 0;
    this.tableRows.clear();
    this.addRow();
  }

  save() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }
    const formValue = this.createForm.getRawValue();
    const subSectionResponses = this.tableRows.getRawValue().map(x => {
      return {
        chapter: +x.chapterCode, billAmount: ultis.stringToNumber(x.amount), taxCycle: x.taxPeriod, decisionNumber: x.decisionNumber,
        subSectionCode: x.subsection?.code, subSectionName: x.subsection?.name, fund: x.budgetAcc
      };
    });

    const body = {
      accountCreditName: formValue.receivedBank?.bankName,
      accountCreditNumber: formValue.receivedBank?.bankNumber,
      accountDebitName: formValue.debitAcc?.accountName,
      accountDebitNumber: formValue.debitAcc?.accountNumber,
      branchCodeDebit: formValue.debitAcc?.branchCode,
      preBalance: formValue.debitAcc?.availableBalance,
      address: formValue.address,
      billAmount: formValue.paymentAmount,
      cif: formValue.cifNumber,
      engineNumber: formValue.machineNumber,
      note: formValue.note,
      payerAddress: formValue.address,
      payerName: formValue.taxPayerName,
      paymentChannelType: EPaymentChannelType.TELLER,
      subSectionResponses,
      treasuryCode: formValue.treasury?.code,
      payerAddressChange: formValue.address,
      payerNameChange: formValue.taxPayerName,
      paymentType: formValue.paymentMethod,
      replacerAddress: `${formValue.insteaderAddress}, ${formValue.ward?.name || ""}, ${formValue.district?.name || ""}, ${formValue.city?.name || ""}`,
      replacerName: formValue.insteaderName,
      replacerTaxCode: formValue.insteaderTaxCode,
      taxCode: formValue.taxCode,
      payerPhone: formValue.debitAcc?.custPhone,
      taxType: ETaxType.TCT_QUERY_TCN,
      administrationCode: formValue.administrativeAreaCode,
      containerNumber: formValue.frameNumber,
      descriptionDetail: formValue.paymentContent,
      identifyNumber: formValue.identityNumber,
      trafficDescribe: formValue.propertyInfo,

      organReceiverCode: formValue.organReceiver?.code,
      organReceiverName: formValue.organReceiver?.name,
      treasuryName: formValue.treasury?.name,
    }

    this.taxService.createTransactionPersonalSelf(body).toPromise().then((res) => {
      if (res.data) {
        this.formMessageService.openMessageSuccess("Tạo giao dịch thành công !")
        this.router.navigate(['tax-service/personal-tax/detail'], { queryParams: { id: res.data.id } });
      }
    }).catch(err => {
      this.formMessageService.handleError(err);
    })
  }

}
