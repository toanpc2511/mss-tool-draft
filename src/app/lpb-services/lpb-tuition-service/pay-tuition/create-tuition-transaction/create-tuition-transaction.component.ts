import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { FormMessageComponent } from '../../shared/components/form-message/form-message.component';

import {
  ICustomerInfo,
  IDebitAccountInfo,
  IFilterCreatePayment,
  IListBillInfo,
  IRuleResponses,
  ISchool,
  ISettleAccountInfo,
  ISupplierFormGroups,
  ITranPost,
  ITranPostResponse,
  ITransaction,
  ITransactionCreate,
} from '../../shared/models/tuition.interface';
import { HandleErrorService } from '../../shared/services/handleError.service';
import { TuitionService } from '../../shared/services/tuition.service';
import { PaymentInfoComponent } from '../../shared/components/payment-info/payment-info.component';
import { LpbDatatableConfig } from '../../../../shared/models/LpbDatatableConfig';
import {
  PaymentPeroidType,
  PaymentType,
} from '../../../../shared/enums/PaymentType';

import { Router } from '@angular/router';
import { COLUMNS_BILLS, TAIKHOANTM } from '../../shared/constants/tuition.constant';
import { ultis } from 'src/app/shared/utilites/function';
import { NgNotFoundTemplateDirective } from '@ng-select/ng-select/lib/ng-templates.directive';
import { LpbDatatableComponent } from 'src/app/shared/components/lpb-datatable/lpb-datatable.component';
import * as moment from 'moment';
import { log } from 'console';
import { Cif } from 'src/app/_models/cif';

declare var $: any;

@Component({
  selector: 'app-pay-tuition',
  templateUrl: './create-tuition-transaction.component.html',
  styleUrls: ['./create-tuition-transaction.component.scss']
})

export class CreateTuitionTransactionComponent implements OnInit {
  formSearch = this.fb.group({
    univerCode: [null, [Validators.required]],
    studentCode: ['', [Validators.required]],
  });

  selectedUniver: any;
  searched = false;
  isLoading = false;
  //
  dataSource: IListBillInfo[] = [];
  dataSource_Recall: IListBillInfo[] = [];
  customerInfo: ICustomerInfo;
  settleAccountInfo: ISettleAccountInfo;
  debitAccountInfo: IDebitAccountInfo;
  supplierFormGroups: ISupplierFormGroups[];
  periodPaymentType: IRuleResponses[];
  schools: ISchool[];
  schoolSource: ISchool[];
  paymentRuleName = '';
  clearSelected = false;
  consta = TAIKHOANTM;
  prefix: string = '';
  billFormat: string = '';
  PaymentContentRoot = '';
  paymentContentTemp = '';
  config: LpbDatatableConfig = {
    hasNoIndex: true,
    hasSelection: true,
     paymentConfig: {
       sortBy: 'sortColumn',
       totalAmount: 0,
       paymentType: PaymentType.ALL_OR_PART,
       paymentPeroidType: PaymentPeroidType.MULTIPE,
       type: 'string',
     },
    hiddenActionColumn: true,
  };

  rootPaymentType = PaymentType.ANY;
  columns = COLUMNS_BILLS;
  rowsSelected = [];
  typeServiceChangeDebt = PaymentType.PART;
  searchConditions: {
    property: string,
    operator: string,
    value: string
  }[] = [];

  paymentContentStart = '';
  @ViewChild('paymentInfo') paymentInfo: PaymentInfoComponent;
  @ViewChild(LpbDatatableComponent) child: LpbDatatableComponent;

   actions: ActionModel[] = [
     {
       actionName: 'Hủy',
       actionIcon: '',
       actionClick: () => this.cancel(),
     },
     {
       actionName: 'Lưu',
       actionIcon: 'save',
       actionClick: () => this.save(),
     },
   ];



  constructor(public matdialog: MatDialog,
    private router: Router,
    private tuitionService: TuitionService,
    private fb: FormBuilder,
    private handleErrorService: HandleErrorService)
    { }

  ngOnInit() {
    $('.childName').html('Thanh toán tại quầy / Tạo thanh toán');

    this.tuitionService
    .getListUniversityActive()
    .pipe()
    .subscribe((res) => {
      if (res.data) {
        this.schoolSource = res.data;
      }
    });
  }

  getTkSchools(code:string) {
     this.tuitionService
       .getUniversityByCode(code)
       .pipe()
       .subscribe((res) => {
         if (res.data) {
           this.schools = res.data;
           this.prefix = this.schools[0].universityMetadata.prefixFormat;
           this.billFormat = this.schools[0].universityMetadata.billFormat;
           console.log(this.prefix);
           if(this.paymentInfo !== undefined)
           {
             this.paymentInfo.formPayment.patchValue({
             accountNumberCredit: res.data[0].accNo,
             accountCreditBranch : res.data[0].branchAccNo,
             accountNameCredit: res.data[0].name,      
             accVat: res.data[0].accVat,
             accFee: res.data[0].accFee ,
             univerName:res.data[0].name,
             univerCode:res.data[0].code

           });
          }


           this.settleAccountInfo = {
            settleAcBrn: res.data[0].branchAccNo,
            settleAcDesc: res.data[0].name,
            settleAcNo : res.data[0].accNo
           };

         }
       });
  }



   async search() {
      this.formSearch.markAllAsTouched();
       if (this.formSearch.invalid) {
        return;
       }

      this.searched = false;
      this.isLoading = true;
      this.getTkSchools(this.formSearch.value.univerCode);

       this.tuitionService
       .getBills(this.formSearch.value.studentCode, this.formSearch.value.univerCode)
       .pipe()
       .subscribe((res) => {
         if (res.data) {
          let dataSource = res['data'];
          dataSource = dataSource.map((item) => {
            return {
          ...item, sortColumn: `${item.year}${item.semester}`, itemNo: 0
            };
          });

          let startNo = 0;
          dataSource.forEach((item) => {
                item.itemNo = startNo;
                startNo = startNo+1;
          })

          if(dataSource.length > 0)
          {
            this.PaymentContentRoot = this.prefix.replace('${studentCode}',dataSource[0].studentCode);
            this.PaymentContentRoot = this.PaymentContentRoot.replace('${studentName}',dataSource[0].studentName);
            this.PaymentContentRoot = this.PaymentContentRoot.replace('${className}',dataSource[0].className);
            this.paymentContentTemp = this.PaymentContentRoot;
          }
          this.dataSource = dataSource;
          this.paymentContentStart = 'CP03';
          this.searched = true;
         }
       });
       this.isLoading = false;


   }

  infoSearchChange() {
    this.searched = false;
  }

  getRowSelected(rowsSelected) {
    this.rowsSelected = rowsSelected;
  }

  chkAll(selected): any {
    console.log(selected);
    if(selected.length ===0)
    {
      if(this.paymentInfo !== undefined)
      {
     
        this.paymentInfo.formPayment.patchValue({
          paymentAmount: 0,
          paymentContent: '',
        });
       }

      this.paymentContentTemp = this.PaymentContentRoot;
      return;
    }

    this.getTkSchools(this.formSearch.value.univerCode.trim());
    this.rowsSelected = selected;
    let totalAmount = 0;
    let billData = '';
    this.rowsSelected.forEach((item) => {
      totalAmount += Number(item.amount);
      let bill_sub = this.billFormat.replace('${semester}',item.semester);
      bill_sub = bill_sub.replace('${year}',item.year);
      bill_sub = bill_sub.replace('${amount}',item.amount);
      billData += bill_sub;
    })

    this.paymentContentTemp = this.paymentContentTemp + '-'+billData;
    this.paymentInfo.formPayment.patchValue({
            paymentAmount: totalAmount,
            paymentContent: this.paymentContentTemp,
          });

  }

  chkClickChange(value): any {
    let billInfo = this.paymentInfo.formPayment.value.paymentContent;
    let paymentAmount = this.paymentInfo.formPayment.value.paymentAmount;

    let valueTemp = '';
    let bill_sub = '';
    if (value.operatorType === 'plus') {
      paymentAmount += Number.parseFloat(value.row.amount);
      bill_sub = this.billFormat.replace('${semester}',value.row.semester);
      bill_sub = bill_sub.replace('${year}',value.row.year);
      bill_sub = bill_sub.replace('${amount}',value.row.amount);

      this.paymentContentTemp = this.paymentContentTemp + '-' + bill_sub;

      // if (!billInfo.includes(this.paymentContentStart)) {
      //   billInfo = `${this.paymentContentStart}${billInfo}`;
      // }
    } else {

      bill_sub = this.billFormat.replace('${semester}',value.row.semester);
      bill_sub = bill_sub.replace('${year}',value.row.year);
      bill_sub = bill_sub.replace('${amount}',value.row.amount);

      this.paymentContentTemp = this.paymentContentTemp.replace('-'+bill_sub,'');
      this.paymentContentTemp = this.paymentContentTemp.replace(bill_sub,'');


      paymentAmount -= Number.parseFloat(value.row.amount);

      //billInfo = billInfo.replace(' ' + value.row.billInfo, '');

    }
    if(this.paymentContentTemp !== this.PaymentContentRoot)
      {
        valueTemp = this.paymentContentTemp;
      }
    this.paymentInfo.formPayment.patchValue({
      paymentAmount: paymentAmount,
      paymentContent:  valueTemp,

    });
    this.getTkSchools(this.formSearch.value.univerCode.trim());
  }


  invalid(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
  }

  setRuleConfig() {
    let formGroup3 = this.supplierFormGroups.find(x => x["code"] === "UNI-FORMGROUP3");
    // if (formGroup3) {
    //   const paymentRuleGroup3 = formGroup3["ruleResponses"].find(x => x.selected);
    //   if (paymentRuleGroup3 && paymentRuleGroup3.code === "UNI-RULE7") {
    //     this.typeServiceChangeDebt = PaymentType.ALL
    //   }
    // }

    // if (this.periodPaymentType[0].code === 'UNI-RULE1') {
       this.config.paymentConfig.paymentPeroidType =
         PaymentPeroidType.MULTIPE;
     //}
    // if (this.periodPaymentType[0].code === 'UNI-RULE2') {
    //   this.config.paymentConfig.paymentPeroidType =
    //     PaymentPeroidType.FAR_TO_NEAR;
    // }
    // if (this.periodPaymentType[0].code === 'UNI-RULE3') {
    //   this.config.paymentConfig.paymentPeroidType = PaymentPeroidType.ANY;
    // }
    // if (this.periodPaymentType[1].code === 'UNI-RULE4') {
    //   // Một kỳ
    //   this.config.paymentConfig.paymentType = PaymentType.PART;
    // }
    // if (this.periodPaymentType[1].code === 'UNI-RULE5' || this.typeServiceChangeDebt === PaymentType.ALL) {
    //   // Toàn bộ
    //   this.config.paymentConfig.paymentType = PaymentType.ALL;
    // }
    // if (this.periodPaymentType[1].code === 'UNI-RULE6') {
    //   this.config.paymentConfig.paymentType = PaymentType.ALL_OR_PART;
    // }
    // this.rootPaymentType = this.config.paymentConfig.paymentType;
  }

  save(): void {
    let valueForm = this.paymentInfo.formPayment.value;
     if (this.disabledSave() || this.isLoading) {
       if (this.disabledSave()) {
         this.handleErrorService.openMessageError('Bạn nhập chưa đủ thông tin !');
       }
       return;
     }

     // validate

    //  console.log(this.rowsSelected);
    //   for (let index = 0; index < this.rowsSelected.length; index++) {

    //      console.log(this.rowsSelected[index]['itemNo']);

    //         if(this.rowsSelected[index]['itemNo'] !== 0)
    //         {
    //           console.log(this.rowsSelected[index]['itemNo']);
    //             if( this.rowsSelected[index]['itemNo'] - 1 !== this.rowsSelected[index-1]['itemNo'])
    //             {
    //               this.handleErrorService.openMessageError('Chọn kỳ thanh toán xa nhất tới gần nhất!');
    //               return;
    //             }
    //         }

    //   }

      //validate kỳ chờ duyệt

      // this.tuitionService
      // .getBills(this.formSearch.value.studentCode, this.formSearch.value.univerCode)
      // .pipe()
      // .subscribe((res) => {
      //   if (res.data) {
      //     this.dataSource_Recall = res['data'];
      //     if(this.dataSource_Recall.length > 0)
      //     {
      //       this.rowsSelected.forEach((item) => {

      //           let isExisted = false;
      //           this.dataSource_Recall.forEach((item1) => {
      //                if(item.tuitionId === item1.tuitionId)
      //                {
      //                  isExisted = true;
      //                }
      //           })

      //           if(isExisted === false)
      //           {
      //             this.handleErrorService.openMessageError('Khoản học phí đã tạo đang chờ duyệt!');
      //             return;
      //           }


      //        })
      //     }else
      //     {
      //       this.handleErrorService.openMessageError('Khoản học phí đã tạo đang chờ duyệt!');
      //       return;
      //     }
      //   }
      // });


      if(valueForm.paymentMethod.startsWith("CP"))
      {
        if (valueForm.accountDebit === this.settleAccountInfo['settleAcNo']) {
          this.handleErrorService.openMessageError('Tài khoản ghi nợ không được trùng với tài khoản ghi có !');
          return;
        }
      }
     this.isLoading = true;
     const tranDetails = this.rowsSelected.map((item) => {
       return {
     ...item, billDescription: item.feeType
       };
     });



     let paymentAmount : number = this.paymentInfo.formPayment.value.paymentAmount;
     let feeAmount : number = this.paymentInfo.formPayment.value.feeAmount;
     let feeAmountvat : number = this.paymentInfo.formPayment.value.feeAmountvat;
     let feeAmount_ct : number = this.paymentInfo.formPayment.value.feeAmount_ct;
     let feeAmountvat_ct : number = this.paymentInfo.formPayment.value.feeAmountvat_ct;

     if(valueForm.paymentMethod.startsWith("CP"))
     {
        this.debitAccountInfo = {
          debitAcBrn : valueForm.accountBranchCodeDebit,
          debitAcDesc: valueForm.accountNameDebit,
          debitAcNo: valueForm.accountDebit
        };
     }
     else
     {
      this.debitAccountInfo = {
        debitAcBrn : 'GDTM',
        debitAcDesc: this.consta.name,
        debitAcNo: this.consta.accNo
      };
     }

    let tranPosts = [
      {
      acBrn: this.debitAccountInfo.debitAcBrn,
      acNumber: this.debitAccountInfo.debitAcNo,
      acName: this.debitAccountInfo.debitAcDesc,
      drcrType: 'D',
      lcyAmount: paymentAmount + feeAmount + feeAmountvat + feeAmount_ct + feeAmountvat_ct,
      ccy:'VND'
      },
      {
        acBrn: this.settleAccountInfo['settleAcBrn'],
        acNumber: this.settleAccountInfo['settleAcNo'],
        acName: this.settleAccountInfo['settleAcDesc'],
        drcrType: 'C',
        lcyAmount: paymentAmount,
        ccy:'VND'
      }
    ];

     if(feeAmount+feeAmount_ct > 0)
     {

        let tranPostFee: ITranPostResponse = {
          acBrn: valueForm.accountBranchCodeDebit,
          acNumber: 'FEE',
          acName: '',
          drcrType: 'C',
          lcyAmount: feeAmount+feeAmount_ct,
          ccy:'VND'
        };
        tranPosts.push(tranPostFee);
     }
     if(feeAmountvat+feeAmountvat_ct > 0)
     {
        let tranPostVat: ITranPostResponse = {
          acBrn: valueForm.accountBranchCodeDebit,
          acNumber: 'VAT',
          acName: '',
          drcrType: 'C',
          lcyAmount: feeAmountvat+feeAmountvat_ct,
          ccy:'VND'
        };
        tranPosts.push(tranPostVat);
     }

     let body: ITransactionCreate = {
       accBrn: this.settleAccountInfo['settleAcBrn'],
       accName: this.settleAccountInfo['settleAcDesc'],
       accNumber: this.settleAccountInfo['settleAcNo'],
       //availableBalance: valueForm.accountBalance,
       universityCode: this.paymentInfo.formPayment.value.univerCode,
       universityName: this.paymentInfo.formPayment.value.univerName,
       studentCode: tranDetails[0].studentCode,
       studentName: tranDetails[0].studentName,
       ccy: "VND",
       paymentType: valueForm.paymentMethod,
       totalAmount: valueForm.paymentAmount+valueForm.feeAmount+valueForm.feeAmountvat+valueForm.feeAmount_ct+feeAmountvat_ct,
       tranBrn: this.settleAccountInfo['settleAcBrn'],
       tranDesc: valueForm.paymentContent,
       customerName: this.paymentInfo.formPayment.value.customerName,
       soGttt: this.paymentInfo.formPayment.value.gtttnumber,
       gtttDate:  this.paymentInfo.formPayment.value.dateGttt? moment(this.paymentInfo.formPayment.value.dateGttt, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
       tranDetails: tranDetails,
       tranPosts: tranPosts,
       cif: this.paymentInfo.formPayment.value["numberDocType"],
       feeAmount: feeAmount_ct.toString(),
       vat:feeAmountvat_ct.toString(),
       feeDvTh:feeAmount.toString(),
       vatFeeDvTh:feeAmountvat.toString()
     };
     this.tuitionService
       .createPaymentBill(body)
       .toPromise()
       .then((res) => {
         this.openMessageSuccess(res['data']);
       })
       .catch((err) => {
         this.handleErrorService.handleError(err);
       })
       .finally(() => {
         this.isLoading = false;
       });
  }

  openMessageSuccess(data) {
    const dialog = this.matdialog.open(FormMessageComponent, {
      data: {
        type: 'ok',
        text: 'Lưu giao dịch thành công !',
        title: 'Thành công',
        btnOk: { text: 'Xem chi tiết', class: 'lpb-btn-primary' },
      },
      position: { top: '0px', right: '0px' },
    });

     dialog.afterClosed().subscribe((res) => {
       this.infoSearchChange();
       if (res) {
         sessionStorage.setItem('tuitionDataRowid', data.id);
         this.router.navigate(['/tuition-service/pay-tuition/view']);
       }
     });
  }

  disabledSave() {
    let formPayment = this.paymentInfo.formPayment;
    if (formPayment.value.paymentMethod === 'CP03' || formPayment.value.paymentMethod === 'CP04') {
      return (
        formPayment.controls['paymentAmount'].invalid ||
        formPayment.controls['paymentContent'].invalid ||
        formPayment.controls['accountNumberCredit'].invalid ||
        formPayment.controls['accountNameCredit'].invalid
      );
    }



    if (formPayment.value.paymentMethod === 'NP03' || formPayment.value.paymentMethod === 'NP04') {
      return (
        formPayment.controls['paymentAmount'].invalid ||
        formPayment.controls['paymentContent'].invalid ||
        formPayment.controls['accountNumberCredit'].invalid ||
        formPayment.controls['accountNameCredit'].invalid ||
        formPayment.controls['customerName'].invalid ||
        formPayment.controls['gtttnumber'].invalid ||
        formPayment.controls['dateGttt'].invalid
      );
    }
    return formPayment.invalid;
  }

  cancel() {
    this.clearSelected = false;
    const dialog = this.matdialog.open(FormMessageComponent, {
      data: {
        type: 'cancel',
        text: 'Các dữ liệu bạn vừa tạo sẽ bị xóa, bạn có muốn tiếp tục ?',
        title: 'Xác nhận',
        btnOk: { text: 'Xác nhận', class: 'btn-danger' },
        btnCancel: { text: 'Quay lại', class: 'btn-secondary' },
      },
      hasBackdrop: true,
      disableClose: true,
      backdropClass: 'bg-none',
    });
    dialog.afterClosed().subscribe((res) => {
      if (res) {
         this.removeContentPayment();
      }
    });
  }

  removeContentPayment() {
    for (let index = 0; index < this.dataSource.length; index++) {
      this.dataSource[index]['checked'] = false;
    }
    this.clearSelected = true;
    this.paymentInfo.resetFormPayment();
  }



}
