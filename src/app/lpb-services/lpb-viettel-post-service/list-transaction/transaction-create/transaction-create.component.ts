import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LpbDatatableColumn} from '../../../../shared/models/LpbDatatableColumn';
import {
  ACC_BRANCH_VIETTEL_POST,
  ACC_NAME_VIETTEL_POST,
  BILL_TABLE_VIETTEL_POST, CASH_ACCNAME, CASH_ACCNO
} from '../../shared/constants/viettel-post.constant';
import {LpbDatatableComponent} from '../../../../shared/components/lpb-datatable/lpb-datatable.component';
import {TransactionInfoComponent} from '../../shared/components/transaction-info/transaction-info.component';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {FormMessageComponent} from '../../../lpb-tuition-service/shared/components/form-message/form-message.component';
import {IError} from '../../../../system-configuration/shared/models/error.model';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {ViettelPostService} from '../../shared/services/viettelpost.service';
import {BreadCrumbHelper} from '../../../../shared/utilites/breadCrumb-helper';
import * as moment from 'moment';
import {ISupplierViettelPost} from '../../../../system-configuration/shared/models/lvbis-config.interface';

@Component({
  selector: 'app-transaction-create',
  templateUrl: './transaction-create.component.html',
  styleUrls: ['./transaction-create.component.scss']
})
export class TransactionCreateComponent implements OnInit {
  forms: FormGroup;
  configs = {
    defaultSort: 'makerDt:DESC',
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: false,
    hiddenActionColumn: true,
  };
  columnBills: LpbDatatableColumn [] = BILL_TABLE_VIETTEL_POST;
  dataBills: any;
  supplier: ISupplierViettelPost;
  dataBillSearch: any;
  @ViewChild('transactionInfo') transactionInfo: TransactionInfoComponent;
  @ViewChild(LpbDatatableComponent) child: LpbDatatableComponent;
  actions: ActionModel[] = [
    {
      actionName: 'Hủy tạo',
      actionIcon: 'cancel',
      actionClick: () => this.cancel(),
    },
    {
      actionName: 'Lưu',
      actionIcon: 'save',
      actionClick: () => this.save(),
    },
  ];

  constructor(
    private fb: FormBuilder,
    private notifyService: CustomNotificationService,
    private matdialog: MatDialog,
    private router: Router,
    private viettelPostService: ViettelPostService,
  ) {
    this.initFormGroup();
  }

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'Danh sách giao dịch',
      'Tạo giao dịch',
    ]);
    this.getInfoSupplier();

  }

  initFormGroup(): void {
    this.forms = this.fb.group({
      billCode: ['', [Validators.required]],
    });
  }

  search(): void {
    this.forms.controls.billCode.markAllAsTouched();
    if (this.forms.invalid) {
      return;
    }
    this.getDetailBill();
  }

  getInfoSupplier(): void {
    const filter = 'isActive|eq|ACTIVE';
    this.viettelPostService.getListSupplier(filter).subscribe((res) => {
      if (res.data[0]) {
        this.supplier = res.data[0];
        // this.transactionInfo.pathValueSupplier(this.supplier);
      } else {
        this.notifyService.error('Thông báo', 'Không tìm thấy thông tin NCC');
      }
    });
  }

  getDetailBill(): void {
    this.forms.controls.billCode.markAllAsTouched();
    if (this.forms.invalid) {
      return;
    }
    const params = {requestAccount: this.forms.get('billCode').value};
    this.viettelPostService.getInfoBill(params)
      .subscribe((res) => {
        if (res.data) {
          this.dataBillSearch = res.data.listCustomers[0];
          let data1 = [];
          res.data.listCustomers.forEach((item) => {
            data1 = item;
            this.dataBills = [{
              custId: item.customerInfo.custId,
              custName: item.customerInfo.custName,
              billCode: item.listBillInfos[0].billCode,
              billDesc: item.listBillInfos[0].billDesc,
              billAmount: item.listBillInfos[0].billAmount
            }];
          });
          setTimeout(() => {
            this.transactionInfo.pathValueSupplier(this.supplier, this.dataBills);
          });
        } else {
          this.notifyService.error('Thất bại', 'Không tìm thấy thông tin đại lý');
        }
      }, (error: IError) => {
        this.notifyService.handleErrors(error);
      });
  }

  cancel(): void {
    this.matdialog.closeAll();
    const dialog = this.matdialog.open(FormMessageComponent, {
      data: {
        type: 'cancel',
        text: 'Các dữ liệu bạn vừa tạo sẽ bị xóa, bạn có muốn tiếp tục ?',
        title: 'Xác nhận',
        btnOk: {text: 'Xác nhận', class: 'btn-danger'},
        btnCancel: {text: 'Quay lại', class: 'btn-secondary'},
      },
      hasBackdrop: true,
      disableClose: true,
      backdropClass: 'bg-none',
    });
    dialog.afterClosed().subscribe((res) => {
      if (res) {
        this.transactionInfo.initFormGroup();
      }
    });
  }

  save(): void {
    this.transactionInfo.formPayment.markAllAsTouched();
    if (this.transactionInfo.formPayment.invalid) {
      return;
    }
    const body = this.handleDataSave();
    if (body === null) {
      return;
    }
    // console.log('date--', moment(this.transactionInfo.formPayment.get('payerGtttDate').value, 'DD/MM/YYYY').format('YYYY-MM-DD'));
    this.viettelPostService.createTrans(body)
      .subscribe((res) => {
        if (res.data) {
          this.openMessageSuccess(res.data);
        } else {
          this.notifyService.error('Thất bại', 'Tạo giao dịch thất bại');
        }
        this.dataBills = null;
        this.dataBillSearch = null;
      }, (error: IError) => this.notifyService.handleErrors(error));
  }

  handleDataSave(): any {
    // Thong tin user
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const valueTransForm = this.transactionInfo.formPayment.getRawValue();
    const listBillInfos = this.dataBillSearch.listBillInfos[0];
    // tien mat / chuyen khoan
    const isCash = valueTransForm.paymentType === 'NT01';
    // Check so tien và tong tien bang ke
    if (isCash) {
      if (Number(valueTransForm.moneyListSum) !== Number(valueTransForm.paymentAmount.split('.').join(''))) {
        this.notifyService.error('Lỗi', 'Số tiền thanh toán và tổng tiền bảng kê có chênh lệch');
        return null;
      }
    }
    const body = {
      trnBrn: userInfo?.branchCode,
      trnName: userInfo?.branchName,
      trnDesc: valueTransForm.paymentContent,
      billCode: listBillInfos.billCode,
      cif: valueTransForm.numberDocType,
      paymentType: valueTransForm.paymentType,
      totalAmount: listBillInfos.billAmount,
      staffId: this.dataBillSearch.customerInfo.custId,
      staffName: this.dataBillSearch.customerInfo.custName,
      accNumber: isCash ? CASH_ACCNO : valueTransForm.accountDebit,
      accName: isCash ? CASH_ACCNAME : valueTransForm.accountNameDebit,
      accBrn: isCash ? userInfo?.branchCode : this.transactionInfo.accSelected.branchCode,
      ccy: 'VND',
      paymentChannel: 'UNIFORM',
      preBalance: valueTransForm.accountBalance,
      billId: listBillInfos.billId,
      billType: listBillInfos.billType,
      billStatus: listBillInfos.billStatus,
      billAmount: listBillInfos.billAmount,
      settleAmount: listBillInfos.settledAmount,
      amtUnit: listBillInfos.amtUnit,
      employeeName: listBillInfos.extraData.dataPartner.employeeName,
      paymentBankId: listBillInfos.extraData.dataPartner.paymentBankId,
      grandTotal: listBillInfos.extraData.dataPartner.grandTotal,
      paymentBankCode: listBillInfos.extraData.dataPartner.paymentBankCode,
      description: listBillInfos.extraData.dataPartner.description,
      employeeId: listBillInfos.extraData.dataPartner.employeeId,
      documentNo: listBillInfos.extraData.dataPartner.documentNo,
      orgCode: listBillInfos.extraData.dataPartner.orgCode,
      accountNo: listBillInfos.extraData.dataPartner.accountNo,
      documentId: listBillInfos.extraData.dataPartner.documentId,
      postCode: listBillInfos.extraData.dataPartner.postCode,
      statusPartner: listBillInfos.extraData.dataPartner.status,
      customerNo: this.dataBillSearch.customerInfo.customer_no,
      payerName: isCash ? valueTransForm.payerName : valueTransForm.accountNameDebit,
      payerGttt: valueTransForm.payerGttt,
      // payerGtttDate: valueTransForm.payerGtttDate,
      payerGtttDate: valueTransForm.payerGtttDate ? moment(valueTransForm.payerGtttDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
      transactionPostRequests: [
        {
          acBrn: this.supplier.accBranch,
          ccy: 'VND',
          acNumber: valueTransForm.accountNumberCredit,
          acName: valueTransForm.accountNameCredit,
          accountType: '',
          drcrInd: 'C',
          lcyAmount: valueTransForm.paymentAmount.split('.').join(''),
          trnDesc: valueTransForm.paymentContent
        },
        {
          acBrn: isCash ? userInfo?.branchCode : this.transactionInfo.accSelected.branchCode,
          ccy: 'VND',
          acNumber: isCash ? CASH_ACCNO : valueTransForm.accountDebit,
          acName: isCash ? CASH_ACCNAME : valueTransForm.accountNameDebit,
          accountType: '',
          drcrInd: 'D',
          lcyAmount: valueTransForm.paymentAmount.split('.').join(''),
          trnDesc: valueTransForm.paymentContent
        }],
      // categoryCashRequests: []
      categoryCashRequests: isCash ? valueTransForm.moneyList : []
    };
    console.log('body', body);
    return body;
  }

  openMessageSuccess(data): void {
    const dialog = this.matdialog.open(FormMessageComponent, {
      data: {
        type: 'ok',
        text: 'Lưu giao dịch thành công !',
        title: 'Thành công',
        btnOk: {text: 'Xem chi tiết', class: 'lpb-btn-primary'},
      },
      position: {top: '0px', right: '0px'},
    });

    dialog.afterClosed().subscribe((res) => {
      this.dataBills = null;
      this.dataBillSearch = null;
      if (res) {
        this.router.navigate(['/viettel-post-service/list-transaction/view'], {queryParams: {id: data.id}});
      }
    });
  }
}
